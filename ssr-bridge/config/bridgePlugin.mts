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
      console.log("################## resolveId", id);

      if (id.startsWith("virtual:ssr:") && isDev) {
        // context(justinvdm, 26 May 2025): In dev, we want to dynamically load the bridge
        // via the SSR environment. In build, we want to use the already built bridge.
        console.log(
          "################## reached resolveId() virtual:ssr: in dev for environment",
          this.environment.name,
          id
        );
        return id;
      }

      if (id === "virtual:ssr:/src/ssrBridge.ts" && !isDev) {
        console.log(
          "################## reached load() virtual:ssrBridge for build in environment",
          this.environment.name
        );
        return DIST_SSR_BRIDGE_PATH;
      }
    },
    async load(id) {
      console.log("################## load", id, this.environment.name);

      if (id.startsWith("virtual:ssr:")) {
        const realPath = id.slice("virtual:ssr:".length);

        if (isDev) {
          await devServer?.environments.ssr.warmupRequest(realPath);
          const result = await devServer?.environments.ssr.fetchModule(
            realPath
          );

          const code = "code" in result ? result.code : undefined;
          const transformedCode = `
;(async function(__vite_ssr_import__, __vite_ssr_dynamic_import__) {
${code}
})(
  (id) => console.log('### runtime import for %s', id) || __vite_ssr_import__('/@id/virtual:ssr:'+id),
  (id) => console.log('### runtime dynamic import for %s', id) || __vite_ssr_dynamic_import__('/@id/virtual:ssr:'+id),
);
`;
          console.log(
            `################## reached load() ssr virtual path ${realPath} in environment ${this.environment.name}, fetched and transformed code:`
          );

          console.log(transformedCode);

          return transformedCode;
        }
      }
    },
  };

  return ssrBridgePlugin;
}
