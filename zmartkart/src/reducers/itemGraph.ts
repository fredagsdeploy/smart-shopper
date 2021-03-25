import { createAction, createReducer } from "@reduxjs/toolkit";
import { ItemGraph } from "../types";
import { RootState } from "./rootReducer";

export const setGraph = createAction<ItemGraph>("itemGraph/set");

export const itemGraph = createReducer({}, (builder) => {
  builder.addCase(setGraph, (state, action) => {
    return action.payload;
  });
});

export const selectItemGraph = (state: RootState) => state.itemGraph;
