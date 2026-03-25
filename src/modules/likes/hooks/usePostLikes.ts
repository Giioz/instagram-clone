import { useState, useEffect, useCallback } from "react";
import type { User } from "@prisma/client";

interface PostLike {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}

interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl: string | null;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UsePostLikesProps {
  currentUser: User | null;
  post: Post;
}

export function usePostLikes({ currentUser, post }: UsePostLikesProps) {
  const [likes, setLikes] = useState<PostLike[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikeStatus = useCallback(async () => {
    if (!currentUser || !post) return;
    
    try {
      const response = await fetch(`/api/posts/like?postId=${post.id}`);
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes || []);
        setIsLiked(data.likes?.some((like: PostLike) => like.userId === currentUser.id) || false);
      }
    } catch (error) {
      console.error("Error fetching post likes:", error);
      setError("Failed to load likes");
    }
  }, [post, currentUser]);

  useEffect(() => {
    fetchLikeStatus();
  }, [fetchLikeStatus]);

  const handleLike = async () => {
    if (!currentUser || !post || isLoading) return;
    
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/posts/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id }),
      });

      if (!response.ok) {
        setIsLiked(!newIsLiked);
        setError("Failed to toggle like");
        throw new Error("Failed to toggle like");
      }

      // Refetch likes to get updated state
      await fetchLikeStatus();
    } catch (error) {
      console.error("Error toggling post like:", error);
      setError("Failed to toggle like");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLiked,
    isLoading,
    likes,
    error,
    handleLike,
  };
}
