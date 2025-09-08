import { defineConfig } from "vite";

// Inline dynamic imports config - everything gets inlined
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [],
      output: {
        inlineDynamicImports: true,
      },
      treeshake: {
        moduleSideEffects(id) {
          return !id.includes("dangerous-module.js");
        },
      },
    },
  },
});
