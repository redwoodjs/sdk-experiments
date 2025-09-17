"use client";

import { useId } from "react";

export function UseIdDemo() {
  const id1 = useId();
  const id2 = useId();

  // Log IDs to see the difference in browser console
  console.log("Client-side useId:", { id1, id2 });

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>useId Hydration Test</h1>
      <p style={{ marginBottom: "2rem", color: "#333" }}>
        This page tests `React.useId()` in a minimal client component to isolate
        the hydration mismatch issue from Radix UI.
      </p>
      <div
        id={id1}
        style={{
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem 0" }}>
          Component 1
        </h2>
        <p style={{ margin: 0 }}>
          The ID for this component is: <strong>{id1}</strong>
        </p>
      </div>
      <div
        id={id2}
        style={{
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem 0" }}>
          Component 2
        </h2>
        <p style={{ margin: 0 }}>
          The ID for this component is: <strong>{id2}</strong>
        </p>
      </div>
    </div>
  );
}
