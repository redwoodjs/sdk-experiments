import { RequestInfo } from "rwsdk/worker";
import { TestSWR } from "./TestSWR";
export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <TestSWR />
    </div>
  );
}
