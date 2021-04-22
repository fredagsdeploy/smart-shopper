import { Platform } from "react-native";
import * as AppAuth from "expo-app-auth";
import { decode, encode } from "base-64";

export const platformClientIds = {
  iosClientId:
    "73488926457-lgc68tu3558a6kbh4iuf7p2i7co90mhf.apps.googleusercontent.com",
  androidClientId:
    "73488926457-ecdu70s6efetsudrquol79acuf94pivj.apps.googleusercontent.com",
};

export const platformClientIdKey =
  Platform.OS === "ios" ? "iosClientId" : "androidClientId";

export const refreshTokenConfig = {
  issuer: "https://accounts.google.com",
  clientId: platformClientIds[platformClientIdKey],
  scopes: ["profile"],
};

export const refreshAuthAsync = async (refreshToken: string) => {
  let authState = await AppAuth.refreshAsync(refreshTokenConfig, refreshToken);
  console.log("refreshAuth", authState);
  return authState;
};

export const checkIfTokenExpired = (token: string) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.error(`Wierd token, assume expiered. Token: ${token}`);
    return false;
  }
  const payload = decode(parts[1]);
  const jsonPayload = JSON.parse(payload);

  if (!jsonPayload.exp) {
    return false;
  }
  return new Date(jsonPayload.exp * 1000) < new Date();
};
