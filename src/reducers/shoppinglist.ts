import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "./rootReducer";
import { ShoppingItem } from "../ListPage";

type ItemId = string;
export interface Item {
  id: string;
  name: ShoppingItem;
  checked: boolean;
}

const initialState: Record<ItemId, Item> = {
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
};

export const addItem = createAction<Item>("item/add");
export const removeItem = createAction<ItemId>("item/remove");
export const toggleItem = createAction<ItemId>("item/toggle");

export const shoppingList = createReducer(initialState, (builder) => {
  builder.addCase(addItem, (state, action) => {
    state[action.payload.id] = action.payload;
  });
  builder.addCase(removeItem, (state, action) => {
    delete state[action.payload];
  });
  builder.addCase(toggleItem, (state, action) => {
    const item = state[action.payload];
    if (item) {
      item.checked = !item.checked;
    }
  });
});

export const selectItems = (state: RootState) => state.shoppingList;
export const selectItem = (itemId: string) => (state: RootState) =>
  state.shoppingList[itemId];
