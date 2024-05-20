import { Session } from "@tic-tac-toe/schemas";

export function getSessionsFromStorage() {
  // TODO Parse with Zod?
  const sessionsFromStorage = localStorage.getItem("sessions") ?? "[]";
  const sessions: Session[] = JSON.parse(sessionsFromStorage);

  return sessions;
}

export function saveSessionToStorage(session: Session) {
  const sessions = getSessionsFromStorage();
  localStorage.setItem("sessions", JSON.stringify([...sessions, session]));
}
