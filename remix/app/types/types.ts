export interface CheckedUncheckedEvent {
  eventName: "item_checked";
  shoppingListId: string;
  itemId: string;
  checked: boolean;
  name: string;
}

export interface TimedCheckedUncheckedEvent {
  shoppingListId: string;
  itemId: string;
  checked: boolean;
  name: string;
  time: string;
}

export type ShoppingItem = string;

export enum Place {
  Start,
  End,
}
export const START_TOKEN = "@@START@@";

export type Relatables = ShoppingItem | Place;

export interface Relatable {
  item: ShoppingItem;
  score: number;
}

export type ItemGraph = Partial<Record<Relatables, Relatable[]>>;
