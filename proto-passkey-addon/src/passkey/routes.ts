import { route } from "rwsdk/router";
import { Login } from "./components/Login.js";

export function authRoutes() {
  return [route("/login", [Login])];
}
