import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useComments } from "@/src/modules/comment/hooks/useComments";

export function usePostComments(postId: number) {
  const queryClient = useQueryClient();
  const initializeModalState = () => {
    const existingState = queryClient.getQueryData<{
      selectedCommentId: number | null;
      isDeleteModalOpen: boolean;
    }>(["postCommentModal", postId]);
    
    if (!existingState) {
      queryClient.setQueryData(["postCommentModal", postId], {
        selectedCommentId: null,
        isDeleteModalOpen: false,
      });
    }
    return existingState || { selectedCommentId: null, isDeleteModalOpen: false };
  };

  const { data: modalState } = useQuery({
    queryKey: ["postCommentModal", postId],
    queryFn: initializeModalState,
    initialData: { selectedCommentId: null, isDeleteModalOpen: false },
    staleTime: Infinity,
  });

  const { selectedCommentId, isDeleteModalOpen } = modalState;
  
  const { comments, isLoading, error, addComment, deleteComment } = useComments({ postId });

  const updateModalState = (updates: Partial<{ selectedCommentId: number | null; isDeleteModalOpen: boolean }>) => {
    queryClient.setQueryData(["postCommentModal", postId], (old: any) => ({
      ...old,
      ...updates,
    }));
  };

  const handlePostComment = async (commentText: string, setCommentText: (text: string) => void) => {
    if (!commentText || !commentText.trim()) return;
    await addComment({ postId, content: commentText });
    setCommentText("");
  };

  const handleDeleteComment = async (id: number) => {
    await deleteComment(id);
    updateModalState({
      isDeleteModalOpen: false,
      selectedCommentId: null,
    });
  };

  const openDeleteModal = (id: number) => {
    updateModalState({
      selectedCommentId: id,
      isDeleteModalOpen: true,
    });
  };

  const closeDeleteModal = () => {
    updateModalState({
      selectedCommentId: null,
      isDeleteModalOpen: false,
    });
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
