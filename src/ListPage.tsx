import React, {forwardRef, useCallback, useRef, useState} from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectItems, toggleItem } from "./reducers/shoppinglist";
import ListItem from "./ListItem";
import FlipMove from "react-flip-move";
import _ from "lodash";

export enum ShoppingItem {
  "Bananer",
  "Äpplen",
  "Mjölk",
  "Mjöl",
  "Kyckling",
  "Ägg",
}

enum Place {
  Start,
  End,
}

type Relatables = ShoppingItem | Place;

interface Obj {
  other: ShoppingItem;
  score: number;
}

const dataStore: Partial<Record<Relatables, Obj[]>> = {
  [Place.Start]: [
    {
      other: ShoppingItem.Bananer,
      score: 10,
    },
    {
      other: ShoppingItem.Kyckling,
      score: 1,
    },
  ],
  [ShoppingItem.Bananer]: [
    {
      other: ShoppingItem.Äpplen,
      score: 1,
    },
  ],
  [ShoppingItem.Äpplen]: [
    {
      other: ShoppingItem.Bananer,
      score: 1,
    },
  ],
  [ShoppingItem.Mjölk]: [
    {
      other: ShoppingItem.Bananer,
      score: 1,
    },
    {
      other: ShoppingItem.Mjöl,
      score: 4,
    },
  ],
};

function onItemCheck(item: ShoppingItem, previous: Relatables) {
  if (!dataStore[previous]) {
    dataStore[previous] = [];
  }

  const candidate = dataStore[previous]!.find((o) => o.other === item);

  if (candidate) {
    candidate.score = candidate.score + 1;
  } else {
    dataStore[previous]?.push({ other: item, score: 1 });
  }

  return dataStore;
}

function getOrder() {}

function useOrder() {
  const items = useSelector(selectItems);
  const previousItemRef = useRef<Relatables>(Place.Start);

  const onCheck = useCallback((item: ShoppingItem) => {
    onItemCheck(item, previousItemRef.current);
    previousItemRef.current = item;
    const overst = Object.values(items).filter((i) =>
      dataStore[item]?.some((b) => b.other === i.name)
    );
    const nederst = Object.values(items).filter((i) =>
      dataStore[item]?.some((b) => b.other === i.name)
    );
  }, []);

  return {
    items,
    onCheck,
  };
}

export const ListPage = () => {
  const items = useOrder();
  const dispatch = useDispatch();

  const [_items, setItems] = useState(Object.values(items));

  const shuffle = useCallback(() => setItems(_.shuffle(items)), [_items]);
  const sortAlphabetically = useCallback(
    () => setItems(_.orderBy(items, "name")),
    [_items]
  );
  const unsort = useCallback(() => setItems(Object.values(items)), [_items]);

  return (
    <main>
      <Header>Smart Shopper</Header>
      <div>
        <button
          onClick={() => {
            shuffle();
          }}
        >
          Shuffle
        </button>
        <button
          onClick={() => {
            sortAlphabetically();
          }}
        >
          Sort A-Z
        </button>
        <button
          onClick={() => {
            unsort();
          }}
        >
          Unsort
        </button>
      </div>
      <FlipMove>
        {_items.map((i) => (
          <ListItem key={i.id} itemId={i.id} />
        ))}
      </FlipMove>
    </main>
  );
};

const Header = styled.h1`
  margin-left: 1rem;
`;
