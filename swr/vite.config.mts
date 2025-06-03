import { defineConfig } from "vite";
import { redwood } from "rwsdk/vite";

export default defineConfig({
  resolve: {
    alias: {},
  },
  plugins: [redwood()],
});
