// @ts-ignore
import { ssrTest } from "virtual:ssrBridge.js";
import "test-dep-b";
import * as SomeUserComponent from "./SomeUserComponent";

export default {
  fetch() {
    console.log("######### In worker fetch()");

    // @ts-ignore
    console.log(ssrTest(SomeUserComponent.__getID()));

    return new Response("Hello, world!");
  },
};
