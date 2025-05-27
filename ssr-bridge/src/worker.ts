// @ts-ignore
import { ssrTest } from "virtual:ssrBridge.js";
// @ts-ignore: won't be an issue in actual implementation
import * as depB from "test-dep-b";
import * as SomeUserComponent from "./SomeUserComponent";

export default {
  fetch() {
    console.log("######### In worker fetch()");

    // @ts-ignore: won't be an issue in actual implementation
    ssrTest(SomeUserComponent.__getID());

    // @ts-ignore won't be an issue in actual implementation
    ssrTest(depB.__getID());

    return new Response("Hello, world!");
  },
};
