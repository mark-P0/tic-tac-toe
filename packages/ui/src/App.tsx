import { ScreenProvider, useScreenContext } from "./contexts/ScreenContext";

function GameScreen() {
  const { changeScreen } = useScreenContext();

  return (
    <article>
      <pre>GameScreen</pre>
      <button onClick={() => changeScreen("home")}>Go to home screen</button>
    </article>
  );
}

function HomeScreen() {
  const { changeScreen } = useScreenContext();

  return (
    <article>
      <pre>HomeScreen</pre>
      <button onClick={() => changeScreen("game")}>Go to game screen</button>
    </article>
  );
}

function useCurrentScreen() {
  const { screen } = useScreenContext();

  if (screen === "game") {
    return <GameScreen />;
  }
  if (screen === "home") {
    return <HomeScreen />;
  }

  screen satisfies never;
  return screen;
}
function _App() {
  const screen = useCurrentScreen();

  return <>{screen}</>;
}
export function App() {
  return (
    <ScreenProvider>
      <_App />
    </ScreenProvider>
  );
}
