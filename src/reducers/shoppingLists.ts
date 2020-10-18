import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "./rootReducer";
import { ShoppingItem } from "../ListPage";

export type ShoppingLists = Record<string, ShoppingList>;
export type ShoppingListItems = Record<ItemId, Item>;

export interface ShoppingList {
  id: string;
  items: ShoppingListItems;
}

export type ItemId = string;
export interface Item {
  id: string;
  name: ShoppingItem;
  checked: boolean;
}

const initialState: ShoppingLists = {
  asd: {
    id: "asd",
    items: {
      "1": {
        id: "1",
        checked: false,
        name: ShoppingItem.Bananer,
      },
      "2": {
        id: "2",
        checked: false,
        name: ShoppingItem.Äpplen,
      },
      "3": {
        id: "3",
        checked: false,
        name: ShoppingItem.Mjölk,
      },
      "4": {
        id: "4",
        checked: false,
        name: ShoppingItem.Mjöl,
      },
      "5": {
        id: "5",
        checked: false,
        name: ShoppingItem.Kyckling,
      },
      "6": {
        id: "6",
        checked: false,
        name: ShoppingItem.Ägg,
      },
    },
  },
};

export const addItem = createAction<{
  shoppingListId: string;
  itemId: string;
  item: Item;
}>("shoppinglist/item/add");

export const removeItem = createAction<{
  shoppingListId: string;
  itemId: ItemId;
}>("shoppinglist/item/remove");

export const toggleItem = createAction<{
  shoppingListId: string;
  itemId: ItemId;
}>("shoppinglist/item/toggle");

export const updateItem = createAction<{
  shoppingListId: string;
  itemId: ItemId;
  item: Partial<Item>;
}>("shoppinglist/item/update");

export const addShoppingList = createAction<{
  shoppingListId: string;
}>("shoppinglist/add");

export const removeShoppingList = createAction<{
  shoppingListId: string;
}>("shoppinglist/remove");

export const shoppingLists = createReducer(initialState, (builder) => {
  builder.addCase(addItem, (state, action) => {
    const { shoppingListId, itemId, item } = action.payload;
    state[shoppingListId].items[itemId] = item;
  });
  builder.addCase(removeItem, (state, action) => {
    const { shoppingListId, itemId } = action.payload;
    delete state[shoppingListId].items[itemId];
  });
  builder.addCase(toggleItem, (state, action) => {
    const { shoppingListId, itemId } = action.payload;
    const prevItem = state[shoppingListId].items[itemId];
    prevItem.checked = !prevItem.checked;
    state[shoppingListId].items[itemId] = prevItem;
  });
  builder.addCase(updateItem, (state, action) => {
    const { shoppingListId, itemId, item } = action.payload;
    const prevItem = state[shoppingListId].items[itemId];
    state[shoppingListId].items[itemId] = { ...prevItem, ...item };
  });
  builder.addCase(addShoppingList, (state, action) => {
    const { shoppingListId } = action.payload;
    state[shoppingListId] = { id: shoppingListId, items: {} };
  });
  builder.addCase(removeShoppingList, (state, action) => {
    const { shoppingListId } = action.payload;
    delete state[shoppingListId];
  });
});

export const selectItems = (shoppingListId: string) => (state: RootState) =>
  state.shoppingLists[shoppingListId].items;
export const selectItem = (shoppingListId: string, itemId: string) => (
  state: RootState
) => state.shoppingLists[shoppingListId].items[itemId];
