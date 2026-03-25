import { useState, useEffect } from "react";

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

export function useComments({ postId }: UseCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/comment?postId=${postId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  const addComment = async (content: string) => {
    try {
      setError(null);
      
      console.log("Sending comment request:", { postId, content });
      
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
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to add comment");
      }
      
      const newComment = await response.json();
      console.log("New comment received:", newComment);
      setComments(prev => [newComment, ...prev]);
      
      return newComment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  const deleteComment = async (commentId: number) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/comment?commentId=${commentId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete comment");
      }
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment,
  };
}
