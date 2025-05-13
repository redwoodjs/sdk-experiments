import { RequestInfo } from "rwsdk/worker";

import { SomeClientComponent } from "./SomeClientComponent";

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <SomeClientComponent />
    </div>
  );
}
