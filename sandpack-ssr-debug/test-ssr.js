#!/usr/bin/env node

import { existsSync } from "fs";

console.log("🧪 Testing SSR with Sandpack...\n");

try {
  // Test if the SSR build exists
  if (!existsSync("./dist/entry-server.js")) {
    console.log("❌ SSR build not found. Run: npm run build:all");
    process.exit(1);
  }

  console.log("✅ SSR build found");
  console.log("🔍 Testing SSR render...\n");

  // Import and test the SSR render function
  const { render } = await import("./dist/entry-server.js");
  const result = render();

  console.log("✅ SSR render successful!");
  console.log("📄 Rendered HTML preview:");
  console.log(result.html.substring(0, 200) + "...\n");

  console.log("🎉 No window reference errors in SSR!");
  console.log("💡 To test the full app: vite preview");
} catch (error) {
  console.log("❌ SSR Error:", error.message);

  if (error.message.includes("window is not defined")) {
    console.log("\n🔍 Window reference detected! This confirms the issue.");
    console.log("📍 Location: Likely in Sandpack's Nodebox code");
    console.log(
      "🛠️  Solution needed: Environment guards or build configuration"
    );
  }

  console.log("\n📊 Full error stack:");
  console.log(error.stack);
  process.exit(1);
}
