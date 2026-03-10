import type { Story, User } from "@prisma/client";
import Image from "next/image";

interface StoryWithUser extends Story {
  user: User;
}

interface StoryItemProps {
  story: StoryWithUser;
}

export default function StoryItem({ story }: StoryItemProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full p-0.5">
        <div className="relative w-full h-full">
          <Image
            src={story.mediaUrl}
            alt={`${story.user.username}'s story`}
            fill
            className="rounded-full object-cover border-2 border-black"
          />
        </div>
      </div>
      <span className="text-xs text-gray-300 truncate max-w-15">
        {story.user.username}
      </span>
    </div>
  );
}
