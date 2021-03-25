import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, selectItems, toggleItem, updateItem, } from "./reducers/shoppingLists";
import ListItem from "./ListItem";
import React, { useState } from "react";
import styled from "styled-components/native";
import { useOrder } from "./customHooks/useOrder";
import { v4 as uuid } from "uuid";
import { Button, ScrollView, Text, TextInput } from "react-native";

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
    return <Text>No such shopping list</Text>;
  }

  return (
    <>
    <NewItemRow>
      <TextInput
        value={newItemName}
        onSubmitEditing={() => {
          addNewItem();
        }}
        onChangeText={(value) => {
          setNewItemName(value);
        }}
        aria-label="New item"
        placeholder="New item"
        style={{ marginRight: 8, minWidth: "auto", flex: 1 }}
      />
      <Button onPress={addNewItem} title={"Add"} />
    </NewItemRow>
    <ScrollView style={{ backgroundColor: "white" }} contentContainerStyle={{ alignItems: "stretch"}}>

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
    </ScrollView>
    </>
  );
};

const ShoppingList = styled.ScrollView`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const NewItemRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  /* padding: 0 1rem; */
  /* margin-bottom: 1rem; */
`;
