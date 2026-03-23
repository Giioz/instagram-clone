import { useQuery } from "@tanstack/react-query";

interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isFollowedBy: boolean;
}

export function useFollowStats(userId: string) {
  return useQuery<FollowStats>({
    queryKey: ["follow-stats", userId],
    queryFn: () => 
      fetch(`/api/follow-stats/${userId}`, { credentials: 'include' })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch follow stats");
          return res.json();
        }),
    enabled: !!userId,
  });
}
