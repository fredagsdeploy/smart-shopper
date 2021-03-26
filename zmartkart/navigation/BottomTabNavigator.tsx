import { EvilIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import useColorScheme from "../hooks/useColorScheme";
import { BottomTabParamList } from "../route-types";
import { ShoppingListsPage } from "../src/ShoppingListsPage/ShoppingListsPage";
import { ListPage } from "../src/ListPage";
import { ghostButtonTextColor } from "../src/constants/colors";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="ShoppingLists"
      tabBarOptions={{ activeTintColor: ghostButtonTextColor }}
    >
      <BottomTab.Screen
        name="ShoppingLists"
        component={ShoppingListsPage}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="navicon" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="ShoppingList"
        component={ListPage}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="cart" color={color} />,
        }}
      />
    </BottomTab.Navigator>
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
