import "test-dep-a";

export async function ssrTest(id: string) {
  const { useClientLookup } = await import(
    "virtual:use-client-lookup" as string
  );

  console.log("###### ssrTest(): useClientLookup", useClientLookup);
  const moduleFn = useClientLookup[id];

  if (!moduleFn) {
    throw new Error(
      `No module found for '${id}' in module lookup for "use client" directive`
    );
  }

  const result = await moduleFn();

  console.log("###### ssrTest(): import result for %s: %O", id, result);
  result.test();
}
