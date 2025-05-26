import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import bridgePlugin from "./config/bridgePlugin.mts";

export default defineConfig({
  environments: {
    ssr: {
      resolve: {
        noExternal: true,
      },
      optimizeDeps: {
        include: ["test-dep-a", "test-dep-b"],
      },
    },
    rsc: {
      resolve: {
        conditions: ["react-server"],
        noExternal: true,
      },
      optimizeDeps: {
        include: ["test-dep-a", "test-dep-b"],
      },
    },
  },
  plugins: [
    cloudflare({
      viteEnvironment: {
        name: "rsc",
      },
    }),
    bridgePlugin(),
  ],
});
