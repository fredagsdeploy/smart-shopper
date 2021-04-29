import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { SafeAreaView } from "react-native";
import { StackParamList } from "../../route-types";
import { SingleListPage } from "./SingleListPage";

type SingleListRouteProp = RouteProp<StackParamList, "SingleListScreen">;

export const SingleListScreen = () => {
  const {
    params: { shoppingListId },
  } = useRoute<SingleListRouteProp>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <SingleListPage shoppingListId={shoppingListId} />
    </SafeAreaView>
  );
};
