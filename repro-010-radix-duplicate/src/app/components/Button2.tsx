"use client";

import { Root as SlotRoot } from "@radix-ui/react-slot";

export function Button2({
  asChild,
  ...props
}: {
  asChild: boolean;
  [key: string]: any;
}) {
  const Comp = asChild ? SlotRoot : "button";
  return <Comp {...props} />;
}
