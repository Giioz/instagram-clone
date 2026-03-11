import { useState } from "react";
import type { Story, User } from "@prisma/client";

interface GroupedStoriesType {
  user: User;
  stories: Story[];
}

export function useStoryNavigation(
  groupedStories: GroupedStoriesType[],
  currentUserIndex: number
) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentUserIdx, setCurrentUserIdx] = useState(currentUserIndex);

  const currentUser = groupedStories[currentUserIdx];
  const stories = currentUser?.stories || [];

  const handlePreviousUserOrStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      return 0;
    } else if (currentUserIdx > 0) {
      const prevUserIdx = currentUserIdx - 1;
      const prevUserStories = groupedStories[prevUserIdx].stories;
      setCurrentUserIdx(prevUserIdx);
      setCurrentStoryIndex(prevUserStories.length - 1);
      return 0;
    }
    return null;
  };

  const handleNextUserOrStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      return 0;
    } else if (currentUserIdx < groupedStories.length - 1) {
      setCurrentUserIdx(currentUserIdx + 1);
      setCurrentStoryIndex(0);
      return 0;
    }
    return null;
  };

  const handleStoryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    if (x < width / 3) handlePreviousUserOrStory();
    else if (x > (width * 2) / 3) handleNextUserOrStory();
  };

  const resetToUser = (userIndex: number) => {
    setCurrentUserIdx(userIndex);
    setCurrentStoryIndex(0);
  };

  return {
    currentStoryIndex,
    currentUserIdx,
    currentUser,
    stories,
    handlePreviousUserOrStory,
    handleNextUserOrStory,
    handleStoryClick,
    resetToUser,
    setCurrentStoryIndex,
    setCurrentUserIdx,
  };
}
