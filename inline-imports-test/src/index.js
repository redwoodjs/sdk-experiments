console.log("🚀 MAIN: Starting inline imports test");

// Test 1: Top-level dynamic import (executes immediately)
console.log("📍 TEST 1: Top-level dynamic import");
const topLevelImport = import("./safe-module.js");

// Test 2: Dynamic import inside a function (executes when called)
console.log("📍 TEST 2: Function-wrapped dynamic import");
async function loadDangerousModule() {
  console.log("🔄 MAIN: About to dynamically import dangerous module...");
  const module = await import("./dangerous-module.js");
  console.log("🔄 MAIN: Dangerous module loaded successfully");
  return module;
}

// Test 3: Dynamic import inside another function (safe module)
async function loadSafeModule() {
  console.log("🔄 MAIN: About to dynamically import safe module...");
  const module = await import("./safe-module.js");
  console.log("🔄 MAIN: Safe module loaded successfully");
  return module;
}

// Test 4: Conditional dynamic import
async function conditionalLoad(loadDangerous = false) {
  if (loadDangerous) {
    console.log("🔄 MAIN: Conditionally loading dangerous module...");
    return await import("./dangerous-module.js");
  } else {
    console.log("🔄 MAIN: Conditionally loading safe module...");
    return await import("./safe-module.js");
  }
}

// Export the functions so we can test them
export { loadDangerousModule, loadSafeModule, conditionalLoad, topLevelImport };

console.log("🚀 MAIN: Module definition complete");

// Let's also test what happens when we actually call these functions at the top level
console.log("📍 TEST: Calling loadSafeModule at top level...");
loadSafeModule()
  .then(() => {
    console.log("✅ MAIN: loadSafeModule completed successfully");
  })
  .catch((error) => {
    console.error("❌ MAIN: loadSafeModule failed:", error.message);
  });

console.log("📍 TEST: Calling conditionalLoad(false) at top level...");
conditionalLoad(false)
  .then(() => {
    console.log("✅ MAIN: conditionalLoad(false) completed successfully");
  })
  .catch((error) => {
    console.error("❌ MAIN: conditionalLoad(false) failed:", error.message);
  });

// This is the dangerous test - let's see what happens
console.log("📍 TEST: Calling loadDangerousModule at top level...");
loadDangerousModule()
  .then(() => {
    console.log("✅ MAIN: loadDangerousModule completed successfully");
  })
  .catch((error) => {
    console.error("❌ MAIN: loadDangerousModule failed:", error.message);
  });

console.log("🚀 MAIN: All async calls initiated");
