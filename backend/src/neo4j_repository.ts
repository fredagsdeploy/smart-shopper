import neo4j from "neo4j-driver";
import { ItemGraph, Relatable } from "./types";

let driver = neo4j.driver(
  `neo4j://${process.env.DATABASE_HOST}`,
  neo4j.auth.basic(process.env.DATABASE_USER!, process.env.DATABASE_PASSWORD!)
);

export const generateItemGraph = async (
  storeName: string,
  userId: string
): Promise<ItemGraph> => {
  let newGraph = {};

  let session = driver.session({
    database: process.env.DATABASE,
    defaultAccessMode: neo4j.session.WRITE,
  });

  const result = await session.run(
    "MATCH p = (to)-[r:NEAR {storeName: $storeName, userId: $userId} ]->(from) RETURN to, from, r",
    {
      storeName,
      userId,
    }
  );

  result.records.forEach((record) => {
    console.log(record)
    console.log(record.get("r").properties)

    let first_food = record.get("to").properties.name
    let second_food = record.get("from").properties.name
    let gravity = record.get("r").properties.gravity.toInt()

    newGraph[first_food] = increaseEdgeScore(
      newGraph[second_food] ?? [],
      second_food,
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
  let newEdges: Relatable[] = edges.map((edge) => {
    if (edge.item == targetNodeName) {
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