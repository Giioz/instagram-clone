"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface UsePostLikeProps {
  postId: number;
  initialLikes: number;
}
const fetchLikeStatus = async (postId: number): Promise<{ isLiked: boolean; likes: number }> => {
  const response = await fetch(`/api/posts/${postId}/like-status`);
  if (!response.ok) {
    throw new Error("Failed to fetch like status");
  }
  return response.json();
};

const togglePostLike = async (postId: number): Promise<{ isLiked: boolean; likes: number }> => {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to toggle like");
  }

  return response.json();
};

export function usePostLike({ postId, initialLikes }: UsePostLikeProps) {
  const queryClient = useQueryClient();

  const {
    data: likeData = { isLiked: false, likes: initialLikes },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["postLikeStatus", postId],
    queryFn: () => fetchLikeStatus(postId),
    initialData: { isLiked: false, likes: initialLikes },
  });

  const likeMutation = useMutation({
    mutationFn: () => togglePostLike(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["postLikeStatus", postId] });
      const previousData = queryClient.getQueryData(["postLikeStatus", postId]);
      
      queryClient.setQueryData(["postLikeStatus", postId], (old: any) => ({
        isLiked: !old.isLiked,
        likes: old.isLiked ? old.likes - 1 : old.likes + 1,
      }));
      
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["postLikeStatus", postId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["postLikeStatus", postId] });
    },
  });

  const toggleLike = () => {
    if (likeMutation.isPending) return;
    likeMutation.mutate();
  };

  return {
    likes: likeData.likes,
    isLiked: likeData.isLiked,
    isLoading: isLoading || likeMutation.isPending,
    error: error?.message || likeMutation.error?.message || null,
    toggleLike,
  };
}
