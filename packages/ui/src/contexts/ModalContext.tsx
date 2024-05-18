import { useCallback, useState } from "react";
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

  return {
    ...{ status, openModal, closeModal, forceOpenModal, forceCloseModal },
  };
});
