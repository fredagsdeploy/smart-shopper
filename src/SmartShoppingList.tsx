import {useDispatch, useSelector} from "react-redux";
import {addItem, removeItem, selectItems, toggleItem, updateItem,} from "./reducers/shoppingLists";
import FlipMove from "react-flip-move";
import ListItem from "./ListItem";
import React, {useState} from "react";
import styled from "styled-components";
import {useOrder} from "./customHooks/useOrder";
import {v4 as uuid} from "uuid";
import {Button} from "./components/Button";
import {Input} from "./components/Input";

interface Props {
  shoppingListId: string;
}

export const SmartShoppingList: React.FC<Props> = ({ shoppingListId }) => {
  const dispatch = useDispatch();
  const { checkedItems, uncheckedItems, setCurrentItem } = useOrder(
    useSelector(selectItems(shoppingListId))
  );

  const [newItemName, setNewItemName] = useState("");

  const addNewItem = () => {
    const newItemId = uuid();
    dispatch(
      addItem({
        shoppingListId: shoppingListId,
        itemId: newItemId,
        item: { name: newItemName, id: newItemId, checked: false },
      })
    );
    setNewItemName("");
  };

  if (checkedItems === undefined) {
    return <div>No such shopping list</div>;
  }

  return (
    <ShoppingList>
      <NewItemRow>
        <Input
          list="item_suggestion"
          type="text"
          value={newItemName}
          onKeyPress={(e) => {
            if (e.charCode === 13) {
              addNewItem();
            }
          }}
          onChange={(e) => {
            setNewItemName(e.target.value);
          }}
          aria-label="New item"
          placeholder="New item"
          style={{ marginRight: "0.5rem", minWidth: "auto", flex: 1 }}
        />
        <Button onClick={addNewItem}>Add</Button>
      </NewItemRow>
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
            onRemove={() => {
              dispatch(
                removeItem({
                  shoppingListId: shoppingListId,
                  itemId: item.id,
                })
              );
              setCurrentItem(item.name);
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
          onRemove={() => {
            dispatch(
              removeItem({
                shoppingListId: shoppingListId,
                itemId: item.id,
              })
            );
            setCurrentItem(item.name);
          }}
        />
      ))}
    </ShoppingList>
  );
};

const ShoppingList = styled.section`
  padding-top: 1.5rem;
  background-color: white;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
`;

const NewItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: 1rem;
`;
