import { RequestInfo } from "rwsdk/worker";
import { Client } from "./Client";

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <h1>Hello World</h1>
      <Client />
    </div>
  );
}
