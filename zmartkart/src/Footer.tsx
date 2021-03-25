import { Button } from "react-native";
import React from "react";
import styled from "styled-components/native";
import { useDispatch } from "react-redux";
import { addShoppingList } from "./reducers/shoppingLists";
import { v4 as uuid } from "uuid";

export function Footer() {
  const dispatch = useDispatch();

  return (
    <FooterContainer>
      <Button
        title={"Add to list"}
        onPress={() => {
          console.log("New list");
          dispatch(addShoppingList({ shoppingListId: uuid() }));
        }}
      />
    </FooterContainer>
  );
}

const FooterContainer = styled.View`
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: white;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2);
`;
