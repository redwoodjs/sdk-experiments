import { defineConfig } from "vite";
import { redwood } from "rwsdk/vite";

import { createRequire } from "node:module";

export default defineConfig({
  plugins: [redwood()],
  // workaround(justinvdm, 21-05-2025): At the moment, RedwoodSDK runs SSR and RSC renders in the
  // same runtime environment. We use the `react-server` import condition at dev/build time for this
  // environment. This means when SSR happens for a "use client" component, `client-only` will use the
  // the `react-server` import condition, whcih will cause it to throw an error about not being usable
  // in client environments. This will no longer be an issue once we have solved this:
  // https://github.com/redwoodjs/sdk/issues/449
  resolve: {
    alias: {
      "client-only": createRequire(import.meta.url).resolve("client-only"),
    },
  },
});
