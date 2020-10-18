import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "./rootReducer";

type ItemId = string;
interface Item {
  id: ItemId;
  name: string;
  checked: boolean;
}

const initialState: Record<ItemId, Item> = {
  "1": {
    id: "1",
    checked: false,
    name: "Bananer",
  },
  "2": {
    id: "2",
    checked: false,
    name: "Äpplen",
  },
  "3": {
    id: "3",
    checked: false,
    name: "Mjölk",
  },
  "4": {
    id: "4",
    checked: false,
    name: "Mjöl",
  },
  "5": {
    id: "5",
    checked: false,
    name: "Kyckling",
  },
  "6": {
    id: "6",
    checked: false,
    name: "Ägg",
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
