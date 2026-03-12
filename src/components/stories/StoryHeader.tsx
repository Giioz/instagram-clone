import { X, Trash2 } from "lucide-react";
import type { User, Story } from "@prisma/client";
import type { JWTPayload } from "@/src/library/auth";

interface StoryHeaderProps {
  currentUser: User;
  currentStory: Story;
  stories: Story[];
  currentStoryIndex: number;
  progress: number;
  user: JWTPayload | null;
  onClose: () => void;
  onDeleteStory: () => void;
}

export default function StoryHeader({
  currentUser,
  currentStory,
  stories,
  currentStoryIndex,
  progress,
  user,
  onClose,
  onDeleteStory,
}: StoryHeaderProps) {
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent">
       <div className="flex gap-1 mb-3">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width:
                  index < currentStoryIndex
                    ? "100%"
                    : index === currentStoryIndex
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {currentUser?.username?.charAt(0)?.toUpperCase() || ""}
              </span>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold">{currentUser?.username || ""}</p>
          </div>
          <p className="text-gray-300 text-sm">
            {getTimeAgo(new Date(currentStory.createdAt))}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user && parseInt(user.userId) === currentStory.userId && (
            <button 
              onClick={onDeleteStory}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition">
            <X size={24} />
          </button>
        </div>
      </div>

     
    </div>
  );
}
