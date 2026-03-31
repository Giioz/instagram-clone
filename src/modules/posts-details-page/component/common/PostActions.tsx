import { Heart } from "lucide-react";
// import SavePostButton from "@/src/modules/save-posts/components/common/SavePostButton";
import { useRelativeTime } from "@/src/modules/posts/hooks/useRelativeTime";

interface Post {
  id: number;
  createdAt: Date;
  isSaved?: boolean;
}

interface PostActionsProps {
  post: Post;
  isLiked: boolean;
  likeLoading: boolean;
  handleLike: () => void;
}

export default function PostActions({ post, isLiked, likeLoading, handleLike }: PostActionsProps) {
  const { getRelativeTime } = useRelativeTime();

  return (
    <div className="px-4 pt-3 border-t border-[#262626] h-[79.8935px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={likeLoading ? "opacity-50" : ""}
          >
            <Heart
              size={24}
              className={
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-white"
              }
            />
          </button>
          <button className="hover:opacity-70">
            <svg width="24" height="24" className="stroke-white">
              <path
                d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                strokeWidth="2"
              />
            </svg>
          </button>
          <button className="hover:opacity-70">
            <svg aria-label="Share" className="x1lliihq x1n2onr6 xyb1xck" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Share</title><path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"></line></svg>
          </button>
        </div>

        <SavePostButton
          postId={post.id}
          isSaved={post.isSaved || false}
          onSaveChange={() => {}}
        />
      </div>

      <div className="mt-1 text-xs text-gray-400">
        {getRelativeTime(new Date(post.createdAt))}
      </div>
    </div>
  );
}
