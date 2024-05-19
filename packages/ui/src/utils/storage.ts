import { Session } from "../contexts/SessionContext";

export function saveSessionToStorage(session: Session) {
  // TODO Parse with Zod?
  const sessionsFromStorage = localStorage.getItem("sessions") ?? "[]";
  const sessions: Session[] = JSON.parse(sessionsFromStorage);

  localStorage.setItem("sessions", JSON.stringify([...sessions, session]));
}
