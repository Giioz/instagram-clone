import { MoreHorizontal, Heart } from "lucide-react";
import Image from "next/image";
import { useRelativeTime } from "../../../posts/hooks/useRelativeTime";
import { useCommentLike } from "../../hooks/useCommentLike";
import { useCurrentUser } from "../../../auth/hooks/useCurrentUser";

interface CommentItemProps {
  comment: {
    id: number;
    content: string;
    createdAt: string;
    user: {
      username: string;
      imageUrl?: string | null;
    };
    _count?: {
      likes: number;
    };
  };
  postAuthorUsername: string;
  onDelete: (commentId: number) => void;
}

export default function CommentItem({ comment, postAuthorUsername, onDelete }: CommentItemProps) {
  const { getRelativeTime } = useRelativeTime();
  const { data: currentUser } = useCurrentUser();
  const { likes, isLiked, isLoading, toggleLike } = useCommentLike({
    commentId: comment.id,
    initialLikes: comment._count?.likes || 0,
  });

  const canDelete = currentUser?.username === comment.user.username || currentUser?.username === postAuthorUsername;

  return (
    <div className="flex gap-3 items-start group">
      <div className="relative w-8 h-8 flex-shrink-0">
        {comment.user.imageUrl ? (
          <img
            src={comment.user.imageUrl}
            alt={`${comment.user.username}'s profile`}
            className="rounded-full object-cover w-full h-full border-[0.5px] border-gray-800"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-300 text-xs font-semibold">
              {comment.user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-white text-[14px] leading-tight hover:opacity-70 cursor-pointer">
            {comment.user.username}
          </span>
          <span className="text-white text-[14px] leading-tight">
            {comment.content}
          </span>
        </div>
        
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[#A8A8A8] text-[12px] font-normal">
            {getRelativeTime(new Date(comment.createdAt))}
          </span>
          <button className="text-[#A8A8A8] text-[12px] font-semibold hover:text-white transition-colors">
            Reply
          </button>
          {canDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="opacity-0 group-hover:opacity-100 text-[12px] font-semibold hover:text-white p-1 transition-opacity duration-200 cursor-pointer"
            >
              <MoreHorizontal size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center pt-1">
        <button 
          onClick={toggleLike}
          disabled={isLoading}
          className={`flex items-center gap-1 transition-colors ${
            isLiked ? "text-red-500" : "text-[#A8A8A8] hover:text-red-500"
          }`}
        >
          <Heart size={12} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
