import { raise } from "@tic-tac-toe/utils/errors";
import clsx from "clsx";
import { useState } from "react";
import { useModalContext } from "../../contexts/ModalContext";
import { useScreenContext } from "../../contexts/ScreenContext";
import {
  getRoundInfo,
  getSessionInfo,
  useSessionContext,
} from "../../contexts/SessionContext";
import { saveSessionToStorage } from "../../utils/storage";

export function RoundEndPrompt() {
  const { session, addNewRound, resetSession } = useSessionContext();
  const { changeScreen } = useScreenContext();
  const { closeModal, makeModalCancellable } = useModalContext();

  const sessionInfo = getSessionInfo(session);
  const { players, rounds } = sessionInfo;
  const { player1Wins, player2Wins, draws } = sessionInfo;

  const [hasContinued, setHasContinued] = useState(false);
  function continueToNextRound() {
    setHasContinued(true);
    addNewRound();
    closeModal();
    makeModalCancellable(true);
  }

  function stop() {
    saveSessionToStorage(session);

    closeModal();
    makeModalCancellable(true);
    changeScreen("home");

    // TODO Better way to do this...?
    setTimeout(() => {
      resetSession();
    }, 1 * 1000);
  }

  const lastRound = rounds[rounds.length - 2];
  const currentRound = rounds[rounds.length - 1];
  const round =
    (hasContinued ? lastRound : currentRound) ??
    raise("Round results does not exist...?");
  const { winner } = getRoundInfo(round);

  return (
    <form className="h-screen w-screen bg-stone-400 flex flex-col justify-center items-center gap-12">
      <h2 className="text-3xl">
        {winner === "x" && (
          <>
            <span className="font-bold">{players[0]}</span> won!
          </>
        )}
        {winner === "o" && (
          <>
            <span className="font-bold">{players[1]}</span> won!
          </>
        )}
        {winner === null && <>It's a tie!</>}
      </h2>

      <header className="flex gap-24">
        <div>
          <h3
            className={clsx(
              "text-xl font-bold",
              winner === "x" && "text-green-700"
            )}
          >
            {players[0]}
          </h3>
          <ol className="flex gap-3">
            <li
              className={clsx("font-bold", winner === "x" && "text-green-700")}
            >
              W {player1Wins}
            </li>
            <li className={clsx(winner === "o" && "text-red-700")}>
              L {player2Wins}
            </li>
            <li className="text-black/50">D {draws}</li>
          </ol>
        </div>

        <div className="text-right">
          <h3
            className={clsx(
              "text-xl font-bold",
              winner === "o" && "text-green-700"
            )}
          >
            {players[1]}
          </h3>
          <ol className="flex flex-row-reverse gap-3">
            <li
              className={clsx("font-bold", winner === "o" && "text-green-700")}
            >
              W {player2Wins}
            </li>
            <li className={clsx(winner === "x" && "text-red-700")}>
              L {player1Wins}
            </li>
            <li className="text-black/50">D {draws}</li>
          </ol>
        </div>
      </header>

      <footer className="flex flex-col justify-center items-center gap-3">
        <button
          type="button"
          onClick={continueToNextRound}
          className="bg-white p-3 rounded-lg text-xl font-bold transition disabled:opacity-50"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={stop}
          className="p-3 rounded-lg hover:underline underline-offset-2"
        >
          Stop
        </button>
      </footer>
    </form>
  );
}
