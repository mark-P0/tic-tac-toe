import { useCallback, useState } from "react";
import { createNewContext } from "../utils/react";

export type Player = "x" | "o";
export type Cell = Player | null;
export type Round = {
  board: Cell[];
  winner:
    | Player // "Symbol" of a player
    | null // Draw (no one won)
    | undefined; // No winner yet; round is possibly on-going or left unfinished
};
type Session = {
  players: [string, string] | null;
  rounds: Round[];
};

const BASE_ROUND = (): Round => ({
  board: Array<Cell>(3 * 3).fill(null),
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
  const setCurrentRound = useCallback((round: Round) => {
    setSession((session) => ({
      ...session,
      rounds: [...session.rounds.slice(0, -1), round],
    }));
  }, []);

  return {
    ...{ session, resetSession, setSessionPlayers },
    ...{ addNewRound, setCurrentRound },
  };
});
