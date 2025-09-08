// This module simulates the problematic Sandpack code
console.log("🔥 DANGEROUS MODULE: About to access window at TOP LEVEL");

// This line simulates the problematic window access that crashes SSR
const FLAG = window.localStorage.getItem("TEST_FLAG");

console.log("🔥 DANGEROUS MODULE: Flag value:", FLAG);

export function dangerousFunction() {
  console.log("🔥 DANGEROUS FUNCTION: Called successfully");
  return "dangerous-result";
}

export default {
  flag: FLAG,
  dangerousFunction,
};
