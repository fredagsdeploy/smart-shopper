import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectItems, toggleItem } from "./reducers/shoppinglist";
import ListItem from "./ListItem";

export const ListPage = () => {
  const items = useSelector(selectItems);
  const dispatch = useDispatch();

  return (
    <main>
      <Header>Smart Shopper</Header>
      {Object.values(items).map((i) => (
        <ListItem
          key={i.id}
          itemName={i.name}
          checked={i.checked}
          onPress={() => {
            dispatch(toggleItem(i.id));
          }}
        />
      ))}
    </main>
  );
};

const Header = styled.h1`
  margin-left: 1rem;
`;
