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

const BASE_ROUND = (): Round => ({
  board: "_________",
  winner: undefined,
});
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
  const addNewRound = useCallback(() => {
    setSession((session) => ({
      ...session,
      rounds: [...session.rounds, BASE_ROUND()],
    }));
  }, []);

  return {
    ...{ session, resetSession, setSessionPlayers },
    addNewRound,
  };
});
