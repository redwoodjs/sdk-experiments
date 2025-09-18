import stylesUrl from "./styles.css?url";
export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>@redwoodjs/starter-minimal</title>
      <link rel="modulepreload" href="/src/client.tsx" />
      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon-dark.svg"
        media="(prefers-color-scheme: dark)"
      />
      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon-light.svg"
        media="(prefers-color-scheme: light)"
      />
      <link rel="stylesheet" href="/src/app/styles.css" />
    </head>
    <body>
      <div id="root">{children}</div>
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
);
