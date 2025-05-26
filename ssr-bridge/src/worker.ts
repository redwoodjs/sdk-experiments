// @ts-ignore
import "virtual:ssrBridge.js";
import "test-dep-b";

export default {
  fetch() {
    return new Response("Hello, world!");
  },
};
