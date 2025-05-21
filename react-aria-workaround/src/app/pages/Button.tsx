"use client";
import { Button as BaseButton } from "react-aria-components";

export function Button() {
  return (
    <BaseButton onPress={() => alert("Hello world!")}>Press me</BaseButton>
  );
}
