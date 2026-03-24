import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  isFollowing?: boolean;
}

export function useFollowing(userId: string) {
  return useQuery<User[]>({
    queryKey: ["following", userId],
    queryFn: () => 
      fetch(`/api/follow-list/following/${userId}`, { credentials: 'include' })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch following");
          return res.json();
        }),
    enabled: !!userId,
  });
}
