import "virtual:vite-preamble";
import { hydrate } from "rwsdk/app";

console.log("[RSDK] client.tsx execution start");
console.log("[RSDK] DOM state:", {
  root: document.getElementById("root"),
  reactStateScript: document.getElementById("_R_"),
  bodyContent: document.body.innerHTML,
});

hydrate();
