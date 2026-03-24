import { Heart, Send } from "lucide-react";
import type { User, Story } from "@prisma/client";
import { useStoryLikes } from "@/src/modules/likes/hooks/useStoryLikes";


interface StoryLike {
  id: number;
  userId: number;
  storyId: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}

interface StoryActionsProps {
  currentUser: User;
  currentStory: Story | null;
}

export default function StoryActions({ currentUser, currentStory }: StoryActionsProps) {
  const { isLiked, isLoading, likes, error, handleLike } = useStoryLikes(currentUser, currentStory);

  if (!currentStory) return null;

  return (
    <div className="p-4 bg-gray-900 rounded-b-lg">
      {error && (
        <div className="text-red-500 text-xs mb-2">{error}</div>
      )}
      
      <div className="flex items-center gap-3 mb-3">
        <button 
          onClick={handleLike}
          disabled={isLoading}
          className={`text-white hover:scale-110 transition-transform ${isLoading ? 'opacity-50' : ''}`}
        >
          <Heart 
            size={28} 
            className={isLiked ? 'fill-red-500 text-red-500' : ''} 
          />
        </button>
        <button className="text-white hover:scale-110 transition-transform">
          <Send size={28} />
        </button>
      </div>
      
      {likes.length > 0 && (
        <>
          <div className="text-white text-sm mb-3">
            <span className="font-semibold">{likes.length}</span> 
            {likes.length === 1 ? ' like' : ' likes'}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {likes.slice(0, 10).map((like) => (
              <div 
                key={like.id} 
                className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {like.user.username?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <span className="text-white text-xs">{like.user.username}</span>
              </div>
            ))}
            {likes.length > 10 && (
              <div className="text-white text-xs bg-white/10 rounded-full px-3 py-1">
                +{likes.length - 10} more
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
        <input
          type="text"
          placeholder={`Reply to ${currentUser?.username || "user"}...`}
          className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm"
        />
      </div>
    </div>
  );
}
