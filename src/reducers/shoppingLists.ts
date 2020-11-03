import {
  createAction,
  createReducer,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "./rootReducer";
import { ShoppingItem } from "../customHooks/useOrder";
import { postCheckUncheckEvent } from "../backend";
import {formatISO} from 'date-fns';

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

const initialState: ShoppingLists = {
  apa: {
    id: "apa",
    items: {},
    createdAt: "2020-11-03T22:16:05+00:00",
  },
  asd: {
    id: "asd",
    createdAt: "2020-11-03T22:16:05+00:00",
    items: {
      "1": {
        id: "1",
        checked: false,
        name: "Grönkål",
      },
      "2": {
        id: "2",
        checked: false,
        name: "Äpple",
      },
      "3": {
        id: "3",
        checked: false,
        name: "Sötpotatis",
      },
      "4": {
        id: "4",
        checked: false,
        name: "Mjöl",
      },
      "5": {
        id: "5",
        checked: false,
        name: "Kycklingkött",
      },
      "6": {
        id: "6",
        checked: false,
        name: "Fläskkött",
      },
      "7": {
        id: "7",
        checked: false,
        name: "Grodlår",
      },
      "8": {
        id: "8",
        checked: false,
        name: "Lök",
      },
      "9": {
        id: "9",
        checked: false,
        name: "Smör",
      },
      "10": {
        id: "10",
        checked: false,
        name: "Yoghurt",
      },
      "11": {
        id: "11",
        checked: false,
        name: "Crème fraîche",
      },
      "12": {
        id: "12",
        checked: false,
        name: "Kvarg",
      },
      "13": {
        id: "13",
        checked: false,
        name: "Råris",
      },
      "14": {
        id: "14",
        checked: false,
        name: "Jasminris",
      },
      "15": {
        id: "15",
        checked: false,
        name: "Arborioris",
      },
      "16": {
        id: "16",
        checked: false,
        name: "Raklödder",
      },
      "17": {
        id: "17",
        checked: false,
        name: "Raktvål",
      },
      "18": {
        id: "18",
        checked: false,
        name: "Apelsin",
      },
      "19": {
        id: "19",
        checked: false,
        name: "Tomat",
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

export const toggleItem = createAsyncThunk<
  {
    shoppingListId: string;
    itemId: ItemId;
  },
  {
    shoppingListId: string;
    itemId: ItemId;
  }
>(
  "shoppinglist/item/toggle",
  async ({ shoppingListId, itemId }, { getState }) => {
    const state = getState() as RootState;
    const item = selectItem(shoppingListId, itemId)(state);

    await postCheckUncheckEvent({
      eventName: "item_checked",
      shoppingListId,
      itemId,
      checked: item.checked,
      name: item.name,
    });
    return { shoppingListId, itemId };
  }
);
// export const toggleItem = createAction<{
//   shoppingListId: string;
//   itemId: ItemId;
// }>("shoppinglist/item/toggle");

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
  builder.addCase(toggleItem.fulfilled, (state, action) => {
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
    state[shoppingListId] = { id: shoppingListId, items: {}, createdAt: formatISO(new Date()) };
  });
  builder.addCase(removeShoppingList, (state, action) => {
    const { shoppingListId } = action.payload;
    delete state[shoppingListId];
  });
});

export const selectShoppingLists = (state: RootState) => state.shoppingLists;

export const selectShoppingList = (id: string) => (state: RootState) => state.shoppingLists[id];

export const selectItems = (shoppingListId: string) => (state: RootState) =>
  state.shoppingLists[shoppingListId]?.items;
export const selectItem = (shoppingListId: string, itemId: string) => (
  state: RootState
) => state.shoppingLists[shoppingListId]?.items[itemId];
