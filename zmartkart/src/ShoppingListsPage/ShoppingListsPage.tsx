import React from "react";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { selectShoppingLists } from "../reducers/shoppingLists";
import _ from "lodash";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const ShoppingListsPage = () => {
  const shoppingLists = useSelector(selectShoppingLists);
  const shoppingListsOrderedByModified = _.orderBy(
    Object.values(shoppingLists),
    "createdAt",
    "desc"
  );

  const navigation = useNavigation();

  return (
    <Container>
      <Header>Shopping Lists</Header>
      {/*<datalist id="item_suggestion" />*/}
      {shoppingListsOrderedByModified.map((shoppingList) => (
        <Button title={shoppingList.id} onPress={() => {
          navigation.navigate("ShoppingList", { shoppingListId: shoppingList.id})
        }}/>
      ))}
      {/*<Footer />*/}
    </Container>
  );
};

const Container = styled.SafeAreaView`
  background-color: #cfd8dc;
  flex: 1;
`;

const Header = styled.Text`
  /* clip: rect(0, 0, 0, 0); 
  clip-path: rect(0, 0, 0, 0); */
`;
