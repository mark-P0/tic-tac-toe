import { Modal } from "./components/Modal";
import { ModalProvider, useModalContext } from "./contexts/ModalContext";
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
  const { openModal } = useModalContext();

  function showSampleModal() {
    openModal();
  }

  return (
    <article>
      <pre>HomeScreen</pre>

      <div className="grid gap-2">
        <button onClick={() => changeScreen("game")}>Go to game screen</button>
        <button onClick={showSampleModal}>Open modal</button>
      </div>
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
    <ScreenProvider>
      <ModalProvider>
        <_App />
      </ModalProvider>
    </ScreenProvider>
  );
}
