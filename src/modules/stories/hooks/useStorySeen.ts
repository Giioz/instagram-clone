import { useState, useEffect } from 'react';
import type { Story } from '@prisma/client';
import type { JWTPayload } from '@/src/lib/auth';
import { StorySeenService } from '@/src/modules/stories/services/storySeenService';

interface UseStorySeenProps {
  currentUser: JWTPayload | null;
  currentStory: Story | null;
}

interface UseStorySeenReturn {
  seen: boolean;
  markSeen: () => Promise<void>;
  loading: boolean;
}

export function useStorySeen({ currentUser, currentStory }: UseStorySeenProps): UseStorySeenReturn {
  const [seen, setSeen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!currentUser || !currentStory) {
      setSeen(false);
      return;
    }

    const checkIfSeen = async () => {
      try {
        const result = await StorySeenService.checkIfStorySeen(currentStory.id);
        if (result.seen !== undefined) {
          setSeen(result.seen);
        }
      } catch (error) {
        console.error('Error checking if story is seen:', error);
      }
    };

    checkIfSeen();
  }, [currentUser, currentStory]);
  const markSeen = async (): Promise<void> => {
    if (!currentUser || !currentStory || seen) {
      return;
    }

    setLoading(true);
    try {
      const result = await StorySeenService.markStoryAsSeen(currentStory.id);
      if (result.success) {
        setSeen(true);
      } else {
        console.error('Failed to mark story as seen:', result.error);
      }
    } catch (error) {
      console.error('Error marking story as seen:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    seen,
    markSeen,
    loading,
  };
}
