import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchItemGraph, fetchLists } from "../backend";
import { LayoutAnimation } from "react-native";

export const fetchListAndGraph = createAsyncThunk(
  "listsAndGraph",
  async (shoppingListId: string) => {
    const [lists, res] = await Promise.all([
      fetchLists(),
      fetchItemGraph(shoppingListId),
    ]);

    if (res.success) {
      return { lists, graph: res.unwrap().value.graph };
    } else {
      return { lists, graph: {} };
    }
  }
);

export const fetchAllLists = createAsyncThunk("lists", async () => {
  return fetchLists();
});
