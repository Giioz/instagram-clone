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
    
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });
      
      const mediaUrl = await base64Promise;
      
      await onUpload(mediaUrl);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
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