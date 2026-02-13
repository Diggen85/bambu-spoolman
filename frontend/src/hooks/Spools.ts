import type { Spool } from "@app/types";
import { useSuspenseQuery } from "@tanstack/react-query";

async function query() {
  const response = await fetch(`/api/spools`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export default function useSpoolsQuery() {
  return useSuspenseQuery<Spool[]>({
    queryKey: ["spools"],
    queryFn: query,
    retry: false,
  });
}