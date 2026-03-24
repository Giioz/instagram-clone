import { useState, useEffect, useCallback } from "react";
import { likesService } from "../services/likesService";
import type { Post } from "@prisma/client";
import type { JWTPayload } from "@/src/lib/auth";

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

export const usePostLikes = (currentUser: JWTPayload | null, currentPost: Post | null) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likes, setLikes] = useState<PostLike[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = useCallback(async () => {
    if (!currentPost || !currentUser) return;
    
    try {
      setError(null);
      const likes = await likesService.fetchPostLikes(currentPost.id);
      setLikes(likes);
      const currentUserIdNum = parseInt(currentUser.userId, 10);
      const userLike = likes.find(
        (like: PostLike) => like.userId === currentUserIdNum
      );
      setIsLiked(!!userLike);
    } catch (error) {
      console.error('Error fetching likes:', error);
      setError('Error fetching likes');
    }
  }, [currentPost, currentUser]);

  useEffect(() => {
    if (currentPost) {
      fetchLikes();
    }
  }, [currentPost, fetchLikes]);

  const handleLike = async () => {
    if (isLoading || !currentPost || !currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await likesService.togglePostLike(currentPost.id);
      setIsLiked(data.liked);
      fetchLikes();
    } catch (error) {
      console.error('Error toggling like:', error);
      setError('Error toggling like');
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
    fetchLikes
  };
};
