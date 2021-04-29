import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/reducers/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { Platform, UIManager } from "react-native";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./src/hooks/useCachedResources";
import useColorScheme from "./src/hooks/useColorScheme";
import { Navigation } from "./src/navigation";

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

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
