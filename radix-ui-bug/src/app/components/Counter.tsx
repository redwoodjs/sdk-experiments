"use client";
import React, { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div
      style={{ border: "1px solid grey", padding: "1rem", margin: "1rem 0" }}
    >
      <h2>Client Counter</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
};
