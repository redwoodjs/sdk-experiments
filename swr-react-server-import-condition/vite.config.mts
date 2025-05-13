import { defineConfig } from "vite";
import { redwood } from "rwsdk/vite";

export default defineConfig({
  resolve: {
    alias: {
      swr: import.meta.resolve("swr"),
    },
  },
  plugins: [redwood()],
});
