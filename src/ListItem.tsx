import React, { forwardRef } from "react";
import "./App.css";
import styled from "styled-components";
import { Item, selectItem, toggleItem } from "./reducers/shoppingLists";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  itemId: string;
  onClick: (item: Item) => void;
}

const SHOPPING_LIST_ID = "asd";
export const ListItem = forwardRef<any, Props>(({ itemId, onClick }, ref) => {
  const dispatch = useDispatch();
  const item = useSelector(selectItem(SHOPPING_LIST_ID, itemId));

  return (
    <Label ref={ref}>
      <Checkbox
        type="checkbox"
        checked={item.checked}
        onChange={() => {
          dispatch(
            toggleItem({ shoppingListId: SHOPPING_LIST_ID, itemId: item.id })
          );
          onClick(item);
        }}
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
