"use client";
import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export function TestSWR() {
  const { data, isLoading } = useSWR("/foo", fetcher);
  return <div>{isLoading ? "Loading..." : `data: ${data}`}</div>;
}
