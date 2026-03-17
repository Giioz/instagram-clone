import { X, Trash2 } from "lucide-react";
import Link from "next/link";
import type { User, Story } from "@prisma/client";
import type { JWTPayload } from "@/src/lib/auth";
import { useTimeAgo } from "@/src/modules/stories/hooks/useTimeAgo";

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
  const { getTimeAgo } = useTimeAgo();

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-linear-to-b from-black/70 to-transparent max-md:p-6">
      <div className="flex gap-1 mb-3 max-md:mb-4">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden max-md:h-2"
          >
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
        <div className="flex items-center gap-3 max-md:gap-4">
          <Link 
            href={`/profile/${currentUser?.username || ""}`}
            className="w-10 h-10 rounded-full bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] p-0.5 max-md:w-12 max-md:h-12 hover:opacity-80 transition cursor-pointer"
          >
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-white text-sm font-semibold max-md:text-base">
                {currentUser?.username?.charAt(0)?.toUpperCase() || ""}
              </span>
            </div>
          </Link>
          <div>
            <p className="text-white font-semibold max-md:text-lg">
              {currentUser?.username || ""}
            </p>
          </div>
          <p className="text-gray-300 text-sm max-md:text-base">
            {getTimeAgo(new Date(currentStory.createdAt))}
          </p>
        </div>

        <div className="flex items-center gap-2 max-md:gap-3">
          {user && parseInt(user.userId) === currentStory.userId && (
            <button
              onClick={onDeleteStory}
              className="text-white hover:bg-white/20 rounded-full p-2 transition max-md:p-3"
            >
              <Trash2 size={20} className="max-md:size-6" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition max-md:p-3"
          >
            <X size={24} className="max-md:size-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
