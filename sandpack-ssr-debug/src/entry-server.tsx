import { renderToString } from "react-dom/server";
import App from "./App";

// Polyfill browser globals to get past initial errors and reach the window reference
global.self = global;
if (!global.navigator) {
  Object.defineProperty(global, "navigator", {
    value: { userAgent: "node" },
    writable: true,
  });
}
global.document = {};

export function render() {
  const html = renderToString(<App />);
  return { html };
}
