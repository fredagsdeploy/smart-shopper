import rootReducer from "./rootReducer";

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";


export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
});
