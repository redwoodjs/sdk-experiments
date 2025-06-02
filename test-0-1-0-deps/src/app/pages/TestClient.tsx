"use client";
import "test-dep-client-only";
import { TestDepDualClientComponent } from "test-dep-dual";

export function TestClient() {
  return (
    <>
      <div>TestClient</div>
      <div>
        Used from another client component: [start]
        <TestDepDualClientComponent isClientRoot={false} />
        [end]
      </div>
    </>
  );
}
