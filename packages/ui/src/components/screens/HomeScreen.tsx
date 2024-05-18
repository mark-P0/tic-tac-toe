import { useModalContext } from "../../contexts/ModalContext";
import { useScreenContext } from "../../contexts/ScreenContext";

export function HomeScreen() {
  const { changeScreen } = useScreenContext();
  const { openModal, changeModalContent, closeModal, makeModalCancellable } =
    useModalContext();

  function showSampleModal() {
    openModal();
    makeModalCancellable(false);
    changeModalContent(
      <div className="bg-red-500 h-screen w-screen">
        <div>Hello, world!</div>
        <button
          onClick={() => {
            closeModal();
            makeModalCancellable(true);
          }}
        >
          Close modal
        </button>
      </div>
    );
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
