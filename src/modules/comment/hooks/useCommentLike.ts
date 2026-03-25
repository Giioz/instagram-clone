import { useState, useEffect, useCallback } from "react";

interface UseCommentLikeProps {
  commentId: number;
  initialLikes?: number;
  isInitiallyLiked?: boolean;
}

export function useCommentLike({ commentId, initialLikes = 0, isInitiallyLiked = false }: UseCommentLikeProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLikeStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/comment/like?commentId=${commentId}`);
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likeCount);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  }, [commentId]);

  useEffect(() => {
    fetchLikeStatus();
  }, [fetchLikeStatus]);

  const toggleLike = async () => {
    if (isLoading) return;
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    
    setIsLiked(newIsLiked);
    setLikes(newLikes);
    setIsLoading(true);

    try {
      const response = await fetch("/api/comment/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (!response.ok) {
        setIsLiked(isLiked);
        setLikes(likes);
        throw new Error("Failed to toggle like");
      }

      const data = await response.json();
      setIsLiked(data.liked);
      setLikes(data.likeCount);
    } catch (error) {
      console.error("Error toggling comment like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    likes,
    isLiked,
    isLoading,
    toggleLike,
  };
}
