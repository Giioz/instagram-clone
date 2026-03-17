"use client";
import { useState } from "react";
import { useStories } from "@/src/modules/stories/hooks/useStories";
import type { UserProfile } from "@/src/modules/user-profile/types";

interface UseProfileStoriesProps {
  user: UserProfile;
}

interface UseProfileStoriesReturn {
  selectedUserIndex: number | null;
  handleAvatarClick: () => void;
  handleCloseStoryViewer: () => void;
  groupedStories: any[];
}

export function useProfileStories({ user }: UseProfileStoriesProps): UseProfileStoriesReturn {
  const { groupedStories } = useStories();
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);

  const handleAvatarClick = () => {
    const userStoryIndex = groupedStories.findIndex(story => story.user.id === user.id);
    if (userStoryIndex !== -1) {
      setSelectedUserIndex(userStoryIndex);
    }
  };

  const handleCloseStoryViewer = () => {
    setSelectedUserIndex(null);
  };

  return {
    selectedUserIndex,
    handleAvatarClick,
    handleCloseStoryViewer,
    groupedStories,
  };
}
