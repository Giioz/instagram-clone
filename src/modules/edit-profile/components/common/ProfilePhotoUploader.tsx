'use client';

import { useState } from 'react';
import { UploadButton } from '../../../../utils/uploadthing';

interface ProfilePhotoUploaderProps {
  onUpload: (imageUrl: string) => void;
}

export function ProfilePhotoUploader({ onUpload }: ProfilePhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="profile-photo-uploader">
<style jsx global>{`
  .profile-photo-uploader input[type="file"],
  .profile-photo-uploader [data-ut-file-input],
  .profile-photo-uploader .ut-file-input,
  .profile-photo-uploader button span:first-child,
  .profile-photo-uploader button span:not(:last-child) {
    display: none !important;
    visibility: hidden !important;
  }
`}</style>

      <UploadButton
        endpoint="profilePhotoUploader"
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            onUpload(res[0].url);
          }
          setIsUploading(false);
        }}
        onUploadBegin={() => setIsUploading(true)}
        onUploadError={(error: Error) => {
          console.error('Profile photo upload error:', error);
          setIsUploading(false);
        }}
        appearance={{
          button: 'bg-[#4a5df9]  flex items-center justify-center text-white px-4 h-8 rounded-lg font-medium text-sm cursor-pointer hover:opacity-90 transition ',
          container: 'inline-block', 
          allowedContent: 'hidden',
        }}
        content={{
          button: 'Change photo',
        }}
      />
    </div>
  );
}
