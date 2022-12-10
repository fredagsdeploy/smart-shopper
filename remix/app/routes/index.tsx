import React from "react";
import { Form } from "@remix-run/react";
import { ActionArgs, redirect } from "@remix-run/node";
import { createList } from "~/models/list.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  const { _action, ...values } = formData;

  if (_action === "create_list") {
    console.log("create_list", values.list_name);
    const list = await createList(values.list_name as string, "tejp");
    return redirect(`lists/${list.id}`);
  }

  return null;
};

export default function Root() {
  return (
    <div>
      <h3>Smart Cart</h3>
      <Form replace method="post">
        <input type="text" name="list_name" />
        <button name={"_action"} value="create_list">
          Create list
        </button>
      </Form>
    </div>
  );
}
