import React, { useState } from "react";
import styled from "styled-components/native";
import { debounce } from "lodash";
import { TextInput } from "react-native";

interface Props {
  name: string;
  checked: boolean;
  onChange: () => void;
  onNameChange: (name: string) => void;
  onRemove: () => void;
}

export const ListItem : React.VFC<Props> = ({ name, checked, onChange, onNameChange, onRemove }) => {
    const [_name, setName] = useState(name);

    const debouncedUpdate = debounce(onNameChange, 500);

    const handleChange = (text: string) => {
      setName(text);
      debouncedUpdate(text);
    };

    return (
      <Container>
        <Checkbox onPress={onChange} style={checked ? { backgroundColor: "blue"} : undefined}/>
        <TextInput
          value={_name}
          onChangeText={handleChange}
        />
        <DeleteButton onPress={onRemove} title={"✖️"}/>
      </Container>
    );
  };

export default ListItem;

const DeleteButton = styled.Button`
  height: 48px;
  width: 48px;
  /* right: 0.25rem; */
`;

const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  /* padding: 0 1rem 0 0.5rem; */
  height: 48px;
`;

const Checkbox = styled.TouchableOpacity`
  height: 24px;
  width: 24px;
  background-color: red;
  margin: 12px;
`;

const Text = styled.TextInput`
  flex: 1;
  background-color: transparent;
  /* font-size: 1rem; */
`;
