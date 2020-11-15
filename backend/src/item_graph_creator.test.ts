import { generateItemGraph, increaseEdgeScore } from "./item_graph_creator";
import { Place, TimedCheckedUncheckedEvent } from "../../frontend/src/types";

it("should create item graph from array of checked/unchecked events", function () {
  let events: TimedCheckedUncheckedEvent[] = [
    {
      time: "2020-11-03T23:39:13.965Z",
      checked: true,
      itemId: "2f55be07-094b-4d12-b0b5-272b78b08a47",
      name: "bröd",
      shoppingListId: "446aa535-9da5-4975-9bcd-937e55d15395",
    },
    {
      time: "2020-11-03T23:39:17.877Z",
      checked: true,
      itemId: "d1663264-4e41-4344-ab81-5c1188e276c8",
      name: "tomater",
      shoppingListId: "446aa535-9da5-4975-9bcd-937e55d15395",
    },
    {
      time: "2020-11-03T23:39:19.552Z",
      checked: true,
      itemId: "eaed15ff-ecb3-4bdf-b573-f22f69d46655",
      name: "gurka",
      shoppingListId: "446aa535-9da5-4975-9bcd-937e55d15395",
    },
    {
      time: "2020-11-03T23:39:25.460Z",
      checked: true,
      itemId: "2fe20761-0e7b-4868-b3e3-31e7b8b15506",
      name: "sparris",
      shoppingListId: "446aa535-9da5-4975-9bcd-937e55d15395",
    },
    {
      time: "2020-11-03T23:39:33.674Z",
      checked: true,
      itemId: "4e775a6a-60b9-47d0-918f-b5ed9b9cfea9",
      name: "sallad",
      shoppingListId: "446aa535-9da5-4975-9bcd-937e55d15395",
    },
    {
      time: "2020-11-03T23:39:42.852Z",
      checked: true,
      itemId: "3d3f14a9-451f-40d5-bbec-ab71efe6c548",
      name: "smör",
      shoppingListId: "446aa535-9da5-4975-9bcd-937e55d15395",
    },
    {
      time: "2020-11-03T23:39:43.968Z",
      checked: true,
      itemId: "a7bbdb8c-b4be-4de9-bb62-fcb1607eafcd",
      name: "yoghurt",
      shoppingListId: "446aa535-9da5-4975-9bcd-937e55d15395",
    },
    {
      time: "2020-11-03T23:39:44.825Z",
      checked: true,
      itemId: "57ef7abe-8240-4a7c-8fb7-40554b5ec542",
      name: "ägg",
      shoppingListId: "446aa535-9da5-4975-9bcd-937e55d15395",
    },
    {
      time: "2020-11-03T23:39:47.554Z",
      checked: true,
      itemId: "c0a53ba3-242e-45f9-8944-6ca6a8549957",
      name: "popcorn",
      shoppingListId: "446aa535-9da5-4975-9bcd-937e55d15395",
    },
    {
      time: "2020-11-03T23:39:48.223Z",
      checked: true,
      itemId: "082e2259-ce0f-4957-b448-90afa99efe49",
      name: "kyckling",
      shoppingListId: "446aa535-9da5-4975-9bcd-937e55d15395",
    },
    {
      time: "2020-11-03T23:46:01.130Z",
      checked: true,
      itemId: "2",
      name: "Äpple",
      shoppingListId: "asd",
    },
  ];

  let graph = generateItemGraph(events);

  expect(graph).toEqual({
    [Place.Start]: [
      { item: "bröd", score: 1 },
      { item: "Äpple", score: 1 },
    ],
    bröd: [{ item: "tomater", score: 1 }],
    tomater: [{ item: "gurka", score: 1 }],
    gurka: [{ item: "sparris", score: 1 }],
    sparris: [{ item: "sallad", score: 1 }],
    sallad: [{ item: "smör", score: 1 }],
    smör: [{ item: "yoghurt", score: 1 }],
    yoghurt: [{ item: "ägg", score: 1 }],
    ägg: [{ item: "popcorn", score: 1 }],
    popcorn: [{ item: "kyckling", score: 1 }],
    kyckling: [],
    Äpple: [],
  });

  graph = generateItemGraph(events, graph);
  expect(graph).toEqual({
    [Place.Start]: [
      { item: "bröd", score: 2 },
      { item: "Äpple", score: 2 },
    ],
    bröd: [{ item: "tomater", score: 2 }],
    tomater: [{ item: "gurka", score: 2 }],
    gurka: [{ item: "sparris", score: 2 }],
    sparris: [{ item: "sallad", score: 2 }],
    sallad: [{ item: "smör", score: 2 }],
    smör: [{ item: "yoghurt", score: 2 }],
    yoghurt: [{ item: "ägg", score: 2 }],
    ägg: [{ item: "popcorn", score: 2 }],
    popcorn: [{ item: "kyckling", score: 2 }],
    kyckling: [],
    Äpple: [],
  });
});

it("should increase the edge score by 1", function () {
  expect(
    increaseEdgeScore(
      [
        { item: "bröd", score: 1 },
        { item: "Äpple", score: 1 },
      ],
      "bröd"
    )
  ).toEqual([
    { item: "bröd", score: 2 },
    { item: "Äpple", score: 1 },
  ]);

  expect(increaseEdgeScore([], "bröd")).toEqual([{ item: "bröd", score: 1 }]);
});
