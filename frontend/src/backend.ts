import { CheckedUncheckedEvent, ItemGraph } from "./types";
import { Err, Ok, Result } from "./result";

const hostname = window.location.host;
const eventApiUrl = `https://${hostname}/eventApi/telegraf`;
//const apiUrl = `https://${hostname}/api/`;
const apiUrl = `https://smartcart.tejpb.it/api/`;
const authString = "";

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
  const fullOptions: any = {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    ...options,
  };

  try {
    const resp = await fetch(url, fullOptions);

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
      console.log("Couldn't parse json from backend", error, resp.body);
    }
  } catch (error) {
    console.log("Couldn't get text from request", error, resp.body);
  }
  return apiResponse;
}

export const postCheckUncheckEvent = (event: CheckedUncheckedEvent) => {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", authString);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");
  myHeaders.append(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  myHeaders.append(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, X-Auth-Token"
  );

  let raw = JSON.stringify(event);

  let requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(eventApiUrl, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

export const fetchItemGraph = () => fetchWithException<ItemGraph>(apiUrl);
