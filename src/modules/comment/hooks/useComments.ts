import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    name: string;
    imageUrl?: string | null;
  };
}

interface UseCommentsProps {
  postId: number;
}

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`/api/comment?postId=${postId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  
  return response.json();
};

const addComment = async ({ postId, content }: { postId: number; content: string }): Promise<Comment> => {
  const response = await fetch("/api/comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId,
      content: content.trim(),
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to add comment");
  }
  
  return response.json();
};

const deleteComment = async (commentId: number): Promise<void> => {
  const response = await fetch(`/api/comment?commentId=${commentId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete comment");
  }
};

export function useComments({ postId }: UseCommentsProps) {
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: (newComment) => {
      queryClient.setQueryData(["comments", postId], (old: Comment[] = []) => [newComment, ...old]);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  return {
    comments,
    isLoading,
    error,
    addComment: addCommentMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync,
    isAddingComment: addCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
  };
}
