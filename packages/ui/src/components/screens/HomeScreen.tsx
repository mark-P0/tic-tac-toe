export function HomeScreen() {
  return (
    <article className="bg-stone-400 h-screen grid grid-rows-[1fr_3fr]">
      <header className="grid place-items-center">
        <h1 className="text-3xl">
          Welcome to <span className="font-bold">Tic-Tac-Toe!</span>
        </h1>
      </header>

      <div className="grid place-items-center">
        <button className="h-1/2 aspect-square p-6 rounded-lg border-dashed border-2 border-black/25 text-black/50">
          <div className="text-6xl font-bold">+</div>
          <div className="text-xl">Start New Game</div>
        </button>
      </div>
    </article>
  );
}
