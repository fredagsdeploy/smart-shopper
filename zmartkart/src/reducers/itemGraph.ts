import { createSlice } from "@reduxjs/toolkit";
import { ItemGraph } from "../types";
import { RootState } from "./rootReducer";
import { fetchListAndGraph } from "./thunks";

export interface ItemGraphState {
  graph: ItemGraph;
  loading: boolean;
}

const initialState: ItemGraphState = { graph: {}, loading: false };

const itemGraphSlice = createSlice({
  initialState,
  reducers: {
    setGraph: (state, action) => {
      state.graph = action.payload;
    },
  },
  extraReducers: {
    [fetchListAndGraph.fulfilled as any]: (state, action) => {
      state.graph = action.payload.graph;
      state.loading = false;
    },
    [fetchListAndGraph.pending as any]: (state, action) => {
      state.loading = true;
    },
  },
  name: "graph",
});

export const setGraph = itemGraphSlice.actions.setGraph;
export const itemGraph = itemGraphSlice.reducer;

export const selectItemGraph = (state: RootState) => state.itemGraph.graph;
export const selectItemGraphLoading = (state: RootState) => state.itemGraph.loading;
