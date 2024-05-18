import { useCallback, useState } from "react";
import { createNewContext } from "../utils/react";

export const [useScreenContext, ScreenProvider] = createNewContext(() => {
  type Screen = "home" | "game";
  const [screen, setScreen] = useState<Screen>("home");
  const changeScreen = useCallback((to: Screen) => {
    setScreen(to);
  }, []);

  return { screen, changeScreen };
});
