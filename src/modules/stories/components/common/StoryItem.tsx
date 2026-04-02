import type { Story, User } from "@prisma/client";
import type { JWTPayload } from "@/src/lib/auth";
import Image from "next/image";
import StoryCircle from "@/src/modules/stories/components/common/StoryCircle";
import { useStorySeen } from "@/src/modules/stories/hooks/useStorySeen";

interface GroupedStories {
  user: User;
  stories: Story[];
}

interface StoryItemProps {
  groupedStory: GroupedStories;
  onClick: () => void;
  currentUser?: JWTPayload | null;
}

export default function StoryItem({ groupedStory, onClick, currentUser }: StoryItemProps) {
  const { user, stories } = groupedStory;
  const hasMultipleStories = stories.length > 1;
  const latestStory = stories[0];
  
  const { seen, markSeen } = useStorySeen({ 
    currentUser: currentUser || null, 
    currentStory: latestStory 
  });

  const handleClick = async () => {
    await markSeen();
    onClick();
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button onClick={handleClick} className="relative group">
        <StoryCircle seen={seen}>
          <div className="relative w-full h-full">
            {hasMultipleStories && (
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {!seen && (
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]0"></div>
                )}
                <div className="absolute inset-0 bg-gray-900 rounded-full overflow-hidden">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={`${user.username}'s profile`}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {!hasMultipleStories && (
              <div className="absolute inset-0 bg-gray-900 rounded-full overflow-hidden">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={`${user.username}'s profile`}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
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
