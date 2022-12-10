import neo4j from "neo4j-driver";
import { ItemGraph, Relatable, Place, START_TOKEN } from "./types/types";
import { partition, sortBy } from "lodash";

const driver = neo4j.driver(
  `neo4j://${process.env.DATABASE_HOST}`,
  neo4j.auth.basic(process.env.DATABASE_USER!, process.env.DATABASE_PASSWORD!)
);

type Meta = {
  storeName: string;
  userId: string;
};

type CheckItemInput = Meta & {
  from: string;
  to: string;
};

type UncheckItemInput = Meta & {
  uncheckedItemFrom: string;
  uncheckedItemTo: string;
};

export const uncheckItem = async ({
  uncheckedItemFrom,
  uncheckedItemTo,
  storeName,
  userId,
}: UncheckItemInput) => {
  const session = driver.session({
    database: process.env.DATABASE,
    defaultAccessMode: neo4j.session.WRITE,
  });

  await session.run(
    `MERGE (unchecked: Item {name: $uncheckedItemTo})
     MERGE (to: Item {name: $uncheckedItemFrom}})
     MERGE (unchecked)<-[r: NEAR {storeName: $storeName, userId: $userId}]-(to)
      ON CREATE SET r.gravity = 0 
      ON MATCH SET r.gravity = r.gravity - 1`,
    {
      uncheckedItemTo,
      uncheckedItemFrom,
      storeName,
      userId,
    }
  );
};

export const checkItem = async ({
  from,
  to,
  storeName,
  userId,
}: CheckItemInput) => {
  const session = driver.session({
    database: process.env.DATABASE,
    defaultAccessMode: neo4j.session.WRITE,
  });

  await session.run(
    `MERGE (from: Item {name: $from})
     MERGE (to: Item {name: $to})  
     MERGE (from)-[r: NEAR {storeName: $storeName, userId: $userId}]-(to)
      ON CREATE SET r.gravity = 1
      ON MATCH SET r.gravity = r.gravity + 1`,
    {
      from,
      to,
      storeName,
      userId,
    }
  );
  await session.close();
};

type WithText = { text: string };

export const sortItems = async <T extends WithText>(
  list: T[],
  { storeName, userId }: Meta,
  checkedItem: WithText = { text: START_TOKEN }
): Promise<T[]> => {
  const session = driver.session({
    database: process.env.DATABASE,
    defaultAccessMode: neo4j.session.WRITE,
  });

  const result = await session.run(
    "MATCH p = (to: Item { name: $checkedItemText })-[r:NEAR  ]->(from) RETURN from, r",
    {
      checkedItemText: checkedItem.text,
      storeName,
      userId,
    }
  );
  await session.close();

  const score_of_items: Record<string, Number> = {};

  result.records.forEach((record) => {
    const name = record.get("from").properties.name;
    score_of_items[name] = record.get("r").properties.gravity.toInt();
  });

  const [relatedItems, unrelatedItems] = partition(list, (i) => {
    return score_of_items.hasOwnProperty(i.text);
  });

  return [
    ...sortBy(relatedItems, (item) => score_of_items[item.text]),
    ...unrelatedItems,
  ];
};

export const generateItemGraph = async (
  storeName: string,
  userId: string
): Promise<ItemGraph> => {
  const newGraph: ItemGraph = {};

  const session = driver.session({
    database: process.env.DATABASE,
    defaultAccessMode: neo4j.session.WRITE,
  });

  const result = await session.run(
    "MATCH p = (to)-[r:NEAR {storeName: $storeName, userId: $userId} ]-(from) RETURN to, from, r",
    {
      storeName,
      userId,
    }
  );

  result.records.forEach((record) => {
    const first = record.get("to").properties.name;
    const second = record.get("from").properties.name;
    const gravity = record.get("r").properties.gravity.toInt();

    newGraph[first] = increaseEdgeScore(
      newGraph[second] ?? [],
      second,
      gravity
    );
  });
  await session.close();

  return newGraph;
};

export const increaseEdgeScore = (
  edges: Relatable[],
  targetNodeName: string,
  value: number = 1
) => {
  let found = false;
  const newEdges: Relatable[] = edges.map((edge) => {
    if (edge.item === targetNodeName) {
      found = true;
      return { ...edge, score: edge.score + value };
    } else {
      return edge;
    }
  });

  if (!found) {
    newEdges.push({ item: targetNodeName, score: value });
  }
  return newEdges;
};

process.on("exit", () => {
  driver.close();
});
