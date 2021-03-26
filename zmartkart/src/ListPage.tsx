import React from "react";
import { SmartShoppingList } from "./SmartShoppingList";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { BottomTabParamList } from "../route-types";
import { backgroundColor } from "./constants/colors";

type ProfileScreenRouteProp = RouteProp<BottomTabParamList, "ShoppingList">;

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
