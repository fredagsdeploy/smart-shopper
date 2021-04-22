import { createSlice } from "@reduxjs/toolkit";
import { ItemGraph } from "../types";
import { RootState } from "./rootReducer";
import {fetchListAndGraph} from "./thunks";

const initialState: ItemGraph = {};

const itemGraphSlice = createSlice({
  initialState,
  reducers: {
    setGraph: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: {
    [fetchListAndGraph.fulfilled as any]: (state, action) => {
      return action.payload.graph;
    },
  },
  name: "graph",
});

export const setGraph = itemGraphSlice.actions.setGraph;
export const itemGraph = itemGraphSlice.reducer;

export const selectItemGraph = (state: RootState) => state.itemGraph;
