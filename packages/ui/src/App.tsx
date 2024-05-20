import { Modal } from "./components/Modal";
import { GameScreen } from "./components/screens/GameScreen";
import { HomeScreen } from "./components/screens/HomeScreen";
import { BackgroundSyncProvider } from "./contexts/BackgroundSyncContext";
import { ModalProvider } from "./contexts/ModalContext";
import { ScreenProvider, useScreenContext } from "./contexts/ScreenContext";
import { SessionProvider, useSessionContext } from "./contexts/SessionContext";

function useCurrentScreen() {
  const { session } = useSessionContext();
  const { screen } = useScreenContext();

  if (screen === "game") {
    return <GameScreen key={session.rounds.length} />;
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
          <BackgroundSyncProvider>
            <_App />
          </BackgroundSyncProvider>
        </ModalProvider>
      </ScreenProvider>
    </SessionProvider>
  );
}
