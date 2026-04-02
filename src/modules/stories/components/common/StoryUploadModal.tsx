'use client';

import { Camera, X } from 'lucide-react';
import { useState, useRef } from 'react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleShare = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    await onUpload(previewUrl);
    
    setIsUploading(false);
    setSelectedFile(null);
    setPreviewUrl('');
    onClose();
  };

  const handleCameraClick = () => fileInputRef.current?.click();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="w-full max-w-sm bg-[#0B1014] text-white p-6 rounded-3xl border border-gray-800 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">Create story</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
    <div className="relative border-2 border-dashed border-gray-800 rounded-2xl p-10 text-center hover:border-gray-600 hover:bg-white/[0.02] transition-all group flex flex-col items-center justify-center">
  
  {previewUrl ? (
    <div className="relative w-full h-48 flex items-center justify-center">
      <img 
        src={previewUrl} 
        alt="Preview" 
        className="w-full h-full object-cover rounded-xl"
      />
      <button
        onClick={() => {
          setSelectedFile(null);
          setPreviewUrl('');
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <X size={16} className="text-white" />
      </button>
    </div>
  ) : (
    <button 
      type="button"
      onClick={handleCameraClick}
      className="flex flex-col items-center justify-center gap-3 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
    >
      <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 group-hover:scale-110 transition-transform">
        <div className="bg-[#0B1014] rounded-full p-4">
          <Camera size={32} className="text-white" />
        </div>
      </div>
      <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
        Add photo
      </span>
    </button>
  )}

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*,video/*"
    onChange={handleFileSelect}
    className="hidden"
  />
</div>
        <div className="flex gap-3 mt-8">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-800 text-sm font-semibold hover:bg-white/5 transition-colors text-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleShare}
            disabled={!selectedFile || isUploading || uploading}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-blue-500/20"
          >
            {isUploading || uploading ? 'Uploading...' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
}