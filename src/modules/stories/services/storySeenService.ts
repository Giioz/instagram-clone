export interface StorySeenResponse {
  success: boolean;
  error?: string;
}

export interface CheckStorySeenResponse {
  seen: boolean;
  error?: string;
}

export class StorySeenService {
  private static readonly BASE_URL = '/api/stories/seen';

  static async markStoryAsSeen(storyId: number): Promise<StorySeenResponse> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storyId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Failed to mark story as seen',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking story as seen:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  static async checkIfStorySeen(storyId: number): Promise<CheckStorySeenResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}?storyId=${storyId}`);

      if (!response.ok) {
        const errorData = await response.json();
        return {
          seen: false,
          error: errorData.error || 'Failed to check if story is seen',
        };
      }

      const data = await response.json();
      return { seen: data.seen };
    } catch (error) {
      console.error('Error checking if story is seen:', error);
      return {
        seen: false,
        error: 'Network error occurred',
      };
    }
  }


  static async checkMultipleStoriesSeen(storyIds: number[]): Promise<{ [storyId: number]: boolean }> {
    const results: { [storyId: number]: boolean } = {};
    const promises = storyIds.map(async (storyId) => {
      const result = await this.checkIfStorySeen(storyId);
      return { storyId, seen: result.seen };
    });

    try {
      const responses = await Promise.all(promises);
      responses.forEach(({ storyId, seen }) => {
        results[storyId] = seen;
      });
    } catch (error) {
      console.error('Error checking multiple stories:', error);
      storyIds.forEach(storyId => {
        results[storyId] = false;
      });
    }

    return results;
  }
}
