import { ShoppingListItems } from "../reducers/shoppingLists";
import { useCallback, useMemo, useRef } from "react";
import _ from "lodash";
import { Place, Relatable, Relatables, ShoppingItem } from "../types";

const dataStore: Partial<Record<
  Relatables,
  Relatable[]
>> = require("../dataStoreSvenska.json");
dataStore[Place.Start] = [
  {
    item: "Fläskkött",
    score: 1,
  },
  {
    item: "Äpple",
    score: 10,
  },
];

function onItemCheck(item: ShoppingItem, previous: Relatables) {
  if (!dataStore[previous]) {
    dataStore[previous] = [];
  }

  const candidate = dataStore[previous]!.find(
    (relatable) => relatable.item === item
  );

  if (candidate) {
    candidate.score = candidate.score + 1;
  } else {
    dataStore[previous]?.push({ item: item, score: 1 });
  }

  return dataStore;
}

export function useOrder(shoppingCardItems: ShoppingListItems) {
  const previousItemRef = useRef<Relatables>(Place.Start);
  const shoppingCartItemsValues = Object.values(shoppingCardItems);

  const setCurrentItem = useCallback((item: ShoppingItem) => {
    onItemCheck(item, previousItemRef.current);
    previousItemRef.current = item;
  }, []);

  const [checkedItems, uncheckedItems] = useMemo(() => {
    const item = previousItemRef.current;

    let dataStoreElement = dataStore[item];
    const [relatedItems, unrelatedItems] = _.partition(
      shoppingCartItemsValues,
      (i) => {
        if (dataStoreElement) {
          return dataStoreElement.some(
            (relatable) => relatable.item === i.name
          );
        }

        return false;
      }
    );

    const orderedRelatedItems = _.orderBy(
      relatedItems,
      (i) => {
        return dataStoreElement?.find((relatable) => relatable.item === i.name)
          ?.score;
      },
      ["desc"]
    );

    return _.partition(
      [...orderedRelatedItems, ...unrelatedItems],
      (item) => item.checked
    );
  }, [shoppingCartItemsValues]);

  return {
    checkedItems,
    uncheckedItems,
    setCurrentItem,
  };
}
