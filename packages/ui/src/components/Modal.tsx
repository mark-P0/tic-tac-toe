import { raise } from "@tic-tac-toe/utils/errors";
import clsx from "clsx";
import { SyntheticEvent, useEffect, useRef } from "react";
import { useModalContext } from "../contexts/ModalContext";

export function Modal() {
  const attributes = useModalContext();
  const { status, closeModal, forceOpenModal, forceCloseModal } = attributes;
  const { content } = attributes;
  const { isCancellable } = attributes;

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    if (status === "closed") return;

    const dialog =
      dialogRef.current ?? raise("Referenced dialog does not exist...?");
    dialog.showModal();

    if (status === "opening") {
      forceOpenModal();
    }
  }, [status, forceOpenModal]);

  function handleTransitionEnd() {
    if (status === "closing") forceCloseModal();
  }
  function handleCancel(event: SyntheticEvent) {
    /** Prevent immediate dialog dismiss e.g. via `Esc` */
    event.preventDefault();

    if (!isCancellable) return;

    closeModal();
  }

  if (status === "closed") {
    return null;
  }

  const isTransitioning = status === "opening" || status === "closing";
  return (
    <dialog
      ref={dialogRef}
      onTransitionEnd={handleTransitionEnd}
      onCancel={handleCancel}
      className={clsx(
        "max-w-full max-h-full", // Reset pre-applied dialog styles not reset by Tailwind
        "transition duration-300",
        "backdrop:transition backdrop:duration-300",
        isTransitioning && "-translate-y-full opacity-0",
        isTransitioning && "backdrop:-translate-y-full backdrop:opacity-0"
      )}
    >
      {content}
    </dialog>
  );
}
