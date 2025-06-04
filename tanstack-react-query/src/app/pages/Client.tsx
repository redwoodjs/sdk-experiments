"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodo } from "../shared/queries";

export const Client = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["todo", 1],
    queryFn: () => fetchTodo("CLIENT", 1),
  });

  const handleRefetch = () => {
    console.log("[CLIENT] User clicked refetch button");
    refetch();
  };

  const handleInvalidateAndRefetch = () => {
    console.log("[CLIENT] User clicked invalidate and refetch");
    queryClient.invalidateQueries({ queryKey: ["todo", 1] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>React Query Example</h2>
      <div style={{ marginBottom: "20px" }}>
        <h3>Todo Data (Server Prefetched, Client Updated):</h3>
        <p>Todo ID: {data?.id}</p>
        <p>Title: {data?.title}</p>
        <p>Completed: {data?.completed ? "Yes" : "No"}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Actions (check console for client-side fetches):</h3>
        <button
          onClick={handleRefetch}
          style={{ marginRight: "10px", padding: "8px 16px" }}
        >
          Refetch Data
        </button>

        <button
          onClick={handleInvalidateAndRefetch}
          style={{ padding: "8px 16px" }}
        >
          Invalidate & Refetch
        </button>
      </div>
    </div>
  );
};
