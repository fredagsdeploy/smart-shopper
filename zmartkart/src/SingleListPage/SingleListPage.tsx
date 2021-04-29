import { useDispatch, useSelector } from "react-redux";
import { Item, selectShoppingList } from "../reducers/shoppingLists";
import { ListRow } from "../ListRow";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useOrder } from "../customHooks/useOrder";
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ghostButtonTextColor } from "../constants/colors";
import {
  addItemToList,
  checkItem,
  ListItem,
  renameItem,
  uncheckItem,
} from "../backend";
import { Relatables } from "../types";
import { fetchAllLists, fetchListAndGraph } from "../reducers/thunks";
import { AvoidKeyboard } from "../AvoidKeyboard";
import { selectItemGraphLoading } from "../reducers/itemGraph";

interface Props {
  shoppingListId: string;
}

export const SingleListPage: React.FC<Props> = ({ shoppingListId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchListAndGraph(shoppingListId));
  }, [dispatch, shoppingListId]);

  const lists = useSelector(selectShoppingList);

  const list = lists?.[shoppingListId];
  const items = Object.values(list?.items ?? {});

  // Sort items with graph
  const { checkedItems, uncheckedItems, setCurrentItem } = useOrder(items);

  const [newItemName, setNewItemName] = useState("");

  const addNewItem = async () => {
    await addItemToList(shoppingListId, newItemName.trim());
    await dispatch(fetchListAndGraph(shoppingListId));
    setNewItemName("");
  };

  if (!list) {
    return <Text>No such list</Text>;
  }

  return (
    <AvoidKeyboard>
      <List
        shoppingListId={shoppingListId}
        items={[...uncheckedItems, ...checkedItems]}
        storeId={list.storeId}
        setCurrentItem={setCurrentItem}
      />

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
    </AvoidKeyboard>
  );
};

interface ListProps {
  shoppingListId: string;
  items: ListItem[];
  storeId: string;
  setCurrentItem: (item: Relatables) => void;
}

const List: React.VFC<ListProps> = ({
  shoppingListId,
  items,
  storeId,
  setCurrentItem,
}) => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectItemGraphLoading);

  return (
    <FlatList<Item>
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => dispatch(fetchListAndGraph(shoppingListId))}
        />
      }
      data={items}
      keyboardDismissMode={"on-drag"}
      style={{ backgroundColor: "white" }}
      contentContainerStyle={{ alignItems: "stretch", paddingHorizontal: 10 }}
      renderItem={({ item }) => (
        <ListRow
          key={item.id}
          checked={item.checked}
          onChange={async () => {
            if (item.checked) {
              await uncheckItem(shoppingListId, storeId, item.name);
            } else {
              await checkItem(shoppingListId, storeId, item.name);
            }

            await dispatch(fetchListAndGraph(shoppingListId));

            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setCurrentItem(item.name);
          }}
          name={item.name}
          onNameChange={async (name: string) => {
            await renameItem(shoppingListId, item.id, name);
          }}
          onRemove={() => {}}
        />
      )}
    />
  );
};

const NewItemRow = styled.View`
  display: flex;
  box-shadow: 0 -3px 2px rgb(214, 216, 221);
  background-color: white;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  /* padding: 0 1rem; */
  /* margin-bottom: 1rem; */
`;
