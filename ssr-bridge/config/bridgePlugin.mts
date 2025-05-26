import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Plugin, ViteDevServer } from "vite";
import { InlineConfig } from "vite";

export default function bridgePlugin(): InlineConfig["plugins"] {
  let devServer: ViteDevServer;
  let isDev = false;

  const ssrBridgePlugin: Plugin = {
    name: "ss-rsr-bridge",
    configureServer(server) {
      devServer = server;
    },
    config(_, { command, isPreview }) {
      isDev = !isPreview && command === "serve";
    },
    async resolveId(id) {
      if (id === "virtual:ssrBridge.js") {
        return "virtual:ssrBridge.js";
      }
    },
    async load(id) {
      console.log("################## load", id, this.environment.name);
      if (id === "virtual:ssrBridge.js") {
        if (isDev) {
          await devServer?.environments.ssr.warmupRequest("/src/ssrBridge.ts");
          const result = await devServer?.environments.ssr.fetchModule(
            "/src/ssrBridge.ts"
          );

          const code = "code" in result ? result.code : undefined;
          console.log(
            `################## reached load() virtual:ssrBridge in environment ${this.environment.name}, fetched as code:`
          );
          console.log(code);

          return code;
        }
      }
    },
  };

  return ssrBridgePlugin;
}
