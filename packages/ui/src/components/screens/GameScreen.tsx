import { ComponentProps, useState } from "react";
import { raise } from "utils/errors";
import {
  Cell,
  Player,
  Round,
  useSessionContext,
} from "../../contexts/SessionContext";

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
  ] as const;

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

function useSessionInfo() {
  const { session } = useSessionContext();
  const { players, rounds } = session;

  if (players === null) {
    raise("Players does not exist...?");
  }
  players satisfies NonNullable<typeof players>;

  let player1Wins = 0;
  let player2Wins = 0;
  let draws = 0;
  for (const round of rounds) {
    if (round.winner === "x") player1Wins++;
    if (round.winner === "o") player2Wins++;
    if (round.winner === null) draws++;
  }

  const round =
    rounds[rounds.length - 1] ?? raise("Current round does not exist...?");
  const winningIndices = getWinningIndices(round.board);

  const hasWinner = winningIndices !== null;
  const hasFreeBoardCells = round.board.some((cell) => cell === null);
  const isRoundOver = hasWinner || !hasFreeBoardCells;

  return {
    ...{ players, rounds },
    ...{ player1Wins, player2Wins, draws },
    ...{ round, winningIndices, isRoundOver },
  };
}

function BoardCellButton(props: {
  cell: Cell;
  onClick: ComponentProps<"button">["onClick"];
}) {
  const { cell, onClick } = props;

  return (
    <button
      type="button"
      disabled={cell !== null}
      onClick={onClick}
      className="bg-white rounded-lg"
    >
      {cell === "x" && <span className="text-6xl font-bold">X</span>}
      {cell === "o" && <span className="text-6xl font-bold">O</span>}
    </button>
  );
}

export function GameScreen() {
  const { setCurrentRound } = useSessionContext();

  const sessionInfo = useSessionInfo();
  const { players, rounds } = sessionInfo;
  const { player1Wins, player2Wins, draws } = sessionInfo;
  const { round, winningIndices, isRoundOver } = sessionInfo;

  const [currentPlayer, setCurrentPlayer] = useState<Player>("x");
  function changeToNextPlayer() {
    if (currentPlayer === "x") {
      setCurrentPlayer("o");
      return;
    }

    if (currentPlayer === "o") {
      setCurrentPlayer("x");
      return;
    }

    currentPlayer satisfies never;
  }

  function makeMove(idx: number) {
    round.board[idx] = currentPlayer;
    setCurrentRound({ ...round });

    changeToNextPlayer();
  }

  // TODO if with winner, useEffect update round, show game end modal

  return (
    <article className="bg-stone-300 h-screen w-screen grid grid-rows-[auto_1fr]">
      <header className="grid grid-cols-3 p-6">
        <div>
          <h2 className="text-xl font-bold">{players[0]}</h2>
          <ol className="flex gap-3">
            <li className="font-bold">W {player1Wins}</li>
            <li>L {player2Wins}</li>
            <li className="text-black/50">D {draws}</li>
          </ol>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold">Round {rounds.length}</h1>
        </div>

        <div className="text-right">
          <h2 className="text-xl font-bold">{players[1]}</h2>
          <ol className="flex flex-row-reverse gap-3">
            <li className="font-bold">W {player2Wins}</li>
            <li>L {player1Wins}</li>
            <li className="text-black/50">D {draws}</li>
          </ol>
        </div>
      </header>

      <form className="grid place-items-center">
        <fieldset
          disabled={isRoundOver}
          className="grid grid-cols-3 grid-rows-3 gap-6 p-6 rounded-lg aspect-square h-2/3 bg-stone-400 disabled:opacity-50"
        >
          {round.board.map((cell, idx) => (
            <BoardCellButton
              key={idx}
              cell={cell}
              onClick={() => makeMove(idx)}
            />
          ))}
        </fieldset>
      </form>
    </article>
  );
}
