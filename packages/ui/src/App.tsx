import { Modal } from "./components/Modal";
import { GameScreen } from "./components/screens/GameScreen";
import { HomeScreen } from "./components/screens/HomeScreen";
import { ModalProvider } from "./contexts/ModalContext";
import { ScreenProvider, useScreenContext } from "./contexts/ScreenContext";
import { SessionProvider } from "./contexts/SessionContext";

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
