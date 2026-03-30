import { useState, useEffect, useCallback } from "react";
import type { Story } from "@prisma/client";
import type { JWTPayload } from "@/src/lib/auth";

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

interface UseStoryLikesProps {
  viewer: JWTPayload | null;
  currentStory: Story | null;
}

function viewerId(viewer: JWTPayload | null): number | null {
  if (!viewer?.userId) return null;
  const id = parseInt(String(viewer.userId), 10);
  return Number.isFinite(id) ? id : null;
}

export function useStoryLikes({ viewer, currentStory }: UseStoryLikesProps) {
  const [likes, setLikes] = useState<StoryLike[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikeStatus = useCallback(async () => {
    if (!currentStory) return;

    const me = viewerId(viewer);

    try {
      const response = await fetch(
        `/api/stories/like?storyId=${currentStory.id}`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes || []);
        setIsLiked(
          me !== null &&
            (data.likes?.some((like: StoryLike) => like.userId === me) || false)
        );
      }
    } catch (error) {
      console.error("Error fetching story likes:", error);
      setError("Failed to load likes");
    }
  }, [currentStory, viewer]);

  useEffect(() => {
    fetchLikeStatus();
  }, [fetchLikeStatus]);

  const handleLike = async () => {
    if (!currentStory || isLoading || !viewer) return;

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stories/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ storyId: currentStory.id }),
      });

      if (!response.ok) {
        setIsLiked(!newIsLiked);
        setError("Failed to toggle like");
        throw new Error("Failed to toggle like");
      }

      // Refetch likes to get updated state
      await fetchLikeStatus();
    } catch (error) {
      console.error("Error toggling story like:", error);
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
