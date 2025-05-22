// @ts-ignore
import "virtual:ssrBridge";
import "test-dep-b";

export default {
  fetch() {
    return new Response("Hello, world!");
  },
};
