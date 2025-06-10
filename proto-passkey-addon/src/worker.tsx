import { defineApp, ErrorResponse } from "rwsdk/worker";
import { index, render, route, prefix } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { authRoutes, User } from "@/passkey";
import debug from "./sdk/logger.js";
import { setupPasskeysDb } from "./passkey/db/setup";
import { sessions } from "./session/store";
import { Session } from "./session/durableObject";

export { SessionDurableObject } from "./session/durableObject";
export { PasskeyDurableObject } from "@/passkey/durableObject";

const log = debug("passkey:worker");

export type AppContext = {
  session: Session | null;
};

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    await setupPasskeys();

    try {
      ctx.session = await sessions.load(request);
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers);
        headers.set("Location", "/user/login");

        return new Response(null, {
          status: 302,
          headers,
        });
      }

      throw error;
    }
  },
  render(Document, [index([Home]), prefix("/auth", authRoutes())]),
]);
