import { ReactNode, useCallback, useState } from "react";
import { createNewContext } from "../utils/react";

export const [useModalContext, ModalProvider] = createNewContext(() => {
  const [status, setStatus] = useState<
    "opening" | "opened" | "closing" | "closed"
  >("closed");
  const openModal = useCallback(() => {
    setStatus("opening");
  }, []);
  const closeModal = useCallback(() => {
    setStatus("closing");
  }, []);
  const forceOpenModal = useCallback(() => {
    setStatus("opened");
  }, []);
  const forceCloseModal = useCallback(() => {
    setStatus("closed");
  }, []);

  const [content, setContent] = useState<ReactNode>(null);
  const changeModalContent = useCallback((to: ReactNode) => {
    setContent(to);
  }, []);

  const [isCancellable, setIsCancellable] = useState(true);
  const makeModalCancellable = useCallback((condition: boolean) => {
    setIsCancellable(condition);
  }, []);

  return {
    ...{ status, openModal, closeModal, forceOpenModal, forceCloseModal },
    ...{ content, changeModalContent },
    ...{ isCancellable, makeModalCancellable },
  };
});
