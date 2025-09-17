import { defineApp } from "rwsdk/worker";
import { render, route } from "rwsdk/router";

import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { RadixDemo } from "@/app/pages/RadixDemo";
import { PortalDemo } from "@/app/pages/PortalDemo";
import { UseIdDemo } from "@/app/pages/UseIdDemo";
import { setCommonHeaders } from "@/app/headers";

export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx;
  },
  render(Document, [
    route("/", Home),
    route("/radix-demo", RadixDemo),
    route("/portal-demo", PortalDemo),
    route("/useid-demo", UseIdDemo),
  ]),
]);
