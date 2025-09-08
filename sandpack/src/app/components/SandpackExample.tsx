"use client";
import { Sandpack } from "@codesandbox/sandpack-react";

export function SandpackExample() {
  return (
    <div style={{ margin: "20px 0" }}>
      <h2>Node.js Example (Nodebox)</h2>
      <Sandpack
        template="node"
        files={{
          "/index.js": `console.log('Hello from Node.js!');
            
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js server!');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
        }}
        options={{
          showNavigator: false,
          showTabs: false,
          editorHeight: 300,
          showConsole: true,
        }}
      />
    </div>
  );
}
