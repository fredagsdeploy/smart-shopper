import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  selectItems,
  toggleItem,
  updateItem,
} from "./reducers/shoppingLists";
import FlipMove from "react-flip-move";
import ListItem from "./ListItem";
import _ from "lodash";
import React, { useState } from "react";
import styled from "styled-components";
import { useOrder } from "./customHooks/useOrder";
import Fuse from "fuse.js";
import { v4 as uuid } from "uuid";

const dataStoreSvenska = require("./dataStoreSvenska.json");
const svenskaOrdKeys = Object.keys(dataStoreSvenska);

interface Props {
  shoppingListId: string;
}

export const SmartShoppingList: React.FC<Props> = ({ shoppingListId }) => {
  const dispatch = useDispatch();
  const { checkedItems, uncheckedItems, setCurrentItem } = useOrder(
    useSelector(selectItems(shoppingListId))
  );

  const [newItemName, setNewItemName] = useState("");

  if (checkedItems === undefined) {
    return <div>No such shopping list</div>;
  }

  return (
    <div>
      <datalist id="item_suggestion">
        {svenskaOrdKeys.map((ord) => {
          return <option value={ord} />;
        })}
      </datalist>
      <Header>{shoppingListId}</Header>
      <FlipMove>
        {uncheckedItems.map((item) => (
          <ListItem
            key={item.id}
            checked={false}
            onChange={() => {
              dispatch(
                toggleItem({
                  shoppingListId: shoppingListId,
                  itemId: item.id,
                })
              );
              setCurrentItem(item.name);
            }}
            name={item.name}
            onNameChange={(name: string) => {
              dispatch(
                updateItem({
                  shoppingListId: shoppingListId,
                  itemId: item.id,
                  item: {
                    name,
                  },
                })
              );
            }}
          />
        ))}
      </FlipMove>
      <br />
      <br />
      {checkedItems.map((item) => (
        <ListItem
          key={item.id}
          checked={true}
          onChange={() => {
            dispatch(
              toggleItem({ shoppingListId: shoppingListId, itemId: item.id })
            );
          }}
          name={item.name}
          onNameChange={(name: string) => {
            dispatch(
              updateItem({
                shoppingListId: shoppingListId,
                itemId: item.id,
                item: {
                  name,
                },
              })
            );
          }}
        />
      ))}
      <div>
        <input
          list="item_suggestion"
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <button
          onClick={() => {
            const newItemId = uuid();
            dispatch(
              addItem({
                shoppingListId: shoppingListId,
                itemId: newItemId,
                item: { name: newItemName, id: newItemId, checked: false },
              })
            );
            setNewItemName("");
          }}
        >
          Add
        </button>
      </div>
      <hr />
    </div>
  );
};

const Header = styled.h1`
  margin-left: 1rem;
`;
