"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

function TodoExample() {
  const { data, isLoading, error } = useQuery<Todo>({
    queryKey: ["todo"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/1"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch todo");
      }
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>React Query Example</h2>
      <p>Todo ID: {data?.id}</p>
      <p>Title: {data?.title}</p>
      <p>Completed: {data?.completed ? "Yes" : "No"}</p>
    </div>
  );
}

export const Client = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <TodoExample />
      </div>
    </QueryClientProvider>
  );
};
