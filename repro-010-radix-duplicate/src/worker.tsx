import { defineApp } from "rwsdk/worker";
import { index, render, route } from "rwsdk/router";

import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { ServerPage1 } from "@/app/pages/ServerPage1";
import { ServerPage2 } from "@/app/pages/ServerPage2";
import { ClientPage1 } from "@/app/pages/ClientPage1";
import { ClientPage2 } from "@/app/pages/ClientPage2";

export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx;
  },
  render(Document, [
    index([Home]),
    route("/server1", ServerPage1),
    route("/server2", ServerPage2),
    route("/client1", ClientPage1),
    route("/client2", ClientPage2),
  ]),
]);
