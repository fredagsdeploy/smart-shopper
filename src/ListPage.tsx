import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectItems } from "./reducers/shoppingLists";
import ListItem from "./ListItem";
import FlipMove from "react-flip-move";
import _ from "lodash";

export enum ShoppingItem {
  "Bananer" = "Bananer",
  "Äpplen" = "Äpplen",
  "Mjölk" = "Mjölk",
  "Mjöl" = "Mjöl",
  "Kyckling" = "Kyckling",
  "Ägg" = "Ägg",
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

  console.log(dataStore);

  return dataStore;
}

function getOrder() {}

function useOrder() {
  const previousItemRef = useRef<Relatables>(Place.Start);
  const [items, setItems] = useState(
    Object.values(useSelector(selectItems("asd")))
  );

  const doSort = useCallback(
    (item: Relatables) => {
      const [overst, underst] = _.partition(items, (i) =>
        dataStore[item]?.some((b) => b.other === i.name)
      );

      const newOverst = _.orderBy(overst, (i) => {
        return -(dataStore[item]?.find((b) => b.other === i.name)?.score ?? 0);
      });

      setItems([...newOverst, ...underst]);
    },
    [items]
  );

  const onCheck = useCallback(
    (item: ShoppingItem) => {
      onItemCheck(item, previousItemRef.current);
      previousItemRef.current = item;

      doSort(item);
    },
    [doSort]
  );

  useEffect(() => {
    doSort(previousItemRef.current);
  }, []);

  return {
    items,
    onCheck,
  };
}

export const ListPage = () => {
  const { items, onCheck } = useOrder();
  const oItems = Object.values(useSelector(selectItems("asd")));

  return (
    <main>
      <Header>Smart Shopper</Header>
      <FlipMove>
        {items
          .filter((i) => !oItems.find((b) => i.name === b.name)!.checked)
          .map((i) => (
            <ListItem
              key={i.id}
              itemId={i.id}
              onClick={() => onCheck(i.name)}
            />
          ))}
      </FlipMove>
      <hr />
      {items
        .filter((i) => oItems.find((b) => i.name === b.name)!.checked)
        .map((i) => (
          <ListItem key={i.id} itemId={i.id} onClick={_.noop} />
        ))}
    </main>
  );
};

const Header = styled.h1`
  margin-left: 1rem;
`;
