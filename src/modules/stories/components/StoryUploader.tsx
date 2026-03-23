'use client';

import { useState } from 'react';
import { UploadButton } from '../../../utils/uploadthing';

interface StoryUploaderProps {
  onUpload: (mediaUrl: string) => Promise<void>;
}

export function StoryUploader({ onUpload }: StoryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="story-uploader">
      <UploadButton
        endpoint="storyUploader"
        onClientUploadComplete={async (res) => {
          if (res && res[0]) {
            await onUpload(res[0].url);
          }
          setIsUploading(false);
        }}
        onUploadBegin={() => setIsUploading(true)}
        onUploadError={(error: Error) => {
          console.error('Upload error:', error);
          setIsUploading(false);
        }}
      />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
}
