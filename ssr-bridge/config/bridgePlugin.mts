import type { Plugin, ViteDevServer } from "vite";

export default function bridgePlugin(): Plugin {
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
    transform(code, id) {
      if (id === "virtual:ssrBridge.js" && this.environment.name === "rsc") {
        console.log(
          "###### correctly received ssr bridge code in rsc environment transform hook!"
        );
        console.log(code);
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
