import React, {useEffect, useLayoutEffect, useState} from "react";
import styled from "styled-components/native";
import {
  selectShoppingList,
  selectShoppingListIsLoading,
  setShoppingLists,
  ShoppingList,
} from "../reducers/shoppingLists";
import { take } from "lodash";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { backgroundColor } from "../constants/colors";
import { createList, fetchLists, List } from "../backend";
import { v4 as uuid } from "react-native-uuid";
import Dialog from "react-native-dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLists } from "../reducers/thunks";

const cutIfListNameIsTooLong = (listName: string) => {
  if (listName.length > 9) {
    return take(listName, 9).join("") + "...";
  }
  return listName;
};

export const AllListsScreen = () => {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(fetchAllLists());
  }, [dispatch]);

  const data = useSelector(selectShoppingList);

  const navigation = useNavigation();

  const lists = Object.values(data ?? {});

  const items = lists.length > 0 ? [...lists, null] : lists;

  const [viewNewListDialog, setViewNewListDialog] = useState(false);
  const [newListName, setNewListName] = useState("NewList");

  const isLoading = useSelector(selectShoppingListIsLoading);

  return (
    <Container>
      <StatusBar style={"dark"} />
      <Indent>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 20,
          }}
        >
          <Header>Lists</Header>
          <Dialog.Container
            visible={viewNewListDialog}
            onBackdropPress={() => setViewNewListDialog(false)}
          >
            <Dialog.Title>Add new list</Dialog.Title>
            <Dialog.Input
              label={"Enter name for list"}
              onChangeText={(listName: string) => setNewListName(listName)}
            />
            <Dialog.Button
              label="Cancel"
              onPress={() => setViewNewListDialog(false)}
            />
            <Dialog.Button
              label="Add"
              onPress={async () => {
                setViewNewListDialog(false);
                const newListId = uuid();
                await createList(newListId, newListName);
                fetchLists()
                  .then((res) => {
                    dispatch(setShoppingLists(res));
                    navigation.navigate("ShoppingList", {
                      shoppingListId: newListId,
                    });
                  })
                  .catch((err) => console.log(err));
              }}
            />
          </Dialog.Container>
          <AddBtn
            underlayColor={"#802a2d"}
            onPress={() => setViewNewListDialog(true)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="plus" size={20} color="white" />
              <View style={{ width: 10 }} />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 20 }}>
                Add
              </Text>
            </View>
          </AddBtn>
        </View>

        <FlatList<List | null>
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => dispatch(fetchAllLists())}
            />
          }
          data={items}
          keyboardDismissMode={"on-drag"}
          ListEmptyComponent={isLoading ? null : <Text>You have no lists</Text>}
          columnWrapperStyle={{ marginVertical: 10 }}
          numColumns={2}
          renderItem={({ item: shoppingList, index }) => {
            if (!shoppingList) {
              return (
                <View
                  style={{
                    padding: 10,
                    width: 100,
                    height: 100,
                    flex: 1,
                    marginLeft: 20,
                  }}
                />
              );
            }

            const items = shoppingList.items ?? {};

            return (
              <ListPreview
                key={shoppingList.id}
                underlayColor={"#e2e2e2"}
                style={index % 2 === 1 ? { marginLeft: 20 } : null}
                onPress={() => {
                  navigation.navigate("SingleListScreen", {
                    shoppingListId: shoppingList.id,
                  });
                }}
              >
                <View>
                  <ListNameTextContainer>
                    <ListNameText>
                      {cutIfListNameIsTooLong(shoppingList.name)}
                    </ListNameText>
                  </ListNameTextContainer>
                  {take(Object.values(items), 4).map((listItem, i) => (
                    <View key={listItem.id}>
                      {Object.values(items).length > 4 && i === 3 ? (
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ width: 20, marginRight: 5 }} />
                          <ListItemText>{"…"}</ListItemText>
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Feather
                            name={listItem.checked ? "check-square" : "square"}
                            size={20}
                            style={{ marginTop: 2, marginRight: 5 }}
                          />
                          <ListItemText>{listItem.name}</ListItemText>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </ListPreview>
            );
          }}
        />
      </Indent>
    </Container>
  );
};

const ListNameTextContainer = styled.View`
  border-radius: 10px;
  border-width: 1px;
  border-color: white;
  margin-top: -19px;
  background: white;
  align-self: flex-end;
  padding-left: 10px;
  padding-right: 10px;
`;

const ListNameText = styled.Text`
  margin-left: auto;
  color: grey;
  text-align: right;
`;

const ListItemText = styled.Text`
  margin: 5px 0;
  font-size: 20px;
`;

const Indent = styled.View`
  flex: 1;
  padding: 0 20px;
`;

const AddBtn = styled.TouchableHighlight`
  padding: 20px;
  justify-content: center;
  background-color: ${backgroundColor};
  border-radius: 6px;
  box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const ListPreview = styled.TouchableHighlight`
  flex: 1;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const Container = styled.SafeAreaView`
  background-color: #f4f4f4;
  flex: 1;
`;

const Header = styled.Text`
  font-size: 42px;
  font-weight: 700;
`;
