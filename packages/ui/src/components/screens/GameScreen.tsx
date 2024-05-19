import clsx from "clsx";
import { ComponentProps, useEffect, useState } from "react";
import { raise } from "utils/errors";
import { useModalContext } from "../../contexts/ModalContext";
import { useScreenContext } from "../../contexts/ScreenContext";
import {
  Cell,
  Player,
  getRoundInfo,
  useSessionContext,
  useSessionInfo,
} from "../../contexts/SessionContext";
import { saveSessionToStorage } from "../../utils/storage";

function RoundEndPrompt() {
  const { session, addNewRound, resetSession } = useSessionContext();
  const { changeScreen } = useScreenContext();
  const { closeModal } = useModalContext();

  const sessionInfo = useSessionInfo();
  const { players, rounds } = sessionInfo;
  const { player1Wins, player2Wins, draws } = sessionInfo;

  const [hasContinued, setHasContinued] = useState(false);
  function continueToNextRound() {
    setHasContinued(true);
    addNewRound();
    closeModal();
  }

  function stop() {
    saveSessionToStorage(session);

    closeModal();
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

function BoardCellButton(props: {
  cell: Cell;
  isWinning?: boolean;
  onClick: ComponentProps<"button">["onClick"];
}) {
  const { cell, onClick } = props;
  const { isWinning = false } = props;

  return (
    <button
      type="button"
      disabled={cell !== null}
      onClick={onClick}
      className={clsx("rounded-lg", isWinning ? "bg-green-700" : "bg-white")}
    >
      {cell === "x" && <span className="text-6xl font-bold">X</span>}
      {cell === "o" && <span className="text-6xl font-bold">O</span>}
    </button>
  );
}

export function GameScreen() {
  const { setCurrentRound } = useSessionContext();
  const { openModal, changeModalContent, makeModalCancellable } =
    useModalContext();

  const sessionInfo = useSessionInfo();
  const { players, rounds } = sessionInfo;
  const { player1Wins, player2Wins, draws } = sessionInfo;

  const { round } = sessionInfo;
  const { winningIndices, isRoundOver } = getRoundInfo(round);
  useEffect(() => {
    if (!isRoundOver) return;

    makeModalCancellable(false);
    changeModalContent(<RoundEndPrompt />);
    openModal();
  }, [isRoundOver, openModal, changeModalContent, makeModalCancellable]);

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
              isWinning={winningIndices?.includes(idx)}
              onClick={() => makeMove(idx)}
            />
          ))}
        </fieldset>
      </form>
    </article>
  );
}
