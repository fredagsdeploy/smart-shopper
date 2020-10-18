import React, { forwardRef } from "react";
import "./App.css";
import styled from "styled-components";

interface Props {
  itemName: string;
  onPress: (checked: boolean) => void;
  checked: boolean;
}

export const ListItem = forwardRef<any, Props>(
  ({ itemName, onPress, checked }, ref) => {
    return (
      <Label ref={ref}>
        <Checkbox
          type="checkbox"
          checked={checked}
          onChange={() => onPress(!checked)}
        />
        {itemName}
      </Label>
    );
  }
);

export default ListItem;

const Label = styled.label`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 48px;

  &:hover {
    background-color: #fafafa;
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;
