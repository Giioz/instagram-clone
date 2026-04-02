"use client";

import { useState } from "react";
import { useCurrentUser } from "@/src/modules/auth/hooks/useCurrentUser";
import { PostPreviewModal } from "./PostPreviewModal";
import { PostSelectionModal } from "./PostSelectionModal";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
}: CreatePostModalProps) {
  const { data: currentUser } = useCurrentUser();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleImageSelected = (imageUrl: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageUrl)) return prev; 
      return [...prev, imageUrl];
    });
    if (selectedImages.length === 0) {
      setShowPreview(true);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedImages([]);
  };

  const handleCloseAll = () => {
    setShowPreview(false);
    setSelectedImages([]);
    onClose();
  };

  const handleAddMoreImages = (newImages: string[]) => {
    setSelectedImages((prev) => {
      const isRemoval = newImages.length < prev.length && 
                        newImages.every(url => prev.includes(url));
      
      if (isRemoval) {
        return newImages; 
      }

      const combined = [...prev, ...newImages];
      return [...new Set(combined)];
    });
  };

  return (
    <>
      <PostSelectionModal
        isOpen={isOpen && !showPreview}
        onClose={onClose}
        onImageSelected={handleImageSelected}
      />
      
      {selectedImages.length > 0 && (
        <PostPreviewModal
          isOpen={showPreview}
          onClose={handleClosePreview}
          imageUrls={selectedImages}
          onPostCreated={handleCloseAll}
          onAddMoreImages={handleAddMoreImages}
          currentUser={currentUser ? {
            username: currentUser.username,
            imageUrl: (currentUser as any).imageUrl || null,
          } : undefined}
        />
      )}
    </>
  );
}
