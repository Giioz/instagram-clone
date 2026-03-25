import { useState } from "react";

interface UseCommentLikeProps {
  commentId: number;
  initialLikes?: number;
  isInitiallyLiked?: boolean;
}

export function useCommentLike({ commentId, initialLikes = 0, isInitiallyLiked = false }: UseCommentLikeProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = async () => {
    if (isLoading) return;

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
        throw new Error("Failed to toggle like");
      }

      const data = await response.json();
      
      if (data.liked) {
        setLikes(prev => prev + 1);
        setIsLiked(true);
      } else {
        setLikes(prev => prev - 1);
        setIsLiked(false);
      }
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
