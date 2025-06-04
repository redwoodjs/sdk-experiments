export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

// Shared query function for fetching todo data
export async function fetchTodo(
  executionContext: "SERVER" | "CLIENT" = "CLIENT",
  todoId: number = 1
): Promise<Todo> {
  const contextLabel = `[${executionContext}]`;

  console.log(
    `${contextLabel} fetchTodo: Starting query execution (todo #${todoId})`
  );

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`
  );
  if (!response.ok) {
    console.log(
      `${contextLabel} fetchTodo: Query failed with status ${response.status}`
    );
    throw new Error("Failed to fetch todo");
  }

  const data: Todo = await response.json();
  console.log(
    `${contextLabel} fetchTodo: Query completed successfully (todo #${todoId})`,
    data
  );

  return data;
}
