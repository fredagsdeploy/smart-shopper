import React from "react";
import { SmartShoppingList } from "./SmartShoppingList";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StackParamList } from "../route-types";
import { backgroundColor } from "./constants/colors";

type ProfileScreenRouteProp = RouteProp<StackParamList, "ShoppingList">;

export const ListPage = () => {
  const {
    params: { shoppingListId },
  } = useRoute<ProfileScreenRouteProp>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <SmartShoppingList shoppingListId={shoppingListId} />
    </SafeAreaView>
  );
};
