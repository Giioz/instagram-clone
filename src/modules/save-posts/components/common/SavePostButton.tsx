'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
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
      className={`hover:text-gray-300 transition ${saved ? 'text-blue-500' : ''}`}
      onClick={handleSave}
      disabled={loading}
    >
      <Bookmark size={22} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
