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

interface PostLike {
  id: number;
  userId: number;
  postId: number;
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
      const response = await fetch(`/api/likes?storyId=${storyId}`, {
        credentials: 'include',
      });
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
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        storyId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }

    const data = await response.json();
    return { liked: data.message.includes('liked successfully') };
  },

  async fetchPostLikes(postId: number): Promise<PostLike[]> {
    try {
      const response = await fetch(`/api/likes?postId=${postId}`, {
        credentials: 'include',
      });
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

  async togglePostLike(postId: number): Promise<{ liked: boolean }> {
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        postId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }

    const data = await response.json();
    return { liked: data.message.includes('liked successfully') };
  }
};
