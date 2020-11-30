import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "./rootReducer";

export type ShoppingLists = Record<string, ShoppingList>;
export type ShoppingListItems = Record<ItemId, Item>;

export interface ShoppingList {
  id: string;
  items: ShoppingListItems;
}

export type ItemId = string;
export interface Item {
  id: ItemId;
  name: string;
  checked: boolean;
}

const initialState: ShoppingLists = {
  asd: {
    id: "asd",
    items: {
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

export const shoppingList = createReducer(initialState, (builder) => {
  builder.addCase(addItem, (state, action) => {
    const { shoppingListId, itemId, item } = action.payload;
    state[shoppingListId].items[itemId] = item;
  });
  builder.addCase(removeItem, (state, action) => {
    const { shoppingListId, itemId } = action.payload;
    delete state[shoppingListId].items[itemId];
  });
  builder.addCase(toggleItem, (state, action) => {
    const;
    const item = state[action.payload];
    if (item) {
      item.checked = !item.checked;
    }
  });
  builder.addCase(updateItem, (state, action) => {
    const { shoppingListId, itemId, item } = action.payload;
    const item = state[shoppingListId].items[itemId];
    state[shoppingListId].items[itemId] = { ...item };
  });
});

export const selectItems = (state: RootState) => state.shoppingList;
export const selectItem = (itemId: string) => (state: RootState) =>
  state.shoppingList[itemId];
