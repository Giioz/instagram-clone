'use client';

import { useState } from 'react';
import { UploadButton } from '../../../utils/uploadthing';

interface PostUploaderProps {
  onUpload: (mediaUrl: string) => Promise<void>;
}

export function PostUploader({ onUpload }: PostUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="post-uploader">
      <UploadButton
        endpoint="postUploader"
        onClientUploadComplete={async (res) => {
          if (res && res[0]) {
            await onUpload(res[0].url);
          }
          setIsUploading(false);
        }}
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onUploadError={(error: Error) => {
          console.error('Upload error:', error);
          alert(`Upload failed: ${error.message}`);
          setIsUploading(false);
        }}
        appearance={{
          button: {
            background: '#3B82F6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
          },
          container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          },
          allowedContent: {
            display: 'none',
          },
        }}
      />
      {isUploading && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Uploading...</span>
        </div>
      )}
    </div>
  );
}
