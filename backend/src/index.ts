import express from "express";
import { generateItemGraph } from "./item_graph_creator";
import schedule from "node-schedule";

const Influx = require("influx");
const influx = new Influx.InfluxDB({
  host: "localhost",
  database: "telegraf",
  schema: [],
});

let graph = {};

influx
  .query(
    `
    select * from "telegraf"."autogen"."item_checked" where time > now() - 28d ;
  `
  )
  .then((entries) => {
    console.log("first entires", entries);
    graph = generateItemGraph(entries);
  })
  .catch((err) => {
    console.log("Error, could not fetch entries from database.", err);
    process.exit(1);
  });

// Update the state every midnight
schedule.scheduleJob("0 0 * * * *", () => {
  console.log("Running scheduled data fetch");
  influx
    .query(
      `
    select * from "telegraf"."autogen"."item_checked" where time > now() - 1d ;
  `
    )
    .then((entries) => {
      console.log("Entries fetched", entries);
      graph = generateItemGraph(entries, graph);
      console.log("Graph updated");
    })
    .catch((err) => {
      console.log(
        "Error, could not fetch entries from database during daily update",
        err
      );
    });
});

const app = express();
const port = 3001;
app.get("/", (req, res) => {
  res.send(graph);
});
app.listen(port, () => {
  return console.log(`server is listening osn ${port}`);
});

//time > now() - 7d
