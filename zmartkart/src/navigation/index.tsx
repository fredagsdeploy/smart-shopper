import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ActivityIndicator, ColorSchemeName } from "react-native";

import { RootStackParamList } from "../../route-types";
import { StackNavigator } from "./StackNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import { SignIn } from "../SignIn";
import { useQuery } from "react-query";
import { getAccessToken } from "../authUtils";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  let theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  theme.colors.card = "#f76361";
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { data: token, isLoading, refetch } = useQuery("token", getAccessToken);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (token) {
    return <StackNavigator onSignOut={refetch} />;
  } else {
    return <SignIn onSignIn={refetch} />;
  }
}
