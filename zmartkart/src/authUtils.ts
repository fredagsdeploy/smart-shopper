import { Platform } from "react-native";
import * as AppAuth from "expo-app-auth";
import { decode, encode } from "base-64";
import * as SecureStore from "expo-secure-store";

let accessToken: string | null = null;

export const platformClientIds = {
  iosClientId:
    "73488926457-lgc68tu3558a6kbh4iuf7p2i7co90mhf.apps.googleusercontent.com",
  androidClientId:
    "73488926457-ecdu70s6efetsudrquol79acuf94pivj.apps.googleusercontent.com",
};

export const platformClientIdKey = Platform.select<
  keyof typeof platformClientIds
>({
  ios: "iosClientId",
  android: "androidClientId",
  default: "androidClientId",
});

export const refreshTokenConfig = {
  issuer: "https://accounts.google.com",
  clientId: platformClientIds[platformClientIdKey],
  scopes: ["profile"],
};

export const refreshAuthAsync = async (refreshToken: string) => {
  return await AppAuth.refreshAsync(refreshTokenConfig, refreshToken);
};

export const isTokenExpired = (token: string) => {
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

export const clearRefreshToken = async (): Promise<void> => {
  return SecureStore.deleteItemAsync("refreshToken");
};

export const setRefreshToken = async (token: string): Promise<void> => {
  return SecureStore.setItemAsync("refreshToken", token);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync("refreshToken");
};

export const setAccessToken = async (token: string | null): Promise<void> => {
  accessToken = token;
  if (Platform.OS === "web") {
    return;
  }

  if (token) {
    return SecureStore.setItemAsync("token", token);
  } else {
    return SecureStore.deleteItemAsync("token");
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return "web";
  }

  if (!accessToken) {
    accessToken = await SecureStore.getItemAsync("token");
  }

  if (typeof accessToken === "string" && isTokenExpired(accessToken)) {
    const r = await getRefreshToken();
    if (!r) {
      return null;
    }
    try {
      const resp = await refreshAuthAsync(r);
      await setAccessToken(resp.idToken);
      return resp.accessToken;
    } catch (error) {
      console.log(
        `Could not refresh access token. Clearing access and refresh tokens. Error ${error}`
      );
      await clearRefreshToken();
      return null;
    }
  }

  return accessToken;
};
