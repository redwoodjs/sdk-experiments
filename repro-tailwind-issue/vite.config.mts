import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";
import { redwood } from "rwsdk/vite";

export default defineConfig({
  plugins: [redwood(), tailwind()],
});
