// @ts-ignore
import "virtual:ssrBridge.js";
import "test-dep-b";
import "./SomeUserComponent";

export default {
  fetch() {
    return new Response("Hello, world!");
  },
};
