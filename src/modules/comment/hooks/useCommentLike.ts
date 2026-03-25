import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UseCommentLikeProps {
  commentId: number;
  initialLikes?: number;
  isInitiallyLiked?: boolean;
}

interface LikeStatus {
  likeCount: number;
  isLiked: boolean;
}

const fetchLikeStatus = async (commentId: number): Promise<LikeStatus> => {
  const response = await fetch(`/api/comment/like?commentId=${commentId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch like status");
  }
  
  return response.json();
};

const toggleLike = async (commentId: number): Promise<LikeStatus> => {
  const response = await fetch("/api/comment/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });

  if (!response.ok) {
    throw new Error("Failed to toggle like");
  }

  return response.json();
};

export function useCommentLike({ commentId, initialLikes = 0, isInitiallyLiked = false }: UseCommentLikeProps) {
  const queryClient = useQueryClient();

  const {
    data: likeStatus = { likeCount: initialLikes, isLiked: isInitiallyLiked },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["commentLike", commentId],
    queryFn: () => fetchLikeStatus(commentId),
    enabled: !!commentId,
    initialData: { likeCount: initialLikes, isLiked: isInitiallyLiked },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleLike(commentId),
    onMutate: async () => {
      const previousData = queryClient.getQueryData<LikeStatus>(["commentLike", commentId]);
      
      queryClient.setQueryData(["commentLike", commentId], (old: LikeStatus) => ({
        likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
        isLiked: !old.isLiked,
      }));

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["commentLike", commentId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["commentLike", commentId] });
    },
  });

  return {
    likes: likeStatus.likeCount,
    isLiked: likeStatus.isLiked,
    isLoading: isLoading || toggleLikeMutation.isPending,
    toggleLike: toggleLikeMutation.mutate,
    error,
  };
}
