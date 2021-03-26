import React from "react";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { selectShoppingLists, ShoppingList } from "../reducers/shoppingLists";
import _, { take } from "lodash";
import { FlatList, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { backgroundColor } from "../constants/colors";

export const ShoppingListsPage = () => {
  const shoppingLists = useSelector(selectShoppingLists);
  const shoppingListsOrderedByModified = _.orderBy(
    Object.values(shoppingLists),
    "createdAt",
    "desc"
  );

  const navigation = useNavigation();

  const items = shoppingListsOrderedByModified.concat([0]);

  return (
    <Container>
      <Indent>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 20,
          }}
        >
          <Header>Lists</Header>
          <AddBtn onPress={() => {}}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="plus" size={20} color="white" />
              <View style={{ width: 10 }} />
              <Text style={{ color: "white", fontWeight: "700", fontSize: 20 }}>
                Add
              </Text>
            </View>
          </AddBtn>
        </View>

        <FlatList<ShoppingList | 0>
          data={items}
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

            return (
              <ListPreview
                key={shoppingList.id}
                underlayColor={"#e2e2e2"}
                style={index % 2 === 1 ? { marginLeft: 20 } : null}
                onPress={() => {
                  navigation.navigate("ShoppingList", {
                    shoppingListId: shoppingList.id,
                  });
                }}
              >
                <View>
                  {take(Object.values(shoppingList.items), 4).map(
                    (listItem, i) => (
                      <View key={listItem.id}>
                        {Object.values(shoppingList.items).length > 4 &&
                        i === 3 ? (
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
                              name={
                                listItem.checked ? "check-square" : "square"
                              }
                              size={20}
                              style={{ marginTop: 2, marginRight: 5 }}
                            />
                            <ListItemText>{listItem.name}</ListItemText>
                          </View>
                        )}
                      </View>
                    )
                  )}
                </View>
              </ListPreview>
            );
          }}
        />
      </Indent>
    </Container>
  );
};

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
