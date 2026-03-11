import type { Story, User } from "@prisma/client";
import Image from "next/image";
import StoryCircle from "@/src/shared/StoryCircle";

interface StoryWithUser extends Story {
  user: User;
}

interface StoryItemProps {
  story: StoryWithUser;
}

export default function StoryItem({ story }: StoryItemProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <StoryCircle>
        <div className="relative w-full h-full">
          <Image
            src={story.mediaUrl}
            alt={`${story.user.username}'s story`}
            fill
            className="rounded-full object-cover border-2 border-black"
          />
        </div>
      </StoryCircle>
      <span className="text-[12px] text-gray-300 truncate max-w-15">
        {story.user.username}
      </span>
    </div>
  );
}
