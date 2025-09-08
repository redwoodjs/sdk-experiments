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
          // context(justinvdm, 8 Sep 2025): Workaround for the Sandpack SSR
          // issue. By setting `inlineDynamicImports: false`, we prevent
          // Vite/Rollup from hoisting the browser-only code from
          // `@codesandbox/nodebox` into the main server bundle. This keeps the
          // problematic code (with `window` references) in separate chunks that
          // are not evaluated during server-side rendering, avoiding the crash.
          // The long-term solution is for Sandpack to provide an SSR-friendly
          // build.
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
