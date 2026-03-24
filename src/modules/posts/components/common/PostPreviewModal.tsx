"use client";

import { useState } from "react";
import { X } from "lucide-react";
import NextImage from "next/image";

// Custom event for post creation
const POST_CREATED_EVENT = 'post-created';

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onPostCreated?: () => void;
}

export function PostPreviewModal({ 
  isOpen, 
  onClose, 
  imageUrl,
  onPostCreated 
}: PostPreviewModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        content: content.trim(),
        imageUrls: imageUrl,
      };

      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        setContent("");
        onClose();
        onPostCreated?.();
        
        // Refresh the posts feed to show the new post
        if ((window as any).refreshPosts) {
          (window as any).refreshPosts();
        }
      } else {
        alert(result.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      alert("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-white">
      <div className="bg-white w-full max-w-[540px] rounded-[30px] shadow-2xl flex flex-col overflow-hidden">
        <div className="h-[43px] flex items-center justify-center bg-[#202328]">
          <h2 className="text-white font-semibold text-base">Create new post</h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        <div className="h-[70vh] bg-[#202328] flex flex-col">
          <div className="flex-1 bg-black flex items-center justify-center p-4 min-h-0">
            <div className="relative w-full h-full max-w-lg max-h-[50vh]">
              <NextImage
                src={imageUrl}
                alt="Preview"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 500px"
                priority
              />
            </div>
          </div>
          
          <div className="p-4   border-t border-[#363636]">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 200))}
              className="w-full p-3 border border-[#363636] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1">
              {content.length}/200 characters
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-[#363636] bg-[#202328] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#0095f6] text-white rounded-lg hover:bg-[#0081d6] disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}
