"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useComments } from "../../hooks/useComments";
import CommentOptionsModal from "./CommentOptionsModal";
import CommentItem from "./CommentItem";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: number;
    content: string;
    imageUrl: string | null;
    user: {
      username: string;
      imageUrl?: string | null;
    };
  };
}

export default function CommentModal({ isOpen, onClose, post }: CommentModalProps) {
  const [commentText, setCommentText] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { comments, isLoading, error, addComment, deleteComment } = useComments({ postId: post.id });

  if (!isOpen) return null;

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      console.log("Posting comment:", commentText);
      await addComment(commentText);
      setCommentText("");
      console.log("Comment posted successfully");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setIsDeleteModalOpen(false);
      setSelectedCommentId(null);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleOpenDeleteModal = (commentId: number) => {
    setSelectedCommentId(commentId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCommentId(null);
  };

  const getImageUrls = (imageUrl: string | null): string[] => {
    if (!imageUrl) return [];
    try {
      const parsed = JSON.parse(imageUrl);
      return Array.isArray(parsed) ? parsed : [imageUrl];
    } catch {
      return [imageUrl];
    }
  };

  const imageUrls = getImageUrls(post.imageUrl);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black  w-full max-w-[1033px] flex overflow-hidden">
        <div className="w-[533px] h-[710.973px] bg-black flex items-center justify-center">
          {imageUrls.length > 0 ? (
            <div className="relative w-full h-full">
              <Image
                src={imageUrls[0]}
                alt="post"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No image
            </div>
          )}
        </div>
        <div className="w-[500px] flex flex-col bg-[#202328]">
          <div className="flex items-center justify-between p-4  border-b-[1px] border-[#262626]">
            <div className="flex items-center gap-3">
              <div className="relative w-[32px] h-[32px]">
                {post.user.imageUrl ? (
                  <Image
                    src={post.user.imageUrl}
                    alt={`${post.user.username}'s profile`}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-[14px] font-semibold">
                      {post.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <span className="font-semibold ">{post.user.username}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 text-[24px] font-bold">No comments yet.</p>
                <p className="text-gray-400 text-[14px] font-normal mt-1">Start the conversation.</p>
              </div>
            ) : (
            <div className="bg-[#202328] ">
              <div className="space-y-[12px]">
                {comments.map((comment) => (
                  <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    postAuthorUsername={post.user.username}
                    onDelete={handleOpenDeleteModal}
                  />
                ))}
              </div>
            </div>
            )}
            {error && (
              <div className="text-center py-4">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
          </div>
          <div className="border-t-[0.4px] border-[#2B3036] p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent border-none outline-none text-black placeholder-[#A2AAB4]"
              />
              <button
                onClick={handlePostComment}
                className="text-[#A2AAB4] text-[14px] font-semibold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <CommentOptionsModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={() => selectedCommentId && handleDeleteComment(selectedCommentId)}
      />
    </div>
  );
}
