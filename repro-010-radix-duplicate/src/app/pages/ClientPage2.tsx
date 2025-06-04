"use client";
import { RequestInfo } from "rwsdk/worker";
import { Button2 } from "../components/Button2";

export function ClientPage2({ ctx }: RequestInfo) {
  return (
    <div>
      <Button2 asChild>
        <a href="/">Client Page 2</a>
      </Button2>
    </div>
  );
}
