import { RequestInfo } from "rwsdk/worker";
import { checkImportA } from "./a";
import { TestSWR } from "./TestSWR";

checkImportA("Home (Server Component)");

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <TestSWR />
    </div>
  );
}
