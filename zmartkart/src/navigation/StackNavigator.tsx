import { EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import * as React from "react";
import { StackParamList } from "../../route-types";
import { AllListsScreen } from "../AllListsPage/AllListsScreen";
import { SingleListScreen } from "../SingleListPage/SingleListScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { logOutAsync } from "../authUtils";
import { Platform, StatusBar } from "react-native";
import { TransitionPresets } from "@react-navigation/stack";

const Stack = createStackNavigator<StackParamList>();

interface StackNavigatorProps {
  onSignOut: () => void;
}

export const StackNavigator: React.FC<StackNavigatorProps> = ({
  onSignOut,
}) => (
  <>
    <StatusBar barStyle={"light-content"} />
    <Stack.Navigator
      initialRouteName="AllListsScreen"
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}
    >
      <Stack.Screen
        name="AllListsScreen"
        component={AllListsScreen}
        options={(props) => {
          return {
            title: "Smart Shopper",
            headerTintColor: "white",
            headerRight: () => {
              return (
                <FontAwesome5
                  name="sign-out-alt"
                  size={20}
                  color={"white"}
                  style={{ marginRight: 20 }}
                  onPress={async () => {
                    await logOutAsync();
                    if (Platform.OS == "web") {
                      props.navigation.navigate("/oauth2/sign_out");
                    } else {
                      onSignOut();
                    }
                  }}
                />
              );
            },
          };
        }}
      />
      <Stack.Screen
        name="SingleListScreen"
        component={SingleListScreen}
        options={(props) => {
          return {
            headerTintColor: "white",
          };
        }}
      />
    </Stack.Navigator>
  </>
);
