import { useState } from "react";
import { usePostLikes } from "@/src/modules/likes/hooks/usePostLikes";
import { usePostComments } from "@/src/modules/posts-details-page/hooks/usePostComments";
import { usePostFollow } from "@/src/modules/posts-details-page/hooks/usePostFollow";
import { User } from "@prisma/client";

interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl: string | null;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
    name: string;
    imageUrl?: string | null;
  };
  _count?: {
    savedBy: number;
  };
  isSaved?: boolean;
  isFollowing?: boolean;
}

export function usePostContent(post: Post, currentUser: User | null) {
  const [commentText, setCommentText] = useState("");

  const { isLiked, isLoading: likeLoading, handleLike } = usePostLikes({ currentUser, post });
  const { handleFollow, follow, unfollow } = usePostFollow(post.user.id, post.isFollowing || false);
  
  const {
    comments,
    isLoading,
    error,
    selectedCommentId,
    isDeleteModalOpen,
    handlePostComment,
    handleDeleteComment,
    openDeleteModal,
    closeDeleteModal
  } = usePostComments(post.id);

  const postContentProps = {
    post,
    currentUser,
    comments,
    isLoading,
    error,
    isLiked,
    likeLoading,
    handleLike,
    handleFollow,
    follow,
    unfollow,
    openDeleteModal,
    commentText,
    setCommentText,
    handlePostComment: () => handlePostComment(commentText, setCommentText)
  };

  return {
    postContentProps,
    selectedCommentId,
    isDeleteModalOpen,
    handleDeleteComment,
    closeDeleteModal
  };
}
