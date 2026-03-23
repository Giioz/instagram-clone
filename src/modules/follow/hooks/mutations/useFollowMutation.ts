import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFollowMutation() {
  const queryClient = useQueryClient();

  const createMutation = (isFollow: boolean) => {
    const endpoint = isFollow ? '/api/follow' : '/api/unfollow';
    const change = isFollow ? 1 : -1;
    const status = isFollow;

    return useMutation({
      mutationFn: ({ followingId }: { followingId: string }) => 
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followingId }),
        }).then(res => {
          if (!res.ok) throw new Error(`Failed to ${isFollow ? 'follow' : 'unfollow'} user`);
          return res.json();
        }),
      
      onMutate: async ({ followingId }) => {
        await queryClient.cancelQueries({ queryKey: ["follow-stats", followingId] });
        const previous = queryClient.getQueryData(["follow-stats", followingId]);
        
        queryClient.setQueryData(["follow-stats", followingId], (old: any) => 
          old ? { ...old, followersCount: old.followersCount + change, isFollowing: status } : old
        );
        
        return { previous, followingId };
      },
      
      onError: (_, __, context) => {
        if (context?.previous) {
          queryClient.setQueryData(["follow-stats", context.followingId], context.previous);
        }
      },
      
      onSettled: (_, __, { followingId }) => {
        queryClient.invalidateQueries({ queryKey: ["follow-stats", followingId] });
      },
    });
  };

  return {
    follow: createMutation(true),
    unfollow: createMutation(false),
  };
}