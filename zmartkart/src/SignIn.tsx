import React from "react";
import { StatusBar, Text, TouchableHighlight, View } from "react-native";
import styled from "styled-components/native";
import * as Google from "expo-google-app-auth";
import { setAccessToken } from "./backend";
import { FontAwesome } from "@expo/vector-icons";
import { backgroundColor } from "./constants/colors";

const fontSize = 16;

export const SignIn = ({ onSignIn }: { onSignIn: () => void }) => {
  const signIn = async () => {
    const result = await Google.logInAsync({
      iosClientId:
        "73488926457-lgc68tu3558a6kbh4iuf7p2i7co90mhf.apps.googleusercontent.com",
      androidClientId:
        "73488926457-ecdu70s6efetsudrquol79acuf94pivj.apps.googleusercontent.com",
    });

    if (result.type === "success") {
      console.log("success", result.idToken);
      await setAccessToken(result.idToken);
      onSignIn();
    }
  };

  return (
    <Background>
      <StatusBar barStyle={"light-content"} />
      <Form>
        <Header>Smartshopper</Header>
        <View style={{ height: 32 }} />
        <TouchableHighlight
          style={{
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
          underlayColor={"#e2e2e2"}
          onPress={signIn}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="google" size={24} color={backgroundColor} />
            <Text
              style={{
                color: backgroundColor,
                padding: fontSize,
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              Sign in with Google
            </Text>
          </View>
        </TouchableHighlight>
      </Form>
    </Background>
  );
};

const LoginField = styled.TextInput`
  background-color: white;
  border-radius: 4px;
  color: #fc3c49;
  padding: ${fontSize}px;
  font-size: ${fontSize}px;
  font-weight: 700;
`;

const Background = styled.SafeAreaView`
  background: #fc3c49;
  flex: 1;
  justify-content: center;
`;

const Header = styled.Text`
  font-size: 36px;
  font-weight: 700;
  font-family: ${Platform.select({android: "Roboto", ios: "ChalkboardSE-Light"})};
  color: white;
`;

const Form = styled.View`
  padding: 16px;
`;
