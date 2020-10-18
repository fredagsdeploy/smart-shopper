import React from "react";
import "./App.css";
import styled from "styled-components";

interface Props {
  itemName: string;
  onPress: (checked: boolean) => void;
  checked: boolean;
}

export const ListItem: React.FC<Props> = ({ itemName, onPress, checked }) => {
  return (
    <Container>
      <input
        name=""
        type="checkbox"
        checked={checked}
        onChange={() => onPress(!checked)}
      />
      <Name>{itemName}</Name>
    </Container>
  );
};

export default ListItem;

const Container = styled.div`
  margin-left: 3em;
`;

const Name = styled.span`
  font-weight: bold;
`;
