"use client";

export const SomeClientComponent = () => {
  const onClick = async () => {
    const moment = (
      import.meta.env.SSR ? {} : (await import("moment")).default
    ) as typeof import("moment");

    console.log("#######", moment.now());
  };
  return <button onClick={onClick}>Click me</button>;
};
