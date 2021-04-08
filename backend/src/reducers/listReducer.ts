import {
  ItemId,
  ListEvent,
  ListId,
  StoreId,
  UserId,
} from "../types/listEvents";

export const INITIAL_CHECKED_ITEM = "@@START@@";

export interface ListItem {
  id: ItemId;
  name: string;
  checked: boolean;
}

export interface List {
  name: string;
  id: ListId;
  storeId: StoreId;
  items: Record<ItemId, ListItem>;
  lastCheckedItem: ItemId;
}

export type ListsByUserId = Record<UserId, Record<ListId, List>>;

export const listReducer = (state: ListsByUserId, action: ListEvent): void => {
  const { userId, listId } = action.payload;
  if (!state[userId]) {
    state[userId] = {};
  }

  switch (action.type) {
    case "createList": {
      const { name, storeId } = action.payload;

      if (!state[userId][listId]) {
        state[userId][listId] = {
          name,
          storeId,
          id: listId,
          items: {},
          lastCheckedItem: INITIAL_CHECKED_ITEM,
        };
      }
      return;
    }
    case "moveListToStore": {
      const { listId, storeId } = action.payload;

      if (state[userId][listId]) {
        state[userId][listId].storeId = storeId;
      }
      return;
    }
    case "removeList": {
      const { listId } = action.payload;

      delete state[userId][listId];
      return;
    }
    case "appendItemToList": {
      const {
        item: { name, id },
      } = action.payload;

      if (state[userId][listId]) {
        state[userId][listId].items[id] = { id, name, checked: false };
      }
      return;
    }

    case "renameItem": {
      const {
        item: { name, id },
      } = action.payload;

      if (state[userId][listId]?.items[id]) {
        state[userId][listId].items[id].name = name;
      }
      return;
    }
    case "checkItem": {
      const { itemId: id } = action.payload;

      if (state[userId][listId]?.items[id]) {
        state[userId][listId].lastCheckedItem = id;
        state[userId][listId].items[id].checked = true;
      }
      return;
    }
    case "uncheckItem": {
      const { itemId: id } = action.payload;

      if (state[userId][listId]?.items[id]) {
        state[userId][listId].lastCheckedItem = INITIAL_CHECKED_ITEM;
        state[userId][listId].items[id].checked = false;
      }
      return;
    }

    case "removeItem": {
      const { itemId: id } = action.payload;

      delete state[userId][listId]?.items[id];
      return;
    }
  }
};
