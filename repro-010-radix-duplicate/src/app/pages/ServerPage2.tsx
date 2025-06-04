import { RequestInfo } from "rwsdk/worker";
import { Button2 } from "../components/Button2";

export function ServerPage2({ ctx }: RequestInfo) {
  return (
    <div>
      <Button2 asChild>
        <a href="/">Server Page 2</a>
      </Button2>
    </div>
  );
}
