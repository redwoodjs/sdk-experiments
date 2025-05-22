// @ts-ignore
import "virtual:ssrBridge";

export default {
  fetch() {
    console.log("################## in rsc");
    return new Response("Hello, world!");
  },
};
