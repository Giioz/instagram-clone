'use client';

import { useState } from 'react';
import { SavePostService } from '../../service/savePost-service';

interface SavePostButtonProps {
  postId: number;
  isSaved?: boolean;
  onSaveChange?: (isSaved: boolean) => void;
}

export default function SavePostButton({ postId, isSaved = false, onSaveChange }: SavePostButtonProps) {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (saved) {
        await SavePostService.unsavePost(postId);
      } else {
        await SavePostService.savePost(postId);
      }

      const newSavedState = !saved;
      setSaved(newSavedState);
      onSaveChange?.(newSavedState);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`p-1 transition-colors ${saved ? 'text-blue-500' : 'hover:text-gray-300'} cursor-pointer`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon>
      </svg>
    </button>
  );
}