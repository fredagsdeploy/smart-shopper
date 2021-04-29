import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./rootReducer";
import { List } from "../backend";
import { ShoppingItem } from "../types";
import { ListId } from "../../../backend/src/types/listEvents";
import { fetchAllLists, fetchListAndGraph } from "./thunks";

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

export interface ShoppingListState {
  lists: Record<ListId, List>;
  loading: boolean;
}

const initialState: ShoppingListState = { lists: {}, loading: false };

const shoppingListsSlice = createSlice({
  initialState,
  reducers: {
    setShoppingLists: (state, action) => {
      state.lists = action.payload;
    },
    removeShoppingList: (state, action: PayloadAction<{ listId: string }>) => {
      delete state.lists[action.payload.listId];
    },
  },
  extraReducers: {
    [fetchListAndGraph.fulfilled as any]: (state, action) => {
      state.lists = action.payload.lists;
      state.loading = false;
    },
    [fetchListAndGraph.pending as any]: (state, action) => {
      state.loading = true;
    },
    [fetchAllLists.pending as any]: (state, action) => {
      state.loading = true;
    },
    [fetchAllLists.fulfilled as any]: (state, action) => {
      state.loading = false;
      state.lists = action.payload;
    },
  },
  name: "shoppingLists",
});

export const setShoppingLists = shoppingListsSlice.actions.setShoppingLists;
export const removeShoppingList = shoppingListsSlice.actions.removeShoppingList;
export const shoppingLists = shoppingListsSlice.reducer;

export const selectShoppingList = (state: RootState) =>
  state.shoppingLists.lists;
export const selectShoppingListIsLoading = (state: RootState) =>
  state.shoppingLists.loading;
