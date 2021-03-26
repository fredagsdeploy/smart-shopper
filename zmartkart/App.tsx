import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import { Navigation } from "./navigation";

import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./src/reducers/store";
import { fetchItemGraph } from "./src/backend";
import { setGraph } from "./src/reducers/itemGraph";
import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <NewApp />
      </Provider>
    </QueryClientProvider>
  );
}

function NewApp() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchItemGraph()
      .then((res) => {
        if (res.success) {
          console.log("Successfully got item graph", res);
          dispatch(setGraph(res.unwrap().value));
        }
      })
      .catch((err) => console.log(err));
  }, [dispatch]);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
