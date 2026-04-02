"use client";

import { X, Plus, ChevronUp, ChevronDown } from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";
import { UploadButton } from "@/src/utils/uploadthing";

interface MiniPhotoPanelProps {
  imageUrls: string[];
  currentIndex: number;
  onSelectImage: (index: number) => void;
  onRemoveImage: (index: number) => void;
  isUploading: boolean;
  onUploadComplete: (res: { url: string }[]) => void;
  onUploadBegin: () => void;
  onUploadError: (error: Error) => void;
}

export function MiniPhotoPanel({
  imageUrls,
  currentIndex,
  onSelectImage,
  onRemoveImage,
  isUploading,
  onUploadComplete,
  onUploadBegin,
  onUploadError,
}: MiniPhotoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [processedUploads, setProcessedUploads] = useState<Set<string>>(new Set());

  if (imageUrls.length === 0) return null;
  const handleUploadComplete = (res: { url: string }[]) => {
    const uploadKey = res.map(r => r.url).join(',');
    if (processedUploads.has(uploadKey)) {
      console.log('Duplicate upload detected, skipping:', uploadKey);
      return;
    }
    setProcessedUploads(prev => new Set(prev).add(uploadKey));
    onUploadComplete(res);
  };
  const handleRemove = async (index: number, url: string) => {
    if (deletingIndex !== null) return; 
    setDeletingIndex(index);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/uploadthing/delete?fileUrl=${encodeURIComponent(url)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to delete file from UploadThing");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setDeletingIndex(null);
      onRemoveImage(index);
    }
  };

  return (
    <div className="relative">
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="relative w-[32px] h-[32px] rounded-full bg-[#1A1A1A] flex items-center justify-center text-[white]"
        >
          <svg aria-label="Open media gallery" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16"><title>Open media gallery</title><path d="M19 15V5a4.004 4.004 0 0 0-4-4H5a4.004 4.004 0 0 0-4 4v10a4.004 4.004 0 0 0 4 4h10a4.004 4.004 0 0 0 4-4ZM3 15V5a2.002 2.002 0 0 1 2-2h10a2.002 2.002 0 0 1 2 2v10a2.002 2.002 0 0 1-2 2H5a2.002 2.002 0 0 1-2-2Zm18.862-8.773A.501.501 0 0 0 21 6.57v8.431a6 6 0 0 1-6 6H6.58a.504.504 0 0 0-.35.863A3.944 3.944 0 0 0 9 23h6a8 8 0 0 0 8-8V9a3.95 3.95 0 0 0-1.138-2.773Z" fillRule="evenodd"></path></svg>

        </button>
      )}
      {isExpanded && (
        <div className="bg-black/90 h-[117.997px] border border-[#333] rounded-[16px] p-3 flex items-center gap-2">
          <div className="flex items-center gap-2">
            {imageUrls.map((url, idx) => (
              <div
                key={idx}
                onClick={() => onSelectImage(idx)}
                className={`relative w-[94px] h-[94px] rounded-[8px] overflow-hidden cursor-pointer transition ${
                  idx === currentIndex ? "" : "opacity-70 hover:opacity-100"
                }`}
              >
                <NextImage
                  src={url}
                  alt={`photo ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                {imageUrls.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx, url);
                    }}
                    disabled={deletingIndex === idx}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 disabled:opacity-50"
                  >
                    {deletingIndex === idx ? (
                      <div className="w-3 h-3 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
                    ) : (
                      <X size={14} className="text-white" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
{isUploading ? (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0095f6]"></div>
) : (
  <div className="relative w-6 h-6 cursor-pointer">
    <UploadButton
      endpoint="postUploader"
      onClientUploadComplete={handleUploadComplete}
      onUploadBegin={onUploadBegin}
      onUploadError={onUploadError}
      appearance={{
        button: {
          background: "transparent",
          color: "transparent",
          padding: "0",
          width: "100%",
          height: "100%",
          border: "none",
        },
        container: {
          width: "100%",
          height: "100%",
        },
        allowedContent: {
          display: "none",
        },
      }}
    />
    <Plus size={24} className="text-white pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
  </div>
)}
        </div>
      )}
    </div>
  );
}
