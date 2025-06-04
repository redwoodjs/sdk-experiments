import { defineApp } from "rwsdk/worker";
import { layout, route, render } from "rwsdk/router";

import { Document } from "@/app/Document";
import { TestLayout } from "@/app/test-layout";

export type AppContext = {};

export default defineApp([
  render(Document, [layout(TestLayout, [route("/test", [() => <p>Test</p>])])]),
]);
