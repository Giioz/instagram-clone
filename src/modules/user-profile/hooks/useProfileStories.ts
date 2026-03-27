"use client";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { groupedStories } = useStories();

  const selectedUserIndex = queryClient.getQueryData<number | null>(["selectedStoryUser", user.id]) || null;

  const setSelectedUserIndex = (index: number | null) => {
    queryClient.setQueryData(["selectedStoryUser", user.id], index);
  };

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
