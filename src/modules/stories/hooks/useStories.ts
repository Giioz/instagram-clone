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
    staleTime: 30000, 
    gcTime: 300000, 
    refetchOnWindowFocus: false, 
    refetchOnMount: false, 
    refetchOnReconnect: true, 
  });

  const uploadMutation = useMutation({
    mutationFn: (mediaUrl: string) => storiesService.uploadStory(mediaUrl),
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

  const handleUpload = async (mediaUrl: string) => {
    await uploadMutation.mutateAsync(mediaUrl);
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
