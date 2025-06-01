import { RequestInfo } from "rwsdk/worker";
import { TestDepDualClientComponent } from "test-dep-dual";
import { TestClient } from "./TestClient";

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <TestClient />
      <div>
        Used directly from server component:
        <TestDepDualClientComponent />
      </div>
    </div>
  );
}
