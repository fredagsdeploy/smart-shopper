import React, { useState } from "react";
import styled from "styled-components/native";
import { debounce } from "lodash";
import { TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
  name: string;
  checked: boolean;
  onChange: () => void;
  onNameChange: (name: string) => void;
  onRemove: () => void;
}

export const ListItem: React.VFC<Props> = ({
  name,
  checked,
  onChange,
  onNameChange,
  onRemove,
}) => {
  const [_name, setName] = useState(name);

  const debouncedUpdate = debounce(onNameChange, 500);

  const handleChange = (text: string) => {
    setName(text);
    debouncedUpdate(text);
  };

  return (
    <Container>
      <Feather
        name={checked ? "check-square" : "square"}
        size={24}
        style={{ marginTop: 2 }}
        onPress={onChange}
      />
      <View style={{ width: 10 }} />
      <TextInput
        style={{ fontSize: 16 }}
        value={_name}
        onChangeText={handleChange}
      />
    </Container>
  );
};

const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
`;
