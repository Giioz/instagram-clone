import type { Story, User } from '@prisma/client';

interface StoryWithUser extends Story {
  user: User;
}
const cache = new Map<string, { data: StoryWithUser[]; timestamp: number }>();
const CACHE_DURATION = 30000; 
export const storiesService = {
  async fetchStories(): Promise<StoryWithUser[]> {
    const cacheKey = 'stories';
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch('/api/stories', {
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        cache.set(cacheKey, { data, timestamp: now });
        
        return data;
      }
      throw new Error('Failed to fetch stories');
    } catch (error) {
      console.error('Error fetching stories:', error);

      if (cached) {
        return cached.data;
      }
      
      return [];
    }
  },

  clearCache() {
    cache.clear();
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
    const result = await this.createStory(mediaUrl);
    this.clearCache();
    return result;
  },

  async deleteStory(storyId: number): Promise<void> {
    try {
      const response = await fetch(`/api/stories?id=${storyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }
      
      this.clearCache();
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  }
};
