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
      body: JSON.stringify({
        mediaUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create story');
    }

    return response.json();
  },

  async uploadStory(file: File): Promise<StoryWithUser> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;
          const story = await this.createStory(base64data);
          resolve(story);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
};
