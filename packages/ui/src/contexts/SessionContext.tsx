import { useCallback, useState } from "react";
import { createNewContext } from "../utils/react";

type Round = {
  board: string;
  winner:
    | string // A player
    | null // Tie (no one won)
    | undefined; // No winner yet; round is possibly on-going or left unfinished
};
type Session = {
  players: [string, string] | null;
  rounds: Round[];
};

const BASE_SESSION = (): Session => ({
  players: null,
  rounds: [],
});

export const [useSessionContext, SessionProvider] = createNewContext(() => {
  const [session, setSession] = useState(BASE_SESSION());
  const resetSession = useCallback(() => {
    setSession(BASE_SESSION());
  }, []);
  const setSessionPlayers = useCallback(
    (players: NonNullable<Session["players"]>) => {
      setSession((session) => ({
        ...session,
        players,
      }));
    },
    []
  );

  return {
    ...{ session, resetSession, setSessionPlayers },
  };
});
