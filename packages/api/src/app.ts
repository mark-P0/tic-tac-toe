import express from "express";
import { connectToDb } from "./db/db";
import { SessionsRouter } from "./routes/sessions";
import { env } from "./utils/env";

const app = express();

app.use("/api/v0", SessionsRouter);

async function run() {
  await connectToDb();

  app.listen(env.API_PORT, () => {
    console.log(`Listening on port: ${env.API_PORT}`);
  });
}
run();
