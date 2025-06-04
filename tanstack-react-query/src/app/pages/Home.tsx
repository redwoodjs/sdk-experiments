import { RequestInfo } from "rwsdk/worker";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { Providers } from "../shared/Providers";
import { Client } from "./Client";
import { fetchTodo } from "../shared/queries";

export async function Home({ ctx }: RequestInfo) {
  console.log("[SERVER] Home: Starting server-side prefetch");

  // Create a server-side QueryClient
  const queryClient = new QueryClient();

  // Prefetch the todo data on the server
  await queryClient.prefetchQuery({
    queryKey: ["todo", 1],
    queryFn: () => fetchTodo("SERVER", 1),
  });

  console.log("[SERVER] Home: Server-side prefetch completed");

  // Dehydrate the state to pass to the client
  const dehydratedState = dehydrate(queryClient);

  console.log("[SERVER] Home: Dehydrated state created, passing to client");

  return (
    <Providers dehydratedState={dehydratedState}>
      <div>
        <h1>Hello World</h1>
        <Client />
      </div>
    </Providers>
  );
}
