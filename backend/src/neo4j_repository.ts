import neo4j from "neo4j-driver";
import { ItemGraph, Relatable } from "./types";

const driver = neo4j.driver(
  `neo4j://${process.env.DATABASE_HOST}`,
  neo4j.auth.basic(process.env.DATABASE_USER!, process.env.DATABASE_PASSWORD!)
);

export const generateItemGraph = async (
  storeName: string,
  userId: string
): Promise<ItemGraph> => {
  const newGraph = {};

  const session = driver.session({
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
