import { defineApp } from "rwsdk/worker";
import { index, render, route, prefix } from "rwsdk/router";

import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { authRoutes } from "@/passkey";

export type AppContext = {};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {
    // setup ctx here
    ctx;
  },
  render(Document, [index([Home]), prefix("/auth", authRoutes())]),
]);

export { PasskeyDurableObject } from "@/passkey/durableObject";
