import { defineApp } from "rwsdk/worker";
import { render, route } from "rwsdk/router";

import { Document1 } from "@/app/Document1";
import { Document2 } from "@/app/Document2";
import { Home1 } from "@/app/pages/Home1";
import { Home2 } from "@/app/pages/Home2";
import { setCommonHeaders } from "@/app/headers";

export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx;
  },
  render(Document1, [route("/", Home1)]),
  render(Document2, [route("/2", Home2)]),
]);
