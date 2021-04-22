import React, {useEffect} from "react";
import { SmartShoppingList } from "./SmartShoppingList";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StackParamList } from "../route-types";
import { backgroundColor } from "./constants/colors";
import { fetchItemGraph } from "./backend";
import { selectItemGraph, setGraph } from "./reducers/itemGraph";
import { useDispatch, useSelector } from "react-redux";

type ProfileScreenRouteProp = RouteProp<StackParamList, "ShoppingList">;

export const ListPage = () => {
  const {
    params: { shoppingListId },
  } = useRoute<ProfileScreenRouteProp>();
  console.log(shoppingListId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <SmartShoppingList shoppingListId={shoppingListId} />
    </SafeAreaView>
  );
};
