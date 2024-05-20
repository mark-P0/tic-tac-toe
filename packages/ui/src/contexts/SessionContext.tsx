import { Cell, Player, Round, Session } from "@tic-tac-toe/schemas";
import { raise } from "@tic-tac-toe/utils/errors";
import { useCallback, useState } from "react";
import { createNewContext } from "../utils/react";

function getWinningIndices(board: Round["board"]) {
  const slices = [
    // Horizontals
    ...[
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ],
    // Verticals
    ...[
      [0, 3, 6],
      [1, 4, 7],
      [2, 8, 5],
    ],
    // Diagonals
    ...[
      [0, 4, 8],
      [2, 4, 6],
    ],
  ];

  for (const slice of slices) {
    const [a, b, c] = slice;

    if (
      board[a] !== null &&
      board[a] === board[b] &&
      board[a] === board[c] &&
      board[b] === board[c]
    )
      return slice;
  }

  return null;
}

export function getRoundInfo(round: Round) {
  const winningIndices = getWinningIndices(round.board);

  const hasWinner = winningIndices !== null;
  const hasFreeBoardCells = round.board.includes(null);
  const isRoundOver = hasWinner || !hasFreeBoardCells;

  type Winner =
    | Player // "Symbol" of a player
    | null // Draw (no one won)
    | undefined; // No winner yet; round is possibly on-going or left unfinished
  let winner: Winner = null;
  if (!isRoundOver) {
    winner = undefined;
  }
  if (hasWinner) {
    const idx = winningIndices[0];
    winner = round.board[idx];
  }

  return {
    ...{ winningIndices, winner },
    ...{ hasWinner, hasFreeBoardCells, isRoundOver },
  };
}

export function getSessionInfo(session: Session) {
  const { players, rounds } = session;

  if (players === null) {
    raise("Players does not exist...?");
  }
  players satisfies NonNullable<typeof players>;

  let player1Wins = 0;
  let player2Wins = 0;
  let draws = 0;
  for (const round of rounds) {
    const { winner } = getRoundInfo(round);
    if (winner === "x") player1Wins++;
    if (winner === "o") player2Wins++;
    if (winner === null) draws++;
  }

  const round =
    rounds[rounds.length - 1] ?? raise("Current round does not exist...?");

  return {
    ...{ players, rounds },
    ...{ player1Wins, player2Wins, draws },
    ...{ round },
  };
}

const BASE_ROUND = (): Round => ({
  board: Array<Cell>(3 * 3).fill(null),
});
const BASE_SESSION = (): Session => ({
  timestampMs: Date.now(),
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
