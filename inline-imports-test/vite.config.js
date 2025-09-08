import { defineConfig } from "vite";

// Standard Vite config - dynamic imports stay as separate chunks
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [],
    },
  },
});
