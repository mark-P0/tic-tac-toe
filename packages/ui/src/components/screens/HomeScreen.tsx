import clsx from "clsx";
import { format } from "date-fns";
import { useState } from "react";
import { useModalContext } from "../../contexts/ModalContext";
import { useScreenContext } from "../../contexts/ScreenContext";
import {
  Round,
  Session,
  getRoundInfo,
  getSessionInfo,
  useSessionContext,
} from "../../contexts/SessionContext";
import { getSessionsFromStorage } from "../../utils/storage";

function SessionPrompt() {
  const { setSessionPlayers, addNewRound } = useSessionContext();
  const { changeScreen } = useScreenContext();
  const { closeModal } = useModalContext();
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  function start() {
    setSessionPlayers([player1, player2]);
    addNewRound();

    changeScreen("game");
    closeModal();
  }
  function cancel() {
    closeModal();
  }

  const canStart = player1 !== "" && player2 !== "";

  return (
    <form className="h-screen w-screen bg-stone-400 flex flex-col justify-center gap-24">
      <header className="grid place-items-center">
        <h2 className="text-3xl">What should I call you?</h2>
      </header>

      <div className="flex items-center justify-center gap-36">
        <section className="grid place-items-center gap-3">
          <h3 className="text-2xl font-bold">Player 1</h3>
          <input
            type="text"
            value={player1}
            onChange={(event) => setPlayer1(event.target.value)}
            className="px-2 py-1 rounded-lg"
          />
        </section>

        <div className="text-xl">vs</div>

        <section className="grid place-items-center gap-3">
          <h3 className="text-2xl font-bold">Player 2</h3>
          <input
            type="text"
            value={player2}
            onChange={(event) => setPlayer2(event.target.value)}
            className="px-2 py-1 rounded-lg"
          />
        </section>
      </div>

      <footer className="flex flex-col justify-center items-center gap-3">
        <button
          type="button"
          disabled={!canStart}
          onClick={start}
          className="bg-white p-3 rounded-lg text-xl font-bold transition disabled:opacity-50"
        >
          Start
        </button>
        <button
          type="button"
          onClick={cancel}
          className="p-3 rounded-lg hover:underline underline-offset-2"
        >
          Cancel
        </button>
      </footer>
    </form>
  );
}

function formatSessionTimestamp(timestampMs: number) {
  const date = new Date(timestampMs);

  const DD_MMM_YYYY__hh_mm_ap = "d LLL y, hh:mm aaa";
  return format(date, DD_MMM_YYYY__hh_mm_ap);
}

function RoundDisplay(props: { round: Round }) {
  const { round } = props;
  const { board } = round;
  const { winningIndices } = getRoundInfo(round);

  return (
    <section className="aspect-square h-full">
      <ol className="grid grid-cols-3 grid-rows-3 gap-3">
        {board.map((cell, idx) => (
          <li
            key={idx}
            className={clsx(
              "aspect-square grid place-items-center rounded-lg opacity-75",
              winningIndices?.includes(idx)
                ? "bg-green-700 text-white"
                : "bg-white"
            )}
          >
            {cell === "x" && <span className="text--xl">X</span>}
            {cell === "o" && <span className="text--xl">O</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

function SessionDisplay(props: { session: Session }) {
  const { session } = props;
  const sessionInfo = getSessionInfo(session);
  const { players, rounds } = sessionInfo;
  const { player1Wins, player2Wins, draws } = sessionInfo;

  const timestampStr = formatSessionTimestamp(session.timestampMs);

  return (
    <article className="bg-stone-400 h-[33vh] p-6 overflow-x-scroll">
      <ol className="h-full w-fit flex gap-12">
        <li>
          <section className="aspect-square h-full flex flex-col justify-center items-center gap-3">
            <p className="text-sm text-black/50">{timestampStr}</p>
            <div className="grid grid-cols-3 items-center gap-3">
              <div>
                <div className="font-bold text-xl">{players[0]}</div>
                <div>{player1Wins}</div>
              </div>
              <div className="text-center">
                <div>vs</div>
                <div className="text-sm text-black/50">Draws: {draws}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">{players[1]}</div>
                <div>{player2Wins}</div>
              </div>
            </div>
          </section>
        </li>

        {rounds.map((round, idx) => (
          <li key={idx}>
            <RoundDisplay round={round} />
          </li>
        ))}
      </ol>
    </article>
  );
}

export function HomeScreen() {
  const { openModal, changeModalContent } = useModalContext();

  // TODO Fetch from remote database
  const sessions = getSessionsFromStorage();

  function showSessionPrompt() {
    changeModalContent(<SessionPrompt />);
    openModal();
  }

  return (
    <article className="bg-stone-300 h-screen w-screen overflow-clip overflow-y-auto">
      <header className="h-[50vh] flex flex-col justify-center items-center gap-6">
        <h1 className="text-3xl">
          Welcome to <span className="font-bold">Tic-Tac-Toe!</span>
        </h1>

        <button
          onClick={showSessionPrompt}
          className="bg-white p-3 rounded-lg text-xl font-bold transition disabled:opacity-50"
        >
          Start New Game
        </button>
      </header>

      <ol className="grid gap-3">
        {sessions.map((session, idx) => (
          <li key={idx} className="grid">
            <SessionDisplay session={session} />
          </li>
        ))}
      </ol>
    </article>
  );
}
