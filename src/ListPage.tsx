import ListItem from "./ListItem";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectItems, toggleItem } from "./reducers/shoppinglist";

export const ListPage = () => {
  const items = useSelector(selectItems);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Smart shopper</h1>
      {Object.values(items).map((i) => (
        <ListItem
          itemName={i.name}
          checked={i.checked}
          onPress={() => {
            dispatch(toggleItem(i.id));
          }}
        />
      ))}
    </div>
  );
};
