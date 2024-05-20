import clsx from "clsx";
import { ComponentProps, useEffect, useState } from "react";
import { Cell, Player } from "schemas";
import { useModalContext } from "../../contexts/ModalContext";
import {
  getRoundInfo,
  getSessionInfo,
  useSessionContext,
} from "../../contexts/SessionContext";
import { RoundEndPrompt } from "../prompts/RoundEndPrompt";

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
  const { session, setCurrentRound } = useSessionContext();
  const { openModal, changeModalContent, makeModalCancellable } =
    useModalContext();

  const sessionInfo = getSessionInfo(session);
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
