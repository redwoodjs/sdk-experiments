import { RequestInfo } from "rwsdk/worker";
import { Button } from "../components/Button";

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <h1>Hello World</h1>
      <Button asChild>
        <a href="/contact">Contact</a>
      </Button>
    </div>
  );
}
