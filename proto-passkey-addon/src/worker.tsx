import { defineApp, ErrorResponse } from "rwsdk/worker";
import { index, render, route, prefix } from "rwsdk/router";
import { env } from "cloudflare:workers";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { authRoutes, User } from "@/passkey";
import debug from "./sdk/logger.js";
import { setupPasskeyAuth } from "./passkey/setup";
import { Session } from "./session/durableObject";

export { SessionDurableObject } from "./session/durableObject";
export { PasskeyDurableObject } from "@/passkey/durableObject";

const log = debug("passkey:worker");

export type AppContext = {
  session: Session | null;
};

export default defineApp([
  setCommonHeaders(),
  setupPasskeyAuth(),
  render(Document, [index([Home]), prefix("/auth", authRoutes())]),
]);
