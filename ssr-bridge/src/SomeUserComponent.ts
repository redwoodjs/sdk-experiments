"use client";
import { DepCClientComponent } from "test-dep-dual";

export function test() {
  DepCClientComponent();
  console.log(
    "================================================== In SomeUserComponent test() for SSR!!! ================================================================"
  );
}
