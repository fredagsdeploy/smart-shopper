import { EvilIcons } from "@expo/vector-icons";
import * as React from "react";

import useColorScheme from "../hooks/useColorScheme";
import { StackParamList } from "../route-types";
import { AllListsScreen } from "../src/AllListsPage/AllListsScreen";
import { SingleListScreen } from "../src/SingleListPage/SingleListScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator<StackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="AllListsScreen">
      <Stack.Screen name="AllListsScreen" component={AllListsScreen} />
      <Stack.Screen name="SingleListScreen" component={SingleListScreen} />
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
