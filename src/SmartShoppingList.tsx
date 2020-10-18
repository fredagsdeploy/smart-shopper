import { useDispatch, useSelector } from "react-redux";
import { selectItems, toggleItem, updateItem } from "./reducers/shoppingLists";
import FlipMove from "react-flip-move";
import ListItem from "./ListItem";
import _ from "lodash";
import React from "react";
import styled from "styled-components";
import { useOrder } from "./customHooks/useOrder";

interface Props {
  id: string;
}

export const SmartShoppingList: React.FC<Props> = ({ id }) => {
  const dispatch = useDispatch();
  const { checkedItems, uncheckedItems, setCurrentItem } = useOrder(
    useSelector(selectItems(id))
  );

  if (checkedItems === undefined) {
    return <div>No such shopping list</div>;
  }

  return (
    <div>
      <Header>{id}</Header>
      <FlipMove>
        {uncheckedItems.map((item) => (
          <ListItem
            key={item.id}
            checked={false}
            onChange={() => {
              dispatch(
                toggleItem({
                  shoppingListId: id,
                  itemId: item.id,
                })
              );
              setCurrentItem(item.name);
            }}
            name={item.name}
            onNameChange={(name: string) => {
              dispatch(
                updateItem({
                  shoppingListId: id,
                  itemId: item.id,
                  item: {
                    name,
                  },
                })
              );
            }}
          />
        ))}
      </FlipMove>
      <hr />
      {checkedItems.map((item) => (
        <ListItem
          key={item.id}
          checked={true}
          onChange={() => {
            dispatch(toggleItem({ shoppingListId: id, itemId: item.id }));
          }}
          name={item.name}
          onNameChange={(name: string) => {
            dispatch(
              updateItem({
                shoppingListId: id,
                itemId: item.id,
                item: {
                  name,
                },
              })
            );
          }}
        />
      ))}
    </div>
  );
};

const Header = styled.h1`
  margin-left: 1rem;
`;
