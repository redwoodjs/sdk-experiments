import { defineConfig } from "vite";
import { redwood } from "rwsdk/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    cloudflare({
      viteEnvironment: { name: "worker" },
    }),
    redwood({
      entry: {
        client: ["src/client1.tsx", "src/client2.tsx"],
      },
    }),
  ],
});
