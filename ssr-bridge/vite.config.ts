import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import bridgePlugin from "./config/bridgePlugin.mts";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  environments: {
    ssr: {},
    rsc: {
      resolve: {
        conditions: ["react-server"],
      },
    },
  },
  plugins: [
    cloudflare({
      configPath: path.resolve(__dirname, "config", "ssrDevWrangler.jsonc"),
      viteEnvironment: {
        name: "ssr",
      },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
      },
    }),
    bridgePlugin(),
  ],
});
