import { RequestInfo } from "rwsdk/worker";
import { checkImportA } from "./a";
import { TestSWR } from "./TestSWR";

checkImportA("SERVER");

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <TestSWR />
    </div>
  );
}
