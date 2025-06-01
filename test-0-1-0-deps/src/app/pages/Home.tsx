import { RequestInfo } from "rwsdk/worker";
import { TestDepDualClientComponent } from "test-dep-dual";
import "test-dep-react-server-only";
import { TestClient } from "./TestClient";

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <TestClient />
      <div>
        Used directly from server component: [start]
        <div>
          <TestDepDualClientComponent />
        </div>
        [end]
      </div>
    </div>
  );
}
