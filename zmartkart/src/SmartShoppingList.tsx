import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  Item,
  removeItem,
  selectItems,
  toggleItem,
  updateItem,
} from "./reducers/shoppingLists";
import { ListRow } from "./ListRow";
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
  checkItem, fetchItemGraph,
  fetchLists,
  ListItem,
  renameItem,
  uncheckItem,
} from "./backend";
import {selectItemGraph, setGraph} from "./reducers/itemGraph";
import { Relatable, Relatables, ShoppingItem } from "./types";
import { store } from "./reducers/store";

interface Props {
  shoppingListId: string;
}

export const SmartShoppingList: React.FC<Props> = ({ shoppingListId }) => {
  const { data, isLoading, refetch } = useQuery("lists", fetchLists);

  const list = data?.[shoppingListId];
  const items = Object.values(list?.items ?? {});

  // Sort items with graph
  const { checkedItems, uncheckedItems, setCurrentItem } = useOrder(items);

  const [newItemName, setNewItemName] = useState("");

  const addNewItem = async () => {
    await addItemToList(shoppingListId, newItemName.trim());
    await refetch();
    setNewItemName("");
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!list) {
    return <Text>No such list</Text>;
  }

  return (
    <>
      <List
        shoppingListId={shoppingListId}
        items={uncheckedItems}
        storeId={list.storeId}
        refetch={refetch}
        setCurrentItem={setCurrentItem}
      />
      <List
        shoppingListId={shoppingListId}
        items={checkedItems}
        storeId={list.storeId}
        refetch={refetch}
        setCurrentItem={setCurrentItem}
      />

      <KeyboardAvoidingView
        behavior={"padding"}
        style={{ backgroundColor: "white" }}
      >
        <NewItemRow>
          <TextInput
            value={newItemName}
            onSubmitEditing={async () => {
              await addNewItem();
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

interface ListProps {
  shoppingListId: string;
  items: ListItem[];
  storeId: string;
  refetch: () => void;
  setCurrentItem: (item: Relatables) => void;
}

const List: React.VFC<ListProps> = ({
  shoppingListId,
  items,
  storeId,
  refetch,
  setCurrentItem,
}) => {
  const dispatch = useDispatch();

  const updateGraph = () => {
    fetchItemGraph(shoppingListId)
      .then((res) => {
        if (res.success) {
          console.log("Successfully got item graph", res);
          dispatch(setGraph(res.unwrap().value));
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <FlatList<Item>
      data={items}
      keyboardDismissMode={"on-drag"}
      style={{ backgroundColor: "white" }}
      contentContainerStyle={{ alignItems: "stretch", paddingHorizontal: 10 }}
      renderItem={({ item }) => (
        <ListRow
          key={item.id}
          checked={item.checked}
          onChange={async () => {
            setCurrentItem(item.name);
            if (item.checked) {
              await uncheckItem(shoppingListId, storeId, item.name);
              console.log("UNCHECK")
            } else {
              await checkItem(shoppingListId, storeId, item.name);
              console.log("CHECK")
            }
            await refetch();
            updateGraph();
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
