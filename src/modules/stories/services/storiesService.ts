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

  async createStory(mediaUrl: string): Promise<StoryWithUser> {
    const response = await fetch('/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mediaUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to create story');
    }

    return response.json();
  },

  async uploadStory(mediaUrl: string): Promise<StoryWithUser> {
    return this.createStory(mediaUrl);
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
