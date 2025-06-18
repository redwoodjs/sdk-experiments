import { RequestInfo } from "rwsdk/worker";
import ClientTest from "./ClientTest";
import { Suspense } from "react";

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <h1>Hello World</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientTest />
      </Suspense>
    </div>
  );
}
