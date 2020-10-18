import React, { forwardRef, useState } from "react";
import "./App.css";
import styled, { css } from "styled-components";
import {
  Item,
  selectItem,
  toggleItem,
  updateItem,
} from "./reducers/shoppingLists";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { useParams } from "react-router-dom";

interface Props {
  itemId: string;
  onClick: (item: Item) => void;
}

export const ListItem = forwardRef<any, Props>(({ itemId, onClick }, ref) => {
  let { shoppingListId } = useParams<{shoppingListId: string}>();

  const dispatch = useDispatch();
  const item = useSelector(selectItem(shoppingListId, itemId));
  const [name, setName] = useState(item.name);

  const dispatchUpdate = () =>
    dispatch(
      updateItem({
        shoppingListId: shoppingListId,
        itemId: item.id,
        item: {
          name: name,
        },
      })
    );

  const debouncedUpdate = debounce(dispatchUpdate, 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    debouncedUpdate();
  };

  return (
    <Container ref={ref}>
      <Checkbox
        type="checkbox"
        checked={item.checked}
        onChange={() => {
          dispatch(
            toggleItem({ shoppingListId: shoppingListId, itemId: item.id })
          );
          onClick(item);
        }}
        aria-label={name}
      />
      <Text
        type="text"
        value={name}
        onChange={handleChange}
        checked={item.checked}
        aria-label="Item"
      />
    </Container>
  );
});

export default ListItem;

const Container = styled.div`
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

const checkedStyle = css`
  text-decoration: line-through;
  color: #767676;
`;

const Text = styled.input`
  border: none;
  flex: 1;
  background-color: transparent;
  font-size: 1rem;
  ${props => props.checked ? checkedStyle : ''};

  &:focus {
    outline: none;
    border-top: 1px solid transparent;
    border-bottom: 1px solid #767676;
  }
`;
