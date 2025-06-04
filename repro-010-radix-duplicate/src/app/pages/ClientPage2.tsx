"use client";
import { RequestInfo } from "rwsdk/worker";
import { Button } from "../components/Button";

export function ClientPage2({ ctx }: RequestInfo) {
  return (
    <div>
      <Button asChild>
        <a href="/">Client Page 2</a>
      </Button>
    </div>
  );
}
