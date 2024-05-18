import { useState } from "react";
import { useModalContext } from "../../contexts/ModalContext";
import { useScreenContext } from "../../contexts/ScreenContext";
import { useSessionContext } from "../../contexts/SessionContext";

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

export function HomeScreen() {
  const { openModal, changeModalContent } = useModalContext();

  function showSessionPrompt() {
    changeModalContent(<SessionPrompt />);
    openModal();
  }

  return (
    <article className="bg-stone-300 h-screen grid grid-rows-[1fr_3fr]">
      <header className="grid place-items-center">
        <h1 className="text-3xl">
          Welcome to <span className="font-bold">Tic-Tac-Toe!</span>
        </h1>
      </header>

      <div className="grid place-items-center">
        <button
          onClick={showSessionPrompt}
          className="h-1/2 aspect-square p-6 rounded-lg border-dashed border-2 border-black/25 text-black/50"
        >
          <div className="text-6xl font-bold">+</div>
          <div className="text-xl">Start New Game</div>
        </button>
      </div>
    </article>
  );
}
