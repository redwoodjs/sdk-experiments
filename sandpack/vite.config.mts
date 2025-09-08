import { defineConfig } from "vite";
import { redwood } from "rwsdk/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    cloudflare({
      viteEnvironment: { name: "worker" },
    }),
    redwood(),
    {
      name: "ensure-chunks",
      config: () => ({
        environments: {
          worker: {
            build: {
              rollupOptions: {
                output: {
                  inlineDynamicImports: false,
                },
              },
            },
          },
          ssr: {
            build: {
              rollupOptions: {
                output: {
                  inlineDynamicImports: false,
                },
              },
            },
          },
        },
      }),
    },
  ],
});
