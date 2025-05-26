import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin, ViteDevServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT_DIR = path.resolve(__dirname, "..");

const DIST_SSR_BRIDGE_PATH = path.resolve(
  ROOT_DIR,
  "dist",
  "ssr",
  "ssrBridge.js"
);

export default function bridgePlugin(): Plugin {
  let devServer: ViteDevServer;
  let isDev = false;

  const ssrBridgePlugin: Plugin = {
    name: "ss-rsr-bridge",
    configureServer(server) {
      devServer = server;
    },
    config(config, { command, isPreview }) {
      isDev = !isPreview && command === "serve";

      config.builder = {
        buildApp: async (builder) => {
          console.log("################## in builder.buildApp");
          await builder.build(builder.environments["ssr"]!);
          await builder.build(builder.environments["rsc"]!);
        },
      };
    },
    configEnvironment(env, config) {
      if (env === "ssr") {
        config.build ??= {};
        config.build.ssr = true;
        config.build.lib = {
          ...config.build.lib,
          entry: "src/ssrBridge.ts",
          formats: ["es"],
          fileName: "ssrBridge.js",
        };
        config.build.outDir = "dist/ssr";
      }
    },
    async resolveId(id) {
      if (id === "virtual:ssrBridge.js") {
        // context(justinvdm, 26 May 2025): In dev, we want to dynamically load the bridge
        // via the SSR environment. In build, we want to use the already built bridge.
        if (isDev) {
          return "virtual:ssrBridge.js";
        } else {
          console.log(
            "################## reached load() virtual:ssrBridge for build in environment",
            this.environment.name
          );
          return DIST_SSR_BRIDGE_PATH;
        }
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
