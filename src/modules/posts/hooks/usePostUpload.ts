'use client';

import { useState } from 'react';
import React from 'react';
import { PostUploader } from '../components/section/PostUploader';


export function usePostUpload(onUpload: (mediaUrl: string) => Promise<void>) {
  const [isUploading, setIsUploading] = useState(false);

  const PostUploaderComponent = () => React.createElement(PostUploader, { onUpload });

  return {
    isUploading,
    PostUploader: PostUploaderComponent
  };
}
