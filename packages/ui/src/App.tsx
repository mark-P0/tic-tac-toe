import { Modal } from "./components/Modal";
import { HomeScreen } from "./components/screens/HomeScreen";
import { ModalProvider } from "./contexts/ModalContext";
import { ScreenProvider, useScreenContext } from "./contexts/ScreenContext";
import { SessionProvider, useSessionContext } from "./contexts/SessionContext";

function GameScreen() {
  const { changeScreen } = useScreenContext();
  const { session } = useSessionContext();

  return (
    <article>
      <button onClick={() => changeScreen("home")}>Go to home screen</button>

      <pre>{JSON.stringify(session, undefined, 2)}</pre>
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

  return (
    <>
      {screen}
      <Modal />
    </>
  );
}
export function App() {
  return (
    <SessionProvider>
      <ScreenProvider>
        <ModalProvider>
          <_App />
        </ModalProvider>
      </ScreenProvider>
    </SessionProvider>
  );
}
