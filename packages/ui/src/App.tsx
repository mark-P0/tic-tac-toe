import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount((count) => count + 1)}
      className="bg-neutral-500 p-3 rounded-lg"
    >
      count is {count}
    </button>
  );
}
