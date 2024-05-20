import cors from "cors";
import express from "express";
import { connectToDb } from "./db/db";
import { SessionsRouter } from "./routes/sessions";
import { env } from "./utils/env";

const app = express();
app.use(express.json());

// TODO Only allow specific origins?
app.use(cors());

app.use("/api/v0", SessionsRouter);

async function run() {
  await connectToDb();

  app.listen(env.PORT, () => {
    console.log(`Listening on port: ${env.PORT}`);
  });
}
run();
