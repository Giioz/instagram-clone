import Image from "next/image";
import type { User, Story } from "@prisma/client";

interface UserPreviewProps {
  user: User;
  stories: Story[];
  position: "left" | "right";
}

export default function UserPreview({ user, stories, position }: UserPreviewProps) {
  if (!stories[0]?.mediaUrl) return null;

  return (
    <div 
      className={`absolute ${position === "left" ? "left-0" : "right-0"} top-0 bottom-0 w-[50%] flex items-center justify-center opacity-90`}
    >
      <div className="relative w-[173px] h-[308px] rounded-lg overflow-hidden shadow-lg">
        <Image
          src={stories[0].mediaUrl}
          alt={`${user.username}'s story`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 mb-2">
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
    </div>
  );
}
