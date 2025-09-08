import express from "express";
import { createServer as createViteServer } from "vite";

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      let template = await vite.transformIndexHtml(
        url,
        `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandpack SSR Debug</title>
  </head>
  <body>
    <div id="root"><!--ssr-outlet--></div>
    <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>
      `
      );

      // 2. Load the server entry
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");

      // 3. Render the app HTML
      const { html: appHtml } = await render(url);

      // 4. Inject the app-rendered HTML into the template
      const html = template.replace("<!--ssr-outlet-->", appHtml);

      // 5. Send the rendered HTML back
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back to
      // your actual source code.
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

createServer();
