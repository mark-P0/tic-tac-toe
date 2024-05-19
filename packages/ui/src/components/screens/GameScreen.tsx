import { useScreenContext } from "../../contexts/ScreenContext";
import { useSessionContext } from "../../contexts/SessionContext";

export function GameScreen() {
  const { changeScreen } = useScreenContext();
  const { session } = useSessionContext();

  return (
    <article>
      <button onClick={() => changeScreen("home")}>Go to home screen</button>

      <pre>{JSON.stringify(session, undefined, 2)}</pre>
    </article>
  );
}
