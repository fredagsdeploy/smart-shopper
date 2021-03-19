require("dotenv").config();

import express, { Request } from "express";
import { generateItemGraph } from "./neo4j_repository";

const app = express();
const port = 8080;
app.get(
  "/api",
  async (
    req: Request<unknown, unknown, unknown, { storeName: string }>,
    res
  ) => {
    const userId = req.header("X-Forwarded-User")!;
    const email = req.header("X-Forwarded-Email");

    const storeName = req.query.storeName;
    
    if (!storeName) {
      res.status(400).send({error: "Missing storeName"});
      return
    }

    const graph = await generateItemGraph(storeName, userId);
    res.send({ hello: "world", userId, email, graph: graph });
  }
);

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
