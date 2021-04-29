import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchItemGraph, fetchLists } from "../backend";
import {LayoutAnimation} from "react-native";

export const fetchListAndGraph = createAsyncThunk(
  "lists",
  async (shoppingListId: string) => {
    const lists = await fetchLists();
    const res = await fetchItemGraph(shoppingListId);

    if (res.success) {
      return { lists, graph: res.unwrap().value.graph };
    } else {
      return { lists, graph: {} };
    }
  }
);
