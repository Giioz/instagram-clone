"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";

interface SavePostButtonProps {
  postId: number;
  isSaved?: boolean;
  onSaveChange?: (isSaved: boolean) => void;
}

export default function SavePostButton({ 
  postId, 
  isSaved = false, 
  onSaveChange 
}: SavePostButtonProps) {
  const [saved, setSaved] = useState(isSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // TODO: Implement actual save/unsave API call
      // For now, just toggle the state
      const newSavedState = !saved;
      setSaved(newSavedState);
      onSaveChange?.(newSavedState);
      
      // Mock API call - replace with actual implementation
      console.log(`${newSavedState ? 'Saving' : 'Unsaving'} post ${postId}`);
    } catch (error) {
      console.error('Error toggling save state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`bg-transparent transition-all flex items-center justify-center ${
        isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${
        saved
          ? "text-yellow-500 hover:text-yellow-600"
          : "text-white hover:text-yellow-500"
      }`}
    >
      <Bookmark
        size={24}
        className={`transition-colors ${
          saved ? "fill-yellow-500" : ""
        }`}
      />
    </button>
  );
}
