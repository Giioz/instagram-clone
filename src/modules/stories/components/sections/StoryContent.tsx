import Image from "next/image";
import type { User, Story } from "@prisma/client";

interface StoryContentProps {
  currentStory: Story;
  currentUser: User;
  onStoryClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function StoryContent({ currentStory, currentUser, onStoryClick }: StoryContentProps) {
  return (
    <>
      <div
        className="w-full h-full flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out"
        onClick={onStoryClick}
      >
        <div className="relative w-full h-full">
          {currentStory.mediaUrl && (
            <Image
              src={currentStory.mediaUrl}
              alt={`${currentUser?.username || "user"}'s story`}
              fill
              className="object-contain transition-opacity duration-300 ease-in-out"
            />
          )}
        </div>
      </div>
    </>
  );
}
