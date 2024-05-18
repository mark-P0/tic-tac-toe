import { useModalContext } from "../../contexts/ModalContext";

function SessionPrompt() {
  return (
    <form className="h-screen w-screen bg-stone-400 flex flex-col justify-center gap-24">
      <header className="grid place-items-center">
        <h2 className="text-3xl">What should I call you?</h2>
      </header>

      <div className="flex items-center justify-center gap-36">
        <section className="grid place-items-center gap-3">
          <h3 className="text-2xl font-bold">Player 1</h3>
          <input type="text" className="px-2 py-1 rounded-lg" />
        </section>

        <div className="text-xl">vs</div>

        <section className="grid place-items-center gap-3">
          <h3 className="text-2xl font-bold">Player 2</h3>
          <input type="text" className="px-2 py-1 rounded-lg" />
        </section>
      </div>

      <footer className="flex flex-col justify-center items-center gap-3">
        <button
          type="button"
          className="bg-white p-3 rounded-lg text-xl font-bold"
        >
          Start!
        </button>
        <button
          type="button"
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
