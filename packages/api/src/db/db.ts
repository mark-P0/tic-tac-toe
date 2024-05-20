import mongoose from "mongoose";
import { env } from "../utils/env";

export async function connectToDb() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(env.MONGO_CONNECTION_STRING);
    console.log("Connected to database.");
  } catch (error) {
    console.error(error);
    throw new Error("Failed connecting to database");
  }
}
