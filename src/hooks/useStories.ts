'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storiesService } from '@/src/modules/stories/services/storiesService';
import type { Story, User } from '@prisma/client';

interface StoryWithUser extends Story {
  user: User;
}

interface GroupedStories {
  user: User;
  stories: Story[];
}

const groupStories = (stories: StoryWithUser[]): GroupedStories[] => {
  const grouped = stories.reduce((acc: GroupedStories[], story) => {
    const existingUser = acc.find(item => item.user.id === story.user.id);
    if (existingUser) {
      existingUser.stories.push(story);
    } else {
      acc.push({
        user: story.user,
        stories: [story]
      });
    }
    return acc;
  }, []);

  grouped.forEach(group => {
    group.stories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });
  
  return grouped;
};

export function useStories() {
  const queryClient = useQueryClient();

  const { data: groupedStories = [], isLoading: loading } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const data = await storiesService.fetchStories();
      return groupStories(data);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => storiesService.uploadStory(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (storyId: number) => storiesService.deleteStory(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });

  const handleUpload = async (file: File) => {
    await uploadMutation.mutateAsync(file);
  };

  const handleDelete = async (storyId: number) => {
    return deleteMutation.mutateAsync(storyId);
  };

  return {
    groupedStories,
    loading,
    uploading: uploadMutation.isPending,
    handleUpload,
    handleDelete,
    refreshStories: () => queryClient.invalidateQueries({ queryKey: ['stories'] }),
  };
}
