import React, { Suspense } from "react";
import { Counter } from "../components/Counter.js";
import { SuspendedComponent } from "../components/SuspendedComponent.js";

const SuspenseTestPage = () => {
  return (
    <div>
      <h1>Suspense and Interactivity Test</h1>
      <p>
        The counter below should be interactive immediately, even while the
        content below is loading.
      </p>
      <Counter />
      <Suspense fallback={<div>Loading suspended content...</div>}>
        <SuspendedComponent />
      </Suspense>
    </div>
  );
};

export default SuspenseTestPage;
