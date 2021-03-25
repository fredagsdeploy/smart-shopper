import React from "react";
import { useSelector } from "react-redux";
import { selectShoppingLists } from "../reducers/shoppingLists";

interface Props {
  id: string;
}

export const CompactShoppingList: React.FC<Props> = ({ id }) => {
  const shoppingLists = useSelector(selectShoppingLists);

  return (
    <div>
      <span>{id}</span>
    </div>
  );
};
