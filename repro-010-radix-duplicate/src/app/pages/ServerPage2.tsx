import { RequestInfo } from "rwsdk/worker";
import { Button } from "../components/Button";

export function ServerPage2({ ctx }: RequestInfo) {
  return (
    <div>
      <Button asChild>
        <a href="/">Server Page 2</a>
      </Button>
    </div>
  );
}
