import React, { useCallback, useMemo, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  selectItems,
  ShoppingListItems,
  toggleItem,
  updateItem,
} from "./reducers/shoppingLists";
import ListItem from "./ListItem";
import FlipMove from "react-flip-move";
import _ from "lodash";
import { useParams } from "react-router-dom";

export type ShoppingItem = string;

//export enum ShoppingItem {
//  "Bananer" = "Bananer",
//  "Äpplen" = "Äpplen",
//  "Mjölk" = "Mjölk",
//  "Mjöl" = "Mjöl",
//  "Kyckling" = "Kyckling",
//  "Ägg" = "Ägg",
//}

enum Place {
  Start,
  End,
}

type Relatables = ShoppingItem | Place;

interface Relatable {
  item: ShoppingItem;
  score: number;
}

const dataStore: Partial<Record<Relatables, Relatable[]>> = {
  [Place.Start]: [
    {
      item: "Bananer",
      score: 10,
    },
    {
      item: "Kyckling",
      score: 1,
    },
  ],
  Bananer: [
    {
      item: "Äpplen",
      score: 1,
    },
  ],
  Äpplen: [
    {
      item: "Bananer",
      score: 1,
    },
  ],
  Mjölk: [
    {
      item: "Bananer",
      score: 1,
    },
    {
      item: "Mjöl",
      score: 4,
    },
  ],
};

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

function useOrder(shoppingCardItems: ShoppingListItems) {
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

const SHOPPING_LIST_ID = "asd";

export const ListPage = () => {
  const dispatch = useDispatch();
  let { shoppingListId } = useParams();
  const { checkedItems, uncheckedItems, setCurrentItem } = useOrder(
    useSelector(selectItems(SHOPPING_LIST_ID))
  );

  if (checkedItems === undefined) {
    return <div>No such shopping list</div>;
  }

  return (
    <main>
      <Header>Smart Shopper {shoppingListId}</Header>
      <FlipMove>
        {uncheckedItems.map((item) => (
          <ListItem
            key={item.id}
            checked={false}
            onChange={() => {
              dispatch(
                toggleItem({
                  shoppingListId: SHOPPING_LIST_ID,
                  itemId: item.id,
                })
              );
              setCurrentItem(item.name);
            }}
            name={item.name}
            onNameChange={(name: string) => {
              dispatch(
                updateItem({
                  shoppingListId: shoppingListId,
                  itemId: item.id,
                  item: {
                    name,
                  },
                })
              );
            }}
          />
        ))}
      </FlipMove>
      <hr />
      {checkedItems.map((item) => (
        <ListItem
          key={item.id}
          checked={true}
          onChange={() => {
            dispatch(
              toggleItem({ shoppingListId: SHOPPING_LIST_ID, itemId: item.id })
            );
          }}
          name={item.name}
          onNameChange={(name: string) => {
            dispatch(
              updateItem({
                shoppingListId: shoppingListId,
                itemId: item.id,
                item: {
                  name,
                },
              })
            );
          }}
        />
      ))}
    </main>
  );
};

const Header = styled.h1`
  margin-left: 1rem;
`;
