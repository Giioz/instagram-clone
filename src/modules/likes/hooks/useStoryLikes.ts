import { useState, useEffect, useCallback } from "react";
import { likesService } from "../services/likesService";
import type { User, Story } from "@prisma/client";

interface StoryLike {
  id: number;
  userId: number;
  storyId: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}

export const useStoryLikes = (currentUser: User, currentStory: Story | null) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likes, setLikes] = useState<StoryLike[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = useCallback(async () => {
    if (!currentStory || !currentUser) return;
    
    try {
      setError(null);
      const likes = await likesService.fetchStoryLikes(currentStory.id);
      setLikes(likes);
      const userLike = likes.find((like: StoryLike) => like.userId === currentUser.id);
      setIsLiked(!!userLike);
    } catch (error) {
      console.error('Error fetching likes:', error);
      setError('Error fetching likes');
    }
  }, [currentStory, currentUser]);

  useEffect(() => {
    if (currentStory) {
      fetchLikes();
    }
  }, [currentStory, fetchLikes]);

  const handleLike = async () => {
    if (isLoading || !currentStory) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await likesService.toggleStoryLike(currentStory.id);
      setIsLiked(!isLiked);
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
