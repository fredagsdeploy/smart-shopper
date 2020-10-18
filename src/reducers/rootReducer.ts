import { combineReducers } from "@reduxjs/toolkit";
import { shoppingList } from "./shoppinglist";

const rootReducer = combineReducers({
  shoppingList,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
