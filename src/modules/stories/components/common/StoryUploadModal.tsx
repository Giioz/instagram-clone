'use client';

import { Camera, X } from 'lucide-react';
import { useStoryUpload } from '../../hooks/useStoryUpload';

interface StoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (mediaUrl: string) => Promise<void>;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

      <div className="w-full max-w-sm bg-[#0B1014] text-white p-5 rounded-2xl border border-gray-800 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Create story</h2>
          <button 
            onClick={() => { reset(); onClose(); }}
            className="p-1 rounded-full hover:bg-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>
        <div className="border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800 transition">
          <input
            type="file"
            id="story-file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="story-file" className="cursor-pointer block">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 p-[2px] rounded-full">
                <div className="bg-[#0B1014] rounded-full p-3">
                  <Camera size={26} className="text-white" />
                </div>
              </div>

              <p className="text-sm font-medium">
                {selectedFile ? selectedFile.name : 'Select from computer'}
              </p>
            </div>
          </label>
        </div>
        <div className="flex gap-2 mt-5">
          
          <button 
            onClick={() => { reset(); onClose(); }}
            className="flex-1 py-2 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUploadClick}
            disabled={!selectedFile || uploading}
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-tr from-blue-500 to-purple-500 hover:opacity-90 transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Share'}
          </button>
        </div>

      </div>
    </div>
  );
}