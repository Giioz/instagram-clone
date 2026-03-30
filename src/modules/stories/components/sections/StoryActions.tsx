import { Heart } from "lucide-react";
import type { User, Story } from "@prisma/client";
import type { JWTPayload } from "@/src/lib/auth";
import { useStoryLikes } from "../../hooks/useStoryLikes";

interface StoryActionsProps {
  currentUser: User;
  currentStory: Story | null;
  user: JWTPayload | null;
}

export default function StoryActions({
  currentUser,
  currentStory,
  user,
}: StoryActionsProps) {
  const { isLiked, isLoading, error, handleLike } = useStoryLikes({
    viewer: user,
    currentStory,
  });

  if (!currentStory) return null;

  if (user && parseInt(user.userId) === currentStory.userId) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-900 rounded-b-lg">
      {error && <div className="text-red-500 text-xs mb-2">{error}</div>}

      <div className="flex items-center gap-3">
        <div className=" text-white bg-transparent border border-white rounded-full  ">
          <input
            type="text"
            placeholder={`Reply to ${currentUser?.username || "user"}...`}
            className="w-69.75 h-11 placeholder-white outline-none text-sm px-4"
          />
        </div>
        <button
          type="button"
          onClick={handleLike}
          disabled={isLoading}
          className={`bg-transparent transition-colors ${
            isLoading ? "opacity-50" : ""
          } ${isLiked ? "text-red-500" : "text-white"}`}
        >
          <Heart
            size={24}
            className={`transition-colors ${isLiked ? "fill-red-500" : ""}`}
          />
        </button>
        <button className="text-white hover:scale-110 transition-transform">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
