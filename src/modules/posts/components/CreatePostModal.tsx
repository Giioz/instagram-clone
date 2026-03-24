'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { usePostUpload } from '../hooks/usePostUpload';
import { PostUploader } from './PostUploader';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = async (mediaUrl: string) => {
    setImageUrl(mediaUrl);
  };

  const { PostUploader } = usePostUpload(handleUpload);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Content is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const postData = {
        content: content.trim(),
        imageUrls: imageUrl,
      };
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        setContent('');
        setImageUrl('');
        onClose();
        onPostCreated?.();
      } else {
        alert(result.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Post creation error:', error);
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Create new post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add photo (required)
            </label>
            
            <PostUploader />
            
            {imageUrl && (
              <div className="mt-3">
                <img 
                  src={imageUrl} 
                  alt="Post preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="mt-2 text-red-500 text-sm hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add description (optional)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 200))}
              placeholder="Write a short description..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1">
              {content.length}/200 characters
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
