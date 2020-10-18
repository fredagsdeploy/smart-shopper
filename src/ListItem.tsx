import React, { forwardRef, useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import { Item, selectItem, toggleItem, updateItem } from "./reducers/shoppingLists";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

interface Props {
  itemId: string;
  onClick: (item: Item) => void;
}

const SHOPPING_LIST_ID = "asd";
export const ListItem = forwardRef<any, Props>(({ itemId, onClick }, ref) => {
  const dispatch = useDispatch();
  const item = useSelector(selectItem(SHOPPING_LIST_ID, itemId));
  const [name, setName] = useState(item.name);

  const dispatchUpdate = () => dispatch(updateItem({
    shoppingListId: SHOPPING_LIST_ID,
    itemId: item.id,
    item: {
      name: name
    }
  }));

  const debouncedUpdate = debounce(dispatchUpdate, 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    debouncedUpdate();
  }

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
      <Text
        type="text"
        value={name}
        onChange={handleChange}
      />
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
  height: 24px;
  width: 24px;
  margin: 12px;
`;

const Text = styled.input`
  border: none;
  flex: 1;
  background-color: transparent;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-top: 1px solid transparent;
    border-bottom: 1px solid #767676;
  }
`;
