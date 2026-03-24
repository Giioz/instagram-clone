import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  isFollowing?: boolean;
}

export function useFollowers(userId: string) {
  return useQuery<User[]>({
    queryKey: ["followers", userId],
    queryFn: () => 
      fetch(`/api/follow-list/followers/${userId}`, { credentials: 'include' })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch followers");
          return res.json();
        }),
    enabled: !!userId,
  });
}
