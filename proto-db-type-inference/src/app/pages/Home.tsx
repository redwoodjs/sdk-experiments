import { RequestInfo } from "rwsdk/worker";

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <h1>Hello World</h1>
      <p>
        <a href="/auth/login">Login</a>
      </p>
    </div>
  );
}
