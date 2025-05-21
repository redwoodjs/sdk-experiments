import { RequestInfo } from "rwsdk/worker";
import { Button } from "./Button";

export function Home({ ctx }: RequestInfo) {
  return <Button />;
}
