'use client';

import { useState } from 'react';
import React from 'react';
import { StoryUploader } from '../components/StoryUploader';

export function useStoryUpload(onUpload: (mediaUrl: string) => Promise<void>) {
  const [isUploading, setIsUploading] = useState(false);

  const StoryUploaderComponent = () => React.createElement(StoryUploader, { onUpload });

  return {
    isUploading,
    StoryUploader: StoryUploaderComponent
  };
}