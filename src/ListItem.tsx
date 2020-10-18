import React, { forwardRef } from "react";
import "./App.css";
import styled from "styled-components";
import { selectItem, toggleItem } from "./reducers/shoppinglist";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  itemId: string;
}

export const ListItem = forwardRef<any, Props>(({ itemId }, ref) => {
  const dispatch = useDispatch();
  const item = useSelector(selectItem(itemId));
  return (
    <Label ref={ref}>
      <Checkbox
        type="checkbox"
        checked={item.checked}
        onChange={() => dispatch(toggleItem(item.id))}
      />
      {item.name}
    </Label>
  );
});

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
