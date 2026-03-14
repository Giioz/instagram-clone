'use client';

import { useState } from 'react';

export function useStoryUpload(onUpload: (mediaUrl: string) => Promise<void>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const mediaUrl = URL.createObjectURL(selectedFile);
    await onUpload(mediaUrl);
    setSelectedFile(null);
  };

  const reset = () => {
    setSelectedFile(null);
  };

  return {
    selectedFile,
    handleFileSelect,
    handleUpload,
    reset
  };
}