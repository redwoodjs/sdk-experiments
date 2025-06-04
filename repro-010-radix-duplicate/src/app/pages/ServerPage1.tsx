import { RequestInfo } from "rwsdk/worker";
import { Button } from "../components/Button";

export function ServerPage1({ ctx }: RequestInfo) {
  return (
    <div>
      <Button asChild>
        <a href="/">Server Page 1</a>
      </Button>
    </div>
  );
}
