import { type Round, type Session } from "@tic-tac-toe/schemas";
import mongoose, { Schema } from "mongoose";
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

const RoundSchema = new Schema<Round>({
  board: [{ type: String, enum: ["x", "o", null] }],
});
const SessionSchema = new Schema<Session>({
  timestampMs: { type: Number, required: true },
  players: [String, String],
  rounds: { type: [RoundSchema], required: true },
});

export const SessionModel = mongoose.model<Session>("Session", SessionSchema);
