import { Round, Session, zSession } from "@tic-tac-toe/schemas";
import clsx from "clsx";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useBackgroundSyncContext } from "../../contexts/BackgroundSyncContext";
import { useModalContext } from "../../contexts/ModalContext";
import { getRoundInfo, getSessionInfo } from "../../contexts/SessionContext";
import { env } from "../../utils/env";
import { LoadingPing } from "../Loading";
import { SessionPrompt } from "../prompts/SessionPrompt";

function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;

  let valueAsStr = "[Value cannot be stringified]";
  try {
    valueAsStr = JSON.stringify(value);
  } catch {
    null;
  }

  return new Error(`Error of value: ${valueAsStr}`);
}

type Query<T> =
  | {
      status: "pending";
    }
  | {
      status: "error";
      error: Error;
    }
  | {
      status: "completed";
      value: T;
    };
function useQuery<T>(producer: () => Promise<T>) {
  const [query, setQuery] = useState<Query<T>>({ status: "pending" });
  useEffect(() => {
    (async () => {
      setQuery({ status: "pending" });
      try {
        const value = await producer();
        setQuery({ status: "completed", value });
      } catch (caughtError) {
        const error = ensureError(caughtError);
        setQuery({ status: "error", error });
      }
    })();
  }, [producer]);

  return [query];
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
        <li className="h-full">
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
          <li key={idx} className="h-full">
            <RoundDisplay round={round} />
          </li>
        ))}
      </ol>
    </article>
  );
}

async function fetchSessions() {
  const url = new URL("/api/v0/sessions", env.VITE_API_BASE_URL);
  const res = await fetch(url);
  const json = await res.json();

  const sessions = zSession.array().parse(json);

  return sessions;
}
function SessionsList() {
  const [query] = useQuery(fetchSessions);

  if (query.status === "pending") {
    return (
      <div className="grid place-items-center">
        <LoadingPing />
      </div>
    );
  }

  if (query.status === "error") {
    console.error(query.error);
    return (
      <p className="text-center">
        <span className="text-sm text-black/50 italic">
          Oops! I had some problems remembering the previous games...
        </span>
        <br />
        <span className="font-bold">But you can still play!</span>
      </p>
    );
  }

  query.status satisfies "completed";
  const sessions = query.value;

  if (sessions.length === 0) {
    return (
      <p className="text-center text-black/50">Be the first ones to play!</p>
    );
  }

  return (
    <ol className="grid gap-3">
      {sessions.map((session, idx) => (
        <li key={idx} className="grid">
          <SessionDisplay session={session} />
        </li>
      ))}
    </ol>
  );
}

export function HomeScreen() {
  const { openModal, changeModalContent } = useModalContext();
  const { syncCt } = useBackgroundSyncContext();

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

      <SessionsList key={syncCt} />
    </article>
  );
}
