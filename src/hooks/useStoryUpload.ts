'use client';

import { useState } from 'react';

export function useStoryUpload(onUpload: (file: File) => Promise<void>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    await onUpload(selectedFile);
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
