import express from "express";
import { env } from "./utils/env";

const app = express();

app.get("/", (req, res) => {
  res.json("Hello, world!");
});

app.listen(env.API_PORT, () => {
  console.log(`Listening on port: ${env.API_PORT}`);
});
