import { Session, zSession } from "@tic-tac-toe/schemas";

export function getSessionsFromStorage(): Session[] {
  const sessionsAsStr = localStorage.getItem("sessions");
  if (sessionsAsStr === null) return [];

  const sessionsAsObj = JSON.parse(sessionsAsStr);
  const parsing = zSession.array().safeParse(sessionsAsObj);
  if (!parsing.success) {
    console.warn(parsing.error);
    console.warn(
      "Failed to parse stored sessions; defaulting to empty array..."
    );
    return [];
  }

  const sessions = parsing.data;

  return sessions;
}

export function getOldestSessionFromStorage(): Session | null {
  const sessions = getSessionsFromStorage();
  const session = sessions[0] ?? null;
  return session;
}

export function removeOldestSessionFromStorage() {
  const [, ...others] = getSessionsFromStorage();
  localStorage.setItem("sessions", JSON.stringify(others));
}

export function saveSessionToStorage(session: Session) {
  const sessions = getSessionsFromStorage();
  localStorage.setItem("sessions", JSON.stringify([...sessions, session]));
}
