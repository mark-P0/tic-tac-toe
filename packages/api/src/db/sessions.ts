import { SessionModel } from "./db";

export async function getAllSessionsFromMostToLeastRecent() {
  const sessions = await SessionModel.find({}, null, {
    sort: { timestampMs: -1 },
  });

  return sessions;
}
