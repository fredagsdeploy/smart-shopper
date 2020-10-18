import React from "react";
import { useParams } from "react-router-dom";
import { SmartShoppingList } from "./SmartShoppingList";

export const ListPage = () => {
  let { shoppingListId } = useParams<{ shoppingListId: string }>();

  return <SmartShoppingList shoppingListId={shoppingListId} />;
};
