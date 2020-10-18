import React, { forwardRef, useCallback, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectItems, toggleItem } from "./reducers/shoppinglist";
import ListItem from "./ListItem";
import FlipMove from "react-flip-move";
import _ from "lodash";

export const ListPage = () => {
  const items = useSelector(selectItems);
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
