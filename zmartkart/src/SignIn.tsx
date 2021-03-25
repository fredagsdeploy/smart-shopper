import React, { useState } from "react";
import { Button, TextInput } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const signIn = () => {
    navigation.navigate('Root')
  };

  return (
    <>
      <Header>Sign In</Header>
      <Form>
        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={(v) => setEmail(v)}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(v) => setPassword(v)}
        />
        <Button title={"Sign in"} onPress={signIn} />
      </Form>
    </>
  );
};

const Header = styled.Text`
  margin-left: 16px;
`;

const Form = styled.View`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;
