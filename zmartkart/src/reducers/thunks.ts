import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchItemGraph, fetchLists } from "../backend";
import { ShoppingListState } from "./shoppingLists";
import { ItemGraph } from "../types";
import {LayoutAnimation} from "react-native";

interface MyCrappyData {
  lists: ShoppingListState;
  graph: ItemGraph;
}

export const fetchListAndGraph = createAsyncThunk(
  "lists",
  async (shoppingListId: string) => {
    const lists = await fetchLists();
    const res = await fetchItemGraph(shoppingListId);

    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );
    if (res.success) {
      return { lists, graph: res.unwrap().value.graph };
    } else {
      return { lists, graph: {} };
    }
  }
);
