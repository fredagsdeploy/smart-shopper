require("dotenv").config();
import { Err, Ok, Result } from "./types/result";
import { ItemId, ListEvent, ListId, StoreId, UserId } from "./types/listEvents";
import express, { Request } from "express";
import { generateItemGraph } from "./neo4j_repository";
import produce from "immer";

import kafka from "kafka-node";

import bodyParser from "body-parser";
import { StoreName } from "./types/queries";

const { Producer, Consumer } = kafka;
const client = new kafka.KafkaClient({ kafkaHost: "tejpb.it:9092" });
const producer = new Producer(client);
const consumer = new Consumer(
  client,
  [
    {
      topic: "list",
      offset: 0,
    },
  ],
  {
    autoCommit: false,
    fromOffset: true,
  }
);

interface ListItem {
  id: ItemId;
  name: string;
  checked: boolean;
}

interface List {
  name: string;
  id: ListId;
  storeId: StoreId;
  items: Record<ItemId, ListItem>;
}

type ListsByUserId = Record<UserId, Record<ListId, List>>;

let listsByUserId: ListsByUserId = {};

const listReducer = (state: ListsByUserId, action: ListEvent): void => {
  const { userId, listId } = action.payload;
  if (!state[userId]) {
    state[userId] = {};
  }

  switch (action.type) {
    case "createList": {
      const { name, storeId } = action.payload;

      if (!state[userId][listId]) {
        state[userId][listId] = { name, storeId, id: listId, items: {} };
      }
      return;
    }
    case "moveListToStore": {
      const { listId, storeId } = action.payload;

      if (state[userId][listId]) {
        state[userId][listId].storeId = storeId;
      }
      return;
    }
    case "removeList": {
      const { listId } = action.payload;

      delete state[userId][listId];
      return;
    }
    case "appendItemToList": {
      const {
        item: { name, id },
      } = action.payload;

      if (state[userId][listId]) {
        state[userId][listId].items[id] = { id, name, checked: false };
      }
      return;
    }

    case "renameItem": {
      const {
        item: { name, id },
      } = action.payload;

      if (state[userId][listId]?.items[id]) {
        state[userId][listId].items[id].name = name;
      }
      return;
    }
    case "checkItem": {
      const { itemId: id } = action.payload;

      if (state[userId][listId]?.items[id]) {
        state[userId][listId].items[id].checked = true;
      }
      return;
    }
    case "uncheckItem": {
      const { itemId: id } = action.payload;

      if (state[userId][listId]?.items[id]) {
        state[userId][listId].items[id].checked = false;
      }
      return;
    }

    case "removeItem": {
      const { itemId: id } = action.payload;

      delete state[userId][listId]?.items[id];
      return;
    }
  }
};

consumer.on("message", (message) => {
  const action = JSON.parse(message.value.toString()) as ListEvent;
  listsByUserId = produce(listsByUserId, (draft) => {
    listReducer(draft, action);
  });
  console.log(listsByUserId, action);
});

consumer.on("error", (err) => {
  console.log("Consumer error", err);
});
consumer.on("offsetOutOfRange", (err) => {
  console.log("Consumer offsetOutOfRange", err);
});

let producerReady = false;
let producerError = null;
producer.on("ready", () => {
  producerReady = true;
});
producer.on("error", (err) => {
  producerError = err;
});

const app = express();
const port = 8080;
app.get(
  "/api",
  async (req: Request<unknown, unknown, unknown, StoreName>, res) => {
    try {
      const userId = req.header("X-Forwarded-User")!;
      const email = req.header("X-Forwarded-Email");

      const storeName = req.query.storeName;

      if (!storeName) {
        res.status(400).send({ error: "Missing storeName" });
        return;
      }

      const graph = await generateItemGraph(storeName, userId);
      res.send({ hello: "world", userId, email, graph: graph });
    } catch (error) {
      res.status(500).send({ error });
    }
  }
);

app.post(
  "/api/itemEvent",
  async (req: Request<unknown, unknown, ListEvent, StoreName>, res) => {
    if (!producerReady) {
      res
        .status(503)
        .send({ error: producerError ?? "Event producer not ready" });
      return;
    }

    const userId = req.header("X-Forwarded-User")!;
    const email = req.header("X-Forwarded-Email");

    const storeName = req.query.storeName;

    if (!storeName) {
      res.status(400).send({ error: "Missing storeName" });
      return;
    }

    const graph = await generateItemGraph(storeName, userId);
    res.send({ userId, email, graph: graph });
  }
);

app.get("/api/lists", async (req, res) => {
  const userId = req.header("X-Forwarded-User")!;
  res.json(listsByUserId[userId] ?? {});
});

app.post(
  "/api/listEvent",
  bodyParser.json(),
  async (
    req: Request<unknown, Result<{ ok: boolean }, string>, ListEvent>,
    res
  ) => {
    if (!producerReady) {
      res
        .status(503)
        .send(new Err(producerError ?? "Event producer not ready"));
      return;
    }

    const userId = req.header("X-Forwarded-User")!;

    console.log(req.body);

    const event = req.body;

    event.payload.userId = userId;

    producer.send(
      [
        {
          topic: "list",
          key: event.payload.listId,
          messages: [JSON.stringify(event)],
        },
      ],
      (error, data) => {
        if (error) {
          console.log("error", error);

          res.send(new Err("Error!"));
        } else {
          console.log("data", data);
          res.send(new Ok({ ok: true }));
        }
      }
    );
    // handleListEvent(event);
  }
);

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
