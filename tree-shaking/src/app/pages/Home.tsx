"use client";

import { complexOperation } from "dummy-tree-shake-test";

export function Home() {
  console.log(complexOperation("Hello", 10));
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
