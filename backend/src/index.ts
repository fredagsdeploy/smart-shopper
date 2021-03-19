import express from "express";
const app = express();
const port = 8080;
app.get("/api", (req, res) => {

  const userId = req.header("X-Forwarded-User")
  const email = req.header("X-Forwarded-Email")


  res.send({ hello: "world", userId, email });
});
app.listen(port, () => {
  return console.log(`server is listening osn ${port}`);
});

//time > now() - 7d
