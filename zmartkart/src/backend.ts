import { CheckedUncheckedEvent, ItemGraph } from "./types";
import { Err, Ok, Result } from "./result";
import { ItemId, ListId, StoreId } from "../../backend/src/types/listEvents";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const hostname = "window.location.host";
const eventApiUrl = `https://${hostname}/eventApi/telegraf`;
//const apiUrl = `https://${hostname}/api/`;
const apiUrl = `https://smartcart.tejpb.it/api/`;
const authString = "";

let accessToken: string | null = null;

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

  return accessToken;
};

class ApiResponse<T> {
  status: number;
  message: string;
  value: T;
  constructor(status: number) {
    this.status = status;
    this.value = {} as T;
    this.message = "";
  }

  setMessage(message: string): ApiResponse<T> {
    this.message = message;
    return this;
  }

  setJson(value: T): ApiResponse<T> {
    this.value = value;
    return this;
  }
}

interface ApiError {
  error: string;
}

async function fetchWithException<T>(
  url: RequestInfo,
  options?: RequestInit
): Promise<Result<ApiResponse<T>, ApiResponse<ApiError>>> {
  const token = await getAccessToken();
  try {
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Authorization: "Bearer " + token,
      },
      ...options,
    });

    if (resp.ok) {
      let response = new ApiResponse<T>(resp.status);
      response = await populateReponse(response, resp);
      return new Ok(response);
    } else {
      let response = new ApiResponse<ApiError>(resp.status);
      response = await populateReponse(response, resp);
      return new Err(response);
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function populateReponse<T>(
  apiResponse: ApiResponse<T>,
  resp: Response
): Promise<ApiResponse<T>> {
  try {
    const message = await resp.text();
    apiResponse = apiResponse.setMessage(message);

    try {
      const jsonResp = JSON.parse(message);
      apiResponse = apiResponse.setJson(jsonResp);
    } catch (error) {
      console.log("Couldn't parse json from backend", error, message);
    }
  } catch (error) {
    console.log("Couldn't get text from request", error, resp.body);
  }
  return apiResponse;
}

export const postCheckUncheckEvent = (event: CheckedUncheckedEvent) => {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      Authorization: authString,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  };

  return fetch(eventApiUrl, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

export const fetchItemGraph = () => fetchWithException<ItemGraph>(apiUrl);

export interface ListItem {
  id: ItemId;
  name: string;
  checked: boolean;
}

export interface List {
  name: string;
  id: ListId;
  storeId: StoreId;
  items: Record<ItemId, ListItem>;
}

export const fetchLists = async () => {
  const token = await getAccessToken();

  return fetch(`${apiUrl}/lists`, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Authorization: "Bearer " + token,
    },
  }).then<Record<ListId, List>>((r) => r.json());
};

export const postItemEvent = async (type: string, payload: object) => {
  const token = await getAccessToken();
  return fetch(`${apiUrl}/listEvent`, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Authorization: "Bearer " + token,
    },
    method: "POST",
    body: JSON.stringify({
      type,
      payload,
    }),
  });
};

export const addItemToList = (listId: string, itemId: string, name: string) =>
  postItemEvent("appendItemToList", {
    listId,
    item: {
      id: itemId,
      name,
    },
  });

export const checkItem = (listId: string, storeId: string, itemId: string) =>
  postItemEvent("checkItem", {
    listId,
    storeId,
    itemId,
  });

export const uncheckItem = (listId: string, storeId: string, itemId: string) =>
  postItemEvent("uncheckItem", {
    listId,
    storeId,
    itemId,
  });

export const createList = (listId: string, name: string) =>
  postItemEvent("createList", {
    storeId: "Maxi",
    listId,
    name,
  });

export const renameItem = (listId: string, itemId: string, name: string) =>
  postItemEvent("renameItem", {
    listId,
    item: {
      id: itemId,
      name,
    },
  });
