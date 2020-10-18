import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectShoppingLists } from "../reducers/shoppingLists";
import { SmartShoppingList } from "../SmartShoppingList";

const dataStoreSvenska = require("../dataStoreSvenska.json");
const svenskaOrdKeys = Object.keys(dataStoreSvenska);

export const ShoppingListsPage = () => {
  const shoppingLists = useSelector(selectShoppingLists);

  return (
    <Container>
      <Header>Shopping Lists</Header>
      <datalist id="item_suggestion">
        {svenskaOrdKeys.map((ord) => {
          return <option key={ord} value={ord} />;
        })}
      </datalist>
      {Object.keys(shoppingLists).map((shoppingListId) => (
        <SmartShoppingList key={shoppingListId} shoppingListId={shoppingListId} />
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
  clip: rect(0,0,0,0);
  clip-path: rect(0,0,0,0);
`;
