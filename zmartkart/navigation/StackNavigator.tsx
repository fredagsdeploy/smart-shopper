import { EvilIcons } from "@expo/vector-icons";
import * as React from "react";

import useColorScheme from "../hooks/useColorScheme";
import { StackParamList } from "../route-types";
import { ShoppingListsPage } from "../src/ShoppingListsPage/ShoppingListsPage";
import { ListPage } from "../src/ListPage";
import { ghostButtonTextColor } from "../src/constants/colors";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator<StackParamList>();

export default function StackNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator initialRouteName="ShoppingLists">
      <Stack.Screen name="ShoppingLists" component={ShoppingListsPage} />
      <Stack.Screen name="ShoppingList" component={ListPage} />
    </Stack.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof EvilIcons>["name"];
  color: string;
}) {
  return <EvilIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}
