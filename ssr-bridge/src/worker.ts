// @ts-ignore
import "virtual:ssrBridge";

export default {
  fetch() {
    console.log("################## in rsc worker");
    return new Response("Hello, world!");
  },
};
