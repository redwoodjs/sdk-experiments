// @ts-ignore
import * as ssrBridge from "virtual:ssr:/src/ssrBridge.ts";
// @ts-ignore: won't be an issue in actual implementation
import * as depB from "test-dep-b";
import * as SomeUserComponent from "./SomeUserComponent";

export default {
  async fetch() {
    console.log("######### in worker fetch()");
    console.log("###### in worker fetch(): ssr bridge", ssrBridge);

    // @ts-ignore: won't be an issue in actual implementation
    await ssrBridge.ssrTest(SomeUserComponent.__getID());

    console.log("###### in worker fetch(): depB", depB);
    // @ts-ignore won't be an issue in actual implementation
    await ssrBridge.ssrTest(depB.__getID());

    return new Response("Hello, world!");
  },
};
