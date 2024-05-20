import express from "express";
import { connectToDb } from "./db/db";
import { env } from "./utils/env";

const app = express();

app.get("/", (req, res) => {
  res.json("Hello, world!");
});

async function run() {
  await connectToDb();

  app.listen(env.API_PORT, () => {
    console.log(`Listening on port: ${env.API_PORT}`);
  });
}
run();
