import { defineApp } from "rwsdk/worker";
import { index, route, render } from "rwsdk/router";

import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";

export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx;
  },
  render(Document, [index([Home])]),
  route("/foo", () => {
    return new Response(JSON.stringify("bar"));
  }),
]);
