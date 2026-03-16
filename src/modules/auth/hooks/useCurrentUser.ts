import { useQuery } from "@tanstack/react-query";
import type { JWTPayload } from "@/src/lib/auth";

export function useCurrentUser() {
  return useQuery<JWTPayload>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error("Failed to get current user");
      }
      return response.json();
    },
    retry: false,
  });
}
