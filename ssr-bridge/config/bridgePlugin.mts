import type { Plugin, ViteDevServer } from "vite";

export default function bridgePlugin(): Plugin {
  let devServer: ViteDevServer;
  return {
    name: "ss-rsr-bridge",
    configureServer(server) {
      devServer = server;
    },
    async resolveId(id) {
      if (id === "virtual:ssrBridge") {
        return "virtual:ssrBridge";
      }
    },
    async load(id) {
      if (id === "virtual:ssrBridge") {
        await devServer?.environments.ssr.warmupRequest("/src/ssrBridge.ts");
        const result = await devServer?.environments.ssr.fetchModule(
          "/src/ssrBridge.ts"
        );

        const code = "code" in result ? result.code : undefined;
        console.log(
          `################## reached load() virtual:ssrBridge in environment ${this.environment.name}, fetched as code:`,
          result
        );
        return code;
      }
    },
  };
}
