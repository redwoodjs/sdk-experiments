// @ts-ignore
import "virtual:ssrBridge";
import "test-dep-b";

export default {
  fetch() {
    console.log("################## in rsc worker");
    return new Response("Hello, world!");
  },
};
