import { useSuspenseQuery } from "@tanstack/react-query";

export type appStatus = {
spoolman_url:string;
spoolman_valid: boolean;
status:string;
}

async function query() {
    const response = await fetch(`/api/`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export default function useAppStatus() {
  return useSuspenseQuery<appStatus>({
    queryKey: ["appStatus"],
    queryFn: query,
    retry: false,
  });
}