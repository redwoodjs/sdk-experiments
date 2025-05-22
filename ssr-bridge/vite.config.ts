import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  environments: {
    ssr: {},
    rsc: {},
  },
  plugins: [
    cloudflare({
      viteEnvironment: {
        name: "rsc",
      },
    }),
    //cloudflare({
    //  viteEnvironment: {
    //    name: "ssr",
    //  },
    //}),
  ],
});
