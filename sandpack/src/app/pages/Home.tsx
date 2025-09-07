"use client";
import { RequestInfo } from "rwsdk/worker";
import { SandpackExample } from "../components/SandpackExample";

export function Home({ ctx }: RequestInfo) {
  if (!import.meta.env.VITE_IS_DEV_SERVER) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Sandpack Demo</h1>
        <p>This is a basic Sandpack example running in production mode.</p>
        <SandpackExample />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sandpack Demo - Development Mode</h1>
      <p>Try editing the code below to see live updates!</p>
      <SandpackExample />
    </div>
  );
}
