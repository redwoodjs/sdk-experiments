"use client";

export const SomeClientComponent = () => {
  const onClick = async () => {
    const lodash = (
      import.meta.env.SSR ? {} : await import("lodash")
    ) as typeof import("lodash");

    console.log("#######", lodash.assignWith);
  };
  return <button onClick={onClick}>Click me</button>;
};
