import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "./components/Button";
import { TextField, PasswordField } from "./components/Input";
import { useHistory } from "react-router-dom";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const signIn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    history.push("/shoppingLists/asd");
  };

  return (
    <main>
      <Header>Sign In</Header>
      <Form>
        <TextField
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={signIn}>Sign in</Button>
      </Form>
    </main>
  );
};

const Header = styled.h1`
  margin-left: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;
