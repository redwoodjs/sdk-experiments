import type { Plugin, ViteDevServer } from "vite";

export default function bridgePlugin(): Plugin {
  let devServer: ViteDevServer;
  return {
    name: "ss-rsr-bridge",
    configureServer(server) {
      devServer = server;
    },
    load(id) {
      if (id.startsWith("ssr:")) {
        return devServer?.environments.ssr.fetchModule(id.slice("ssr:".length));
      }
    },
  };
}
