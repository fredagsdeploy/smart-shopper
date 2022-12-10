import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { prisma } from "~/db.server";
import invariant from "tiny-invariant";
import { checkItem, sortItems, uncheckItem } from "~/neo4j.server";
import { START_TOKEN } from "~/types/types";
import { createItem, findItem, setItemChecked } from "~/models/item.server";
import { groupBy } from "lodash";

let storeName = "ICA Maxi";
let userId = "YaBoi";

export const loader = async ({ params }: LoaderArgs) => {
  const list = await prisma.list.findFirst({
    where: { id: params.id },
    include: { items: true },
  });

  if (!list) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const { checked = [], unchecked = [] } = groupBy(list.items, (item) =>
    item.checked ? "checked" : "unchecked"
  );

  const sortedUnchecked = await sortItems(
    unchecked,
    { storeName, userId },
    { text: list.lastCheckedItem || START_TOKEN }
  );

  list.items = [...sortedUnchecked, ...checked];

  return json({ list });
};

export const action = async ({ request, params }: ActionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  const listId = params.id!;

  const { _action, ...values } = formData;
  try {
    if (_action === "add") {
      invariant(typeof values.text === "string", "text must be string");
      const text = values.text.trim();
      invariant(text.length > 0, "text must be longer than 0");

      await createItem(listId, text);
    }

    if (_action === "check") {
      const itemId = values.itemId;
      invariant(typeof itemId === "string", "itemId is defined");
      const item = await findItem(itemId);
      const list = await prisma.list.findFirstOrThrow({
        where: { id: listId },
      });

      const lastItemCheckedInList = list.lastCheckedItem ?? START_TOKEN;

      await checkItem({
        from: lastItemCheckedInList,
        to: item.text,
        storeName,
        userId,
      });
      await setItemChecked(listId, itemId, item.text, true);
    }
    if (_action === "uncheck") {
      const itemId = values.itemId;
      invariant(typeof itemId === "string", "itemId is defined");

      const item = await findItem(itemId);

      await setItemChecked(listId, itemId, item.text, false);
    }
    if (_action === "undo") {
      const itemId = values.itemId;
      invariant(typeof itemId === "string", "itemId is defined");
      // TODO This is now undo only, unchecking in the middle of a list is unsupported as it doesn't mean anything definitive
      // TODO needs a pair of items
      await uncheckItem({
        uncheckedItemFrom: itemId,
        uncheckedItemTo: itemId,
        storeName: storeName,
        userId: userId,
      });
    }

    return null;
  } catch (e: any) {
    return { error: e.message };
  }
};

export default function Pages() {
  const transition = useTransition();
  const { list } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const textRef = useRef<HTMLInputElement>(null);

  const isAdding = transition.submission?.formData.get("_action") === "add";

  useEffect(() => {
    if (isAdding && textRef.current) {
      textRef.current.value = "";
    }
  }, [isAdding]);

  return (
    <div>
      <h2>{list.name}</h2>
      <ul>
        {list.items.map((item) => (
          <li
            key={item.id}
            style={{
              textDecoration: item.checked ? "line-through" : undefined,
            }}
          >
            <Form replace method={"post"}>
              <input type="hidden" name={"itemId"} value={item.id} />
              <button
                name={"_action"}
                value={item.checked ? "uncheck" : "check"}
              >
                {item.checked ? "☑️" : "⬜️"}
              </button>{" "}
              {item.text}
            </Form>
          </li>
        ))}
      </ul>
      <Form replace method={"post"}>
        <input type="text" name={"text"} ref={textRef} />
        <button name={"_action"} value={"add"}>
          Submit
        </button>
        {actionData?.error ? <div>{actionData.error}</div> : null}
      </Form>
    </div>
  );
}
