const hostname = window.location.host;
const eventApiUrl = `https://${hostname}/eventApi/`;
const authString = "";
export const postCheckUncheckEvent = (event: any) => {
  var myHeaders = new Headers();
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

  var raw = JSON.stringify(event);

  var requestOptions: RequestInit = {
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
