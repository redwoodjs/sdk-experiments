"use client";
import { checkImportA } from "./a";
import useSWR from "swr";

checkImportA("TestSWR (Client Component)");

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export function TestSWR() {
  const { data, isLoading } = useSWR("/foo", fetcher);
  return <div>{isLoading ? "Loading..." : `data: ${data}`}</div>;
}
