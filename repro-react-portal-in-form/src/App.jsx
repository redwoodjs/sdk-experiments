import { useState } from "react";
import { createPortal } from "react-dom";

function App() {
  const [showPortal, setShowPortal] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <form>
      <h1>React Portal in Form Bug</h1>
      <p>This is a minimal, client-side only React application.</p>
      <hr />
      <button type="button" onClick={() => setShowPortal(true)}>
        Show Portal
      </button>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Count: {count}
      </button>
      {showPortal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              border: "1px solid red",
              padding: "20px",
              backgroundColor: "white",
            }}
          >
            <h2>This is a portal!</h2>
            <p>
              If the counter on the main page is frozen, the bug is present.
            </p>
          </div>,
          document.body
        )}
    </form>
  );
}

export default App;
