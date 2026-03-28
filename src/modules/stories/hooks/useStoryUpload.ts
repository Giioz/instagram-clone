'use client';

import { useState, useRef } from 'react';
import React from 'react';
import { StoryUploader } from '../components/StoryUploader';

export function useStoryUpload(onUpload: (mediaUrl: string) => Promise<void>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
  };

  const reset = () => {
    setSelectedFile(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const StoryUploaderComponent = () => React.createElement(StoryUploader, { 
    onUpload: async (mediaUrl: string) => {
      await onUpload(mediaUrl);
      reset();
    }
  });

  return {
    selectedFile,
    handleFileSelect,
    handleUpload,
    reset,
    isUploading,
    fileInputRef,
    StoryUploader: StoryUploaderComponent
  };
}