import neo4j from 'neo4j-driver';
import {ItemGraph, Place, Relatable, TimedCheckedUncheckedEvent} from "../../frontend/src/types";
import _ from "lodash";

let driver = neo4j.driver(
  `neo4j://${process.env.DATABASE_HOST}`,
  neo4j.auth.basic(process.env.DATABASE_USER!, process.env.DATABASE_PASSWORD!)
)

export const generateItemGraph = async (
  storeName: string,
  userId: string,
): Promise<ItemGraph> => {
  let newGraph = {};

  let session = driver.session({
    database: 'foo',
    defaultAccessMode: neo4j.session.WRITE
  })

  const result = await session
    .run('MATCH p = (food1:Food)-[r:NEAR {store: $storeName, userId: $userId} ]->(food2:Food) RETURN food1, food2, r', {
      storeName, userId
    });

  result.records.forEach(record => {
      console.log(record)

      let first_food = record.get("food1");
      let second_food = record.get("food2");
      let relationship = record.get("r");

      newGraph[first_food] = increaseEdgeScore(
        newGraph[second_food] ?? [],
        second_food,
        relationship.gravity
      );
    }
  )
  await session.close();

  return newGraph;
};

export const increaseEdgeScore = (
  edges: Relatable[],
  targetNodeName: string,
  value: number = 1,
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
  driver.close()
});

