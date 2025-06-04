"use client";
import { RequestInfo } from "rwsdk/worker";
import { Button } from "../components/Button";

export function ClientPage1({ ctx }: RequestInfo) {
  return (
    <div>
      <Button asChild>
        <a href="/">Client Page 1</a>
      </Button>
    </div>
  );
}
