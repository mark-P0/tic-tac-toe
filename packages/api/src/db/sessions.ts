import { type Session } from "@tic-tac-toe/schemas";
import { SessionModel } from "./db";

export async function getAllSessionsFromMostToLeastRecent() {
  const sessions = await SessionModel.find({}, null, {
    sort: { timestampMs: -1 },
  });

  return sessions;
}

export async function saveNewSession(session: Session) {
  const doc = new SessionModel(session);
  await doc.save();

  return doc;
}
