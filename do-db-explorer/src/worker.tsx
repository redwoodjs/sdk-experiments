import { defineApp } from "rwsdk/worker";
import { render, route } from "rwsdk/router";

import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";



export type AppContext = {};
export { AppDurableObject } from "@/db/durableObject";

function isLocalhost() {
  if (!import.meta.env.VITE_IS_DEV_SERVER) {
    // lets not show this in production, incase it was pushe to prod.
    return new Response("Hello World!", { status: 200 });
  }
}


export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    // middleware interruptor to stop the request from being processed if not localhost
    isLocalhost(),
    ctx;
  },
  
  render(Document, [
    route("/", Home),
    route("/:table", Home),
  ]),
]);
