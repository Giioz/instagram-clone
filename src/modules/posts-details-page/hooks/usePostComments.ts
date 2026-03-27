import { useState } from "react";
import { useComments } from "@/src/modules/comment/hooks/useComments";

export function usePostComments(postId: number) {
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { comments, isLoading, error, addComment, deleteComment } = useComments({ postId });

  const handlePostComment = async (commentText: string, setCommentText: (text: string) => void) => {
    if (!commentText.trim()) return;
    await addComment(commentText);
    setCommentText("");
  };

  const handleDeleteComment = async (id: number) => {
    await deleteComment(id);
    setIsDeleteModalOpen(false);
    setSelectedCommentId(null);
  };

  const openDeleteModal = (id: number) => {
    setSelectedCommentId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCommentId(null);
    setIsDeleteModalOpen(false);
  };

  return {
    comments,
    isLoading,
    error,
    selectedCommentId,
    isDeleteModalOpen,
    handlePostComment,
    handleDeleteComment,
    openDeleteModal,
    closeDeleteModal
  };
}
