'use client';

import { UploadButton } from '@/src/utils/uploadthing';
import { useState } from 'react';


interface PostUploaderProps {
  onUpload: (mediaUrl: string) => Promise<void>;
}

export function PostUploader({ onUpload }: PostUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="post-uploader [&_input[type='file']]:hidden [&_.ut-button]:w-auto">
      <UploadButton
        className="custom-upload-btn"
        endpoint="postUploader"
        content={{
          button: "Select from computer",
          allowedContent: null,
        }}
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
            background: 'rgb(74, 93, 249)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
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
