"use client";

import { Slot } from "radix-ui";

export function Button({
  asChild,
  ...props
}: {
  asChild: boolean;
  [key: string]: any;
}) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp {...props} />;
}
