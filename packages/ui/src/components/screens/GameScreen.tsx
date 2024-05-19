import { raise } from "utils/errors";
import { useSessionContext } from "../../contexts/SessionContext";

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

  return {
    ...{ players, rounds },
    ...{ player1Wins, player2Wins, draws },
    round,
  };
}

export function GameScreen() {
  const { setCurrentRound } = useSessionContext();
  const { players, rounds, player1Wins, player2Wins, draws, round } =
    useSessionInfo();

  function makeMove(idx: number) {
    round.board[idx] = "x"; // Should use current player
    setCurrentRound({ ...round });

    // TODO Should cycle to next player
  }

  // TODO Add state for current player turn

  // TODO Check if round board already has a winner
  // TODO if with winner, disable form fieldset below
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
        <fieldset className="grid grid-cols-3 grid-rows-3 gap-6 p-6 rounded-lg aspect-square h-2/3 bg-stone-400">
          {round.board.map((cell, idx) => (
            <button
              type="button"
              key={idx}
              disabled={cell !== null}
              onClick={() => makeMove(idx)}
              className="bg-white rounded-lg"
            >
              {cell === "x" && <span className="text-6xl font-bold">X</span>}
              {cell === "o" && <span className="text-6xl font-bold">O</span>}
            </button>
          ))}
        </fieldset>
      </form>
    </article>
  );
}
