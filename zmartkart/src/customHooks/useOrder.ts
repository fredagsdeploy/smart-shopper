import { ShoppingListItems } from "../reducers/shoppingLists";
import { useCallback, useMemo, useRef, useState } from "react";
import _ from "lodash";
import {
  ItemGraph,
  Place,
  Relatable,
  Relatables,
  ShoppingItem,
} from "../types";
import { useSelector } from "react-redux";
import { selectItemGraph } from "../reducers/itemGraph";
import { ListItem } from "../backend";

export function useOrder(shoppingCardItems: ListItem[]) {
  const [previousItem, setPreviousItem] = useState<Relatables>(Place.Start);

  const shoppingCartItemsValues = Object.values(shoppingCardItems);

  const itemGraph = useSelector(selectItemGraph);

  const [checkedItems, uncheckedItems] = (() => {
    let graphElement = itemGraph[previousItem];

    const [relatedItems, unrelatedItems] = _.partition(
      shoppingCartItemsValues,
      (i) => {
        if (graphElement) {
          return graphElement.some((relatable) => relatable.item === i.name);
        }

        return false;
      }
    );

    const orderedRelatedItems = _.orderBy(
      relatedItems,
      (i) => {
        return graphElement?.find((relatable) => relatable.item === i.name)
          ?.score;
      },
      ["desc"]
    );

    return _.partition(
      [...orderedRelatedItems, ...unrelatedItems],
      (item) => item.checked
    );
  })();

  return {
    checkedItems,
    uncheckedItems,
    setCurrentItem: setPreviousItem,
  };
}
