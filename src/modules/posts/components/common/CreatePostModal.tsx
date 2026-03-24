"use client";

import { useState } from "react";
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
  onPostCreated,
}: CreatePostModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleImageSelected = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedImage(null);
  };

  const handleCloseAll = () => {
    setShowPreview(false);
    setSelectedImage(null);
    onClose();
  };

  return (
    <>
      <PostSelectionModal
        isOpen={isOpen && !showPreview}
        onClose={onClose}
        onImageSelected={handleImageSelected}
      />
      
      {selectedImage && (
        <PostPreviewModal
          isOpen={showPreview}
          onClose={handleClosePreview}
          imageUrl={selectedImage}
          onPostCreated={handleCloseAll}
        />
      )}
    </>
  );
}
