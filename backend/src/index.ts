import express, {Request} from "express";
import {generateItemGraph} from "./neo4j_container";

require('dotenv').config()

const app = express();
const port = 3001;
app.get("/", async (req: Request<unknown, unknown, unknown, { storeName: string }>, res) => {
  const storeName = req.query.storeName;
  const userId = "";

  if (storeName && userId) {
    const graph = await generateItemGraph(storeName, userId);
    res.send(graph);
  } else {
    res.status(400).send();
  }
});
app.listen(port, () => {
  return console.log(`server is listening osn ${port}`);
});

//time > now() - 7d
