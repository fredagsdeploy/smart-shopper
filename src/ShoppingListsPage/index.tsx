import React from "react";
import { useSelector } from "react-redux";
import { selectShoppingLists } from "../reducers/shoppingLists";
import { SmartShoppingList } from "../SmartShoppingList";

export const ShoppingListsPage = () => {
  const shoppingLists = useSelector(selectShoppingLists);

  return (
    <>
      {Object.keys(shoppingLists).map((shoppingListId) => (
        <SmartShoppingList id={shoppingListId} />
      ))}
    </>
  );
};
