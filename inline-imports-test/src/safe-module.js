// This module is safe - no top-level window access
console.log("✅ SAFE MODULE: Loading without window access");

export function safeFunction() {
  console.log("✅ SAFE FUNCTION: Called successfully");
  return "safe-result";
}

export function conditionalWindowAccess() {
  if (typeof window !== "undefined") {
    console.log("✅ SAFE FUNCTION: Window available, accessing localStorage");
    return window.localStorage.getItem("TEST_FLAG");
  } else {
    console.log("✅ SAFE FUNCTION: No window, returning fallback");
    return "fallback-value";
  }
}

export default {
  safeFunction,
  conditionalWindowAccess,
};
