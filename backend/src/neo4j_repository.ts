import neo4j from "neo4j-driver";
import { ItemGraph, Relatable } from "./types";
import { scryptSync } from "crypto";

console.log(process.env);

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
    "MATCH p = (to)-[r:NEAR {store: $storeName, userId: $userId} ]->(from) RETURN to, from, r",
    {
      storeName,
      userId,
    }
  );

  result.records.forEach((record) => {
    console.log(record);

    let first_food = record.get("to").get("name");
    let second_food = record.get("from").get("name");
    let gravity = record.get("r").get("gravity");

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

export const addNode = async (foodNames: string[]) => {
  let session = driver.session({
    database: process.env.DATABASE,
    defaultAccessMode: neo4j.session.WRITE,
  });

  await Promise.all(
    foodNames.map((foodName) => {
      return session.run("CREATE (:Food {name : $foodName})", {
        foodName,
      });
    })
  );
};

export const addEdge = async (
  foodRelationships: {
    fromFood: string;
    toFood: string;
    storeName: string;
    userId: string;
  }[]
) => {
  let session = driver.session({
    database: process.env.DATABASE,
    defaultAccessMode: neo4j.session.WRITE,
  });

  await Promise.all(
    foodRelationships.map(({ fromFood, toFood, storeName, userId }) => {
      return session.run(
        "MATCH (from: Food {name: $fromFood})\n" +
          "MATCH (to: Food {name: $toFood})\n" +
          "MERGE (from)-[r: NEAR {storeName: $storeName, userId: $userId}]->(to)\n" +
          "ON CREATE\n" +
          "  SET r.gravity = 1\n" +
          "ON MATCH\n" +
          "  SET r.gravity += 1",
        {
          fromFood,
          toFood,
          storeName,
          userId,
        }
      );
    })
  );
};

process.on("exit", () => {
  driver.close();
});
