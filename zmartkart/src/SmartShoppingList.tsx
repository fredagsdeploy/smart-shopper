import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  Item,
  removeItem,
  selectItems,
  toggleItem,
  updateItem,
} from "./reducers/shoppingLists";
import { ListItem } from "./ListItem";
import React, { useState } from "react";
import styled from "styled-components/native";
import { useOrder } from "./customHooks/useOrder";
import { v4 as uuid } from "react-native-uuid";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ghostButtonTextColor } from "./constants/colors";
import { useQuery } from "react-query";
import {
  addItemToList,
  checkItem,
  fetchLists,
  renameItem,
  uncheckItem,
} from "./backend";

interface Props {
  shoppingListId: string;
}

export const SmartShoppingList: React.FC<Props> = ({ shoppingListId }) => {
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useQuery("lists", fetchLists);

  const items = Object.values(data[shoppingListId]?.items ?? {});

  const [newItemName, setNewItemName] = useState("");

  const addNewItem = async () => {
    const newItemId = uuid();
    await addItemToList(shoppingListId, newItemId, newItemName);
    await refetch();
    setNewItemName("");
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <FlatList<Item>
        data={items}
        keyboardDismissMode={"on-drag"}
        style={{ backgroundColor: "white" }}
        contentContainerStyle={{ alignItems: "stretch", paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <ListItem
            key={item.id}
            checked={item.checked}
            onChange={async () => {
              if (item.checked) {
                await uncheckItem(shoppingListId, item.id);
              } else {
                await checkItem(shoppingListId, item.id);
              }
              await refetch();
            }}
            name={item.name}
            onNameChange={async (name: string) => {
              await renameItem(shoppingListId, item.id, name);
            }}
            onRemove={() => {
              dispatch(
                removeItem({
                  shoppingListId: shoppingListId,
                  itemId: item.id,
                })
              );
            }}
          />
        )}
      />
      <KeyboardAvoidingView
        behavior={"padding"}
        style={{ backgroundColor: "white" }}
      >
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
            style={{ fontSize: 18, marginRight: 8, minWidth: "auto", flex: 1 }}
          />
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={addNewItem}
          >
            <FontAwesome5 name="plus" size={20} color={ghostButtonTextColor} />
            <View style={{ width: 10 }} />
            <Text
              style={{
                color: ghostButtonTextColor,
                fontWeight: "700",
                fontSize: 20,
              }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </NewItemRow>
      </KeyboardAvoidingView>
    </>
  );
};

const NewItemRow = styled.View`
  display: flex;
  box-shadow: 0 -1px 2px rgb(214, 216, 221);
  background-color: white;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  /* padding: 0 1rem; */
  /* margin-bottom: 1rem; */
`;
