import Image from "next/image";
import type { User, Story } from "@prisma/client";

interface StoryCardProps {
  user: User;
  stories: Story[];
  onClick?: () => void;
}

export default function StoryCard({ user, stories, onClick }: StoryCardProps) {
  if (!stories[0]?.mediaUrl) return null;

  return (
    <div
      className="relative w-43.25 h-77 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:opacity-100 transition-all duration-300 ease-in-out transform hover:scale-105"
      onClick={onClick}
    >
      <Image
        src={stories[0].mediaUrl}
        alt={`${user.username}'s story`}
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full p-0.5 bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] mb-2">
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              {user?.username?.charAt(0)?.toUpperCase() || ""}
            </span>
          </div>
        </div>

        <p className="text-white text-base text-center font-medium">
          {user?.username}
        </p>
      </div>
    </div>
  );
}
