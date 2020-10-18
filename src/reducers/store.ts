import rootReducer from "./rootReducer";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

// const persistConfig = {
//   key: "root",
//   storage: AsyncStorage,
//   transforms: [JsonLiteralTransformer],
// };

//const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
});

//export const persistor = persistStore(store);
