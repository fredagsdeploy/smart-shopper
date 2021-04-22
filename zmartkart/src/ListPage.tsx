import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { SafeAreaView } from "react-native";
import { StackParamList } from "../route-types";
import { SmartShoppingList } from "./SmartShoppingList";

type ProfileScreenRouteProp = RouteProp<StackParamList, "ShoppingList">;

export const ListPage = () => {
  const {
    params: { shoppingListId },
  } = useRoute<ProfileScreenRouteProp>();
  console.log(shoppingListId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <SmartShoppingList shoppingListId={shoppingListId} />
    </SafeAreaView>
  );
};
