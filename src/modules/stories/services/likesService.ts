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

export const likesService = {
  async fetchStoryLikes(storyId: number): Promise<StoryLike[]> {
    try {
      const response = await fetch(`/api/stories/like?storyId=${storyId}`);
      if (response.ok) {
        const data = await response.json();
        return data.likes || [];
      }
      throw new Error('Failed to fetch likes');
    } catch (error) {
      console.error('Error fetching likes:', error);
      throw error;
    }
  },

  async toggleStoryLike(storyId: number): Promise<{ liked: boolean }> {
    const response = await fetch('/api/stories/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }

    return response.json();
  }
};
