// @ts-ignore
import * as ssrBridge from "virtual:ssr:/src/ssrBridge.ts";
import * as ReactServerOnly from "test-dep-react-server-only";
import * as SomeUserComponent from "./SomeUserComponent";

export default {
  async fetch(req: Request) {
    console.log("######### in worker fetch()", req.url);
    console.log("###### in worker fetch(): ssr bridge", ssrBridge);

    // @ts-ignore: won't be an issue in actual implementation
    await ssrBridge.ssrTest(SomeUserComponent.__getID());

    console.log("###### in worker fetch(): ReactServerOnly", ReactServerOnly);
    // @ts-ignore won't be an issue in actual implementation
    await ssrBridge.ssrTest(ReactServerOnly.__getID());

    return new Response("Hello, world!");
  },
};
