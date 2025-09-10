import { defineApp } from "rwsdk/worker";
import { render, route, prefix, index } from "rwsdk/router";

import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";

import { authRoutes } from "@/passkey/routes";
import { setupPasskeyAuth } from "@/passkey/setup";
import { Session } from "@/session/durableObject";

export { SessionDurableObject } from "@/session/durableObject";
export { PasskeyDurableObject } from "@/passkey/durableObject";

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
