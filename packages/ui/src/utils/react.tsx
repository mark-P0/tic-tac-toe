import { PropsWithChildren, createContext, useContext } from "react";
import { raise } from "utils/errors";

export function createNewContext<T>(useContextValue: () => T) {
  const NewContext = createContext<T | null>(null);

  function useNewContext(): T {
    const values =
      useContext(NewContext) ?? raise("Context possibly not provided");
    return values;
  }

  function NewContextProvider(props: PropsWithChildren) {
    const { children } = props;
    const value = useContextValue();
    return <NewContext.Provider value={value}>{children}</NewContext.Provider>;
  }

  return [useNewContext, NewContextProvider] as const;
}
