import type { Story, User } from '@prisma/client';

interface StoryWithUser extends Story {
  user: User;
}

export const storiesService = {
  async fetchStories(): Promise<StoryWithUser[]> {
    try {
      const response = await fetch('/api/stories');
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      throw new Error('Failed to fetch stories');
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  },

  async createStory(file: File): Promise<StoryWithUser> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/stories', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create story');
    }

    return response.json();
  },

  async uploadStory(file: File): Promise<StoryWithUser> {
    return this.createStory(file);
  },

  async deleteStory(storyId: number): Promise<void> {
    try {
      const response = await fetch(`/api/stories?id=${storyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  }
};
