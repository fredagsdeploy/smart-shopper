// Events published on the topic "lists"
export type UserId = string;
export type ListId = string;
export type StoreId = string;
export type ItemId = string;

export type ListEvent =
  | CreateList
  | MoveListToStore
  | RemoveList
  | AppendItemToList
  | RenameItem
  | CheckItem
  | UncheckItem
  | RemoveItem;

export interface CreateList {
  type: "createList";
  payload: {
    storeId: StoreId;
    listId: ListId;
    name: string;
    userId: UserId;
  };
}

export interface RemoveList {
  type: "removeList";
  payload: {
    listId: ListId;
    userId: UserId;
  };
}

export interface MoveListToStore {
  type: "moveListToStore";
  payload: {
    listId: ListId;
    storeId: StoreId;
    userId: UserId;
  };
}

export interface AppendItemToList {
  type: "appendItemToList";
  payload: {
    listId: ListId;
    userId: UserId;
    item: {
      id: ItemId;
      name: string;
    };
  };
}

export interface RenameItem {
  type: "renameItem";
  payload: {
    listId: ListId;
    userId: UserId;
    item: {
      id: ItemId;
      name: string;
    };
  };
}

export interface CheckItem {
  type: "checkItem";
  payload: {
    listId: ListId;
    storeId: StoreId;
    userId: UserId;
    itemId: ItemId;
  };
}

export interface UncheckItem {
  type: "uncheckItem";
  payload: {
    listId: ListId;
    storeId: StoreId;
    userId: UserId;
    itemId: ItemId;
  };
}

export interface RemoveItem {
  type: "removeItem";
  payload: {
    listId: ListId;
    userId: UserId;
    itemId: ItemId;
  };
}
