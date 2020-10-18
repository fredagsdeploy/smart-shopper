import { combineReducers } from "@reduxjs/toolkit";
import { shoppingLists } from "./shoppingLists";

const rootReducer = combineReducers({
  shoppingLists,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
