import { route } from "rwsdk/router";
import { Login } from "./components/Login.js";
import debug from "../sdk/logger.js";

const log = debug("passkey:routes");

export function authRoutes() {
  log("Setting up authentication routes");
  return [
    route("/login", [
      ({ request }) => {
        log("Login route accessed: %s %s", request.method, request.url);
      },
      Login,
    ]),
  ];
}
