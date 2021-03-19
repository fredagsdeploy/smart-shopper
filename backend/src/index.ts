require('dotenv').config()

import express, {Request} from "express";
import {generateItemGraph} from "./neo4j_repository";


const app = express();
const port = 8080;
app.get("/api", async (req: Request<unknown, unknown, unknown, { storeName: string }>, res) => {

  const userId = req.header("X-Forwarded-User")
  const email = req.header("X-Forwarded-Email")

  const storeName = req.query.storeName;

  if (storeName && userId) {
    const graph = await generateItemGraph(storeName, userId);
    res.send({hello: "world", userId, email, graph: graph});
  } else {
    res.status(400).send();
  }

});

app.listen(port, () => {
  return console.log(`server is listening osn ${port}`);
});

//time > now() - 7d
