import type { Story, User } from "@prisma/client";
import Image from "next/image";
import StoryCircle from "@/src/shared/StoryCircle";

interface GroupedStories {
  user: User;
  stories: Story[];
}

interface StoryItemProps {
  groupedStory: GroupedStories;
  onClick: () => void;
}

export default function StoryItem({ groupedStory, onClick }: StoryItemProps) {
  const { user, stories } = groupedStory;
  const hasMultipleStories = stories.length > 1;
  const latestStory = stories[0];

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button onClick={onClick} className="relative group">
        <StoryCircle>
          <div className="relative w-full h-full">
            {hasMultipleStories && (
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]0"></div>
                <div className="absolute inset-0 bg-gray-900 rounded-full overflow-hidden">
                  <Image
                    src={latestStory.mediaUrl}
                    alt={`${user.username}'s story`}
                    fill
                    className="rounded-full object-cover border-2 border-black"
                  />
                </div>
              </div>
            )}
            {!hasMultipleStories && (
              <Image
                src={latestStory.mediaUrl}
                alt={`${user.username}'s story`}
                fill
                className="rounded-full object-cover border-2 border-black"
              />
            )}
          </div>
        </StoryCircle>
      </button>
      <span className="text-[12px] text-gray-300 truncate max-w-15">
        {user.username}
      </span>
    </div>
  );
}
