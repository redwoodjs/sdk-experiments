"use client";
import { add } from "dummy-tree-shake-test";

export function Home() {
  console.log("############", add(1, 2));
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
