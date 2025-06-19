import { defineApp, ErrorResponse } from "rwsdk/worker";
import { index, render, route, prefix } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { authRoutes, User } from "@/passkey";
import { setupPasskeyAuth } from "@/passkey/setup";
import { Session } from "./session/durableObject";
import debug from "debug";

export { SessionDurableObject } from "./session/durableObject";
export { PasskeyDurableObject } from "@/passkey/durableObject";

const log = debug("passkey:worker");

export type AppContext = {
  session: Session | null;
};

export default defineApp([
  setCommonHeaders(),
  setupPasskeyAuth(),
  render(Document, [
    index([
      ({ ctx }) => {
        if (!ctx.session?.userId) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/auth/login" },
          });
        }
      },
      Home,
    ]),
    prefix("/auth", authRoutes()),
  ]),
]);
