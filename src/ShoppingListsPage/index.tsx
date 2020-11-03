import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectShoppingLists } from "../reducers/shoppingLists";
import { SmartShoppingList } from "../SmartShoppingList";
import _ from 'lodash';

const dataStoreSvenska = require("../dataStoreSvenska.json");
const svenskaOrdKeys = Object.keys(dataStoreSvenska);

export const ShoppingListsPage = () => {
  const shoppingLists = useSelector(selectShoppingLists);
  const shoppingListsOrderedByModified = _.orderBy(Object.values(shoppingLists), "createdAt", "desc");

  return (
    <Container>
      <Header>Shopping Lists</Header>
      <datalist id="item_suggestion">
        {svenskaOrdKeys.map((ord) => {
          return <option key={ord} value={ord} />;
        })}
      </datalist>
      {shoppingListsOrderedByModified.map((shoppingList) => (
        <SmartShoppingList
          key={shoppingList.id}
          shoppingListId={shoppingList.id}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  background-color: #cfd8dc;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  position: absolute;
  clip: rect(0, 0, 0, 0);
  clip-path: rect(0, 0, 0, 0);
`;
