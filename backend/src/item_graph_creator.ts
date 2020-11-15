import {
  ItemGraph,
  Place,
  Relatable,
  TimedCheckedUncheckedEvent,
} from "../../frontend/src/types";
import _ from "lodash";

export const generateItemGraph = (
  checkedUncheckedEvents: TimedCheckedUncheckedEvent[],
  previousGraph?: ItemGraph
): ItemGraph => {
  let newGraph = previousGraph || {};

  let shoppingListGroups = _.groupBy(checkedUncheckedEvents, "shoppingListId");

  Object.keys(shoppingListGroups).forEach((shoppingListId) => {
    let shoppingList = shoppingListGroups[shoppingListId];
    if (shoppingList.length === 0) {
      return;
    }

    shoppingList = _.orderBy(shoppingList, "time");
    newGraph[Place.Start] = increaseEdgeScore(
      newGraph[Place.Start] ?? [],
      shoppingList[0].name
    );
    if (shoppingList.length === 1) {
      newGraph[shoppingList[0].name] = [];
    } else {
      shoppingList.reduce((prev, curr) => {
        newGraph[prev.name] = increaseEdgeScore(
          newGraph[prev.name] ?? [],
          curr.name
        );
        return curr;
      });
      // ! is safe, cannot be undefined since i check length of list at start of forEach
      newGraph[_.last(shoppingList)!.name] = [];
    }
  });

  return newGraph;
};

export const increaseEdgeScore = (
  edges: Relatable[],
  targetNodeName: string
) => {
  let found = false;
  let newEdges: Relatable[] = edges.map((edge) => {
    if (edge.item == targetNodeName) {
      found = true;
      return { ...edge, score: edge.score + 1 };
    } else {
      return edge;
    }
  });

  if (!found) {
    newEdges.push({ item: targetNodeName, score: 1 });
  }
  return newEdges;
};
