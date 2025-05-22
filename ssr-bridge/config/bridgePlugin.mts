import type { Plugin, ViteDevServer } from "vite";

export default function bridgePlugin(): Plugin {
  let devServer: ViteDevServer;
  return {
    name: "ss-rsr-bridge",
    configureServer(server) {
      devServer = server;
    },
    async load(id) {
      if (id.startsWith("virtual:ssrBridge")) {
        const result = await devServer?.environments.ssr.fetchModule(
          id.slice("ssr:".length)
        );

        return "code" in result ? result.code : undefined;
      }
    },
  };
}
