import React, { useState } from "react";
import { StatusBar, Text, TextInput, TouchableHighlight, View } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

const fontSize = 16;

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const signIn = () => {
    navigation.navigate("Root");
  };


  return (
    <Background>
      <StatusBar barStyle={"light-content"} />
      <Form>
        <Header>Sign In</Header>
        <View style={{ height: 32 }}/>
        <Text
          style={{
            fontSize,
            fontWeight: "700",
            color: "white",
            paddingVertical: 4,
          }}
        >
          E-mail
        </Text>
        <LoginField
          autoCompleteType={"email"}
          keyboardType={"email-address"}
          value={email}
          onChangeText={(v) => setEmail(v)}
        />
        <View style={{ height: 32 }}/>
        <Text
          style={{
            fontSize,
            fontWeight: "700",
            color: "white",
            paddingVertical: 4,
          }}
        >
          Password
        </Text>
        <LoginField
          secureTextEntry
          value={password}
          onChangeText={(v) => setPassword(v)}
        />
        <View style={{ height: 32 }}/>
        <TouchableHighlight
          style={{
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
          onPress={signIn}
        >
          <Text
            style={{
              color: "#fc3c49",
              padding: fontSize,
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            Sign in
          </Text>
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
`

const Background = styled.SafeAreaView`
  background: #fc3c49;
  flex: 1;
  justify-content: center;
`;

const Header = styled.Text`
  font-size: 36px;
  font-weight: 700;
  color: white;
`;

const Form = styled.View`
  padding: 16px;
`;
