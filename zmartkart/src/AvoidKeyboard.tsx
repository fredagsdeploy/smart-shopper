import React from "react";

import { useHeaderHeight } from "@react-navigation/stack";
import { KeyboardAvoidingView, Platform } from "react-native";

export const AvoidKeyboard: React.FC = ({ children }) => {
  const height = useHeaderHeight();
  if (Platform.OS === "ios") {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"padding"}
        keyboardVerticalOffset={height}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }
  return <>{children}</>;
};
