'use client';

import { useState, useEffect } from 'react';
import { storiesService } from '@/src/services/storiesService';
import type { Story, User } from '@prisma/client';

interface StoryWithUser extends Story {
  user: User;
}

export function useStories() {
  const [stories, setStories] = useState<StoryWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadStories = async () => {
      const data = await storiesService.fetchStories();
      setStories(data);
      setLoading(false);
    };
    
    loadStories();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await storiesService.uploadStory(file);
      const data = await storiesService.fetchStories();
      setStories(data);
    } catch (error) {
      console.error('Error uploading story:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    stories,
    loading,
    uploading,
    handleUpload,
    refreshStories: async () => {
      const data = await storiesService.fetchStories();
      setStories(data);
    }
  };
}
