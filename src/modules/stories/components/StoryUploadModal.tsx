'use client';

import { Camera, X } from 'lucide-react';
import { useStoryUpload } from '@/src/hooks/useStoryUpload';

interface StoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export default function StoryUploadModal({ 
  isOpen, 
  onClose, 
  onUpload, 
  uploading 
}: StoryUploadModalProps) {
  const {
    selectedFile,
    handleFileSelect,
    handleUpload,
    reset
  } = useStoryUpload(onUpload);

  const handleUploadClick = async () => {
    await handleUpload();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 w-80">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-black text-lg">Create Story</h2>
          <button onClick={() => { reset(); onClose(); }}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="border border-gray-300 rounded p-4 text-center">
            <input
              type="file"
              id="story-file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="story-file" className="cursor-pointer">
              <Camera size={32} className="text-gray-500 mx-auto mb-1" />
              <p className="text-gray-600 text-sm">
                {selectedFile ? selectedFile.name : 'Click to upload'}
              </p>
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { reset(); onClose(); }} className="flex-1 border border-gray-300 py-1 rounded text-sm">
              Cancel
            </button>
            <button
              onClick={handleUploadClick}
              disabled={!selectedFile || uploading}
              className="flex-1 bg-blue-500 text-white py-1 rounded text-sm disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
