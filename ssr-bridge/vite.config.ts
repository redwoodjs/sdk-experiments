import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import bridgePlugin from "./config/bridgePlugin.mts";

export default defineConfig({
  environments: {
    ssr: {},
    rsc: {},
  },
  plugins: [
    cloudflare({}),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
      },
    }),
    bridgePlugin(),
    //cloudflare({
    //  viteEnvironment: {
    //    name: "ssr",
    //  },
    //}),
  ],
});
