import { combineReducers } from "@reduxjs/toolkit";
import { shoppingLists } from "./shoppingLists";
import { itemGraph } from "./itemGraph";

const rootReducer = combineReducers({
  shoppingLists,
  itemGraph,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
