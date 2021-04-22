import {createAction, createSlice} from "@reduxjs/toolkit";
import { RootState } from "./rootReducer";
import { List } from "../backend";
import { ShoppingItem } from "../types";
import { ListId } from "../../../backend/src/types/listEvents";
import {fetchListAndGraph} from "./thunks";

export type ShoppingLists = Record<string, ShoppingList>;
export type ShoppingListItems = Record<ItemId, Item>;

export interface ShoppingList {
  id: string;
  items: ShoppingListItems;
  createdAt: string;
}

export type ItemId = string;
export interface Item {
  id: string;
  name: ShoppingItem;
  checked: boolean;
}

export type ShoppingListState = Record<ListId, List>;

const initialState: ShoppingListState = {};

const shoppingListsSlice = createSlice({
  initialState,
  reducers: {
    setShoppingLists: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: {
    [fetchListAndGraph.fulfilled as any]: (state, action) => {
      return action.payload.lists;
    },
  },
  name: "shoppingLists",
});

export const setShoppingLists = shoppingListsSlice.actions.setShoppingLists;
export const shoppingLists = shoppingListsSlice.reducer;

export const selectItemList = (state: RootState) => state.shoppingLists;
