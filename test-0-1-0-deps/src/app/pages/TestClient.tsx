"use client";
import "test-dep-client-only";
import { TestDepDualClientComponent } from "test-dep-dual";

export function TestClient() {
  return (
    <>
      <div>TestClient</div>
      <div>
        <div>Used from another client component:</div>
        <TestDepDualClientComponent />
      </div>
    </>
  );
}
