import Image from "next/image";
import { User } from "@prisma/client";

interface CommentInputProps {
  currentUser: User | null;
  commentText: string;
  setCommentText: (text: string) => void;
  handlePostComment: () => void;
}

export default function CommentInput({ 
  currentUser, 
  commentText, 
  setCommentText, 
  handlePostComment 
}: CommentInputProps) {
  return (
    <div className="px-4 py-3 h-[55.9872px]">
      <div className="flex items-center gap-3">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400"
        />
        {commentText.trim() && (
          <button
            onClick={handlePostComment}
            className=" text-[14px] font-semibold hover:text-blue-500"
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
}
