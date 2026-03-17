import { X, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { User, Story } from "@prisma/client";
import type { JWTPayload } from "@/src/lib/auth";
import { useTimeAgo } from "@/src/modules/stories/hooks/useTimeAgo";
import { useState } from "react";

interface StoryHeaderProps {
  currentUser: User;
  currentStory: Story;
  stories: Story[];
  currentStoryIndex: number;
  progress: number;
  user: JWTPayload | null;
  onClose: () => void;
  onDeleteStory: () => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
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
  isPaused,
  setIsPaused,
}: StoryHeaderProps) {
  const { getTimeAgo } = useTimeAgo();
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent max-md:p-6">
      <div className="flex gap-[1.5px] mb-3 mt-[16px] max-md:mb-4">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden"
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

            <p className="text-gray-300 text-[14px] max-md:text-base">
              {getTimeAgo(new Date(currentStory.createdAt))}
            </p>
          </div>
        </div>
        <div className="flex items-center ">

          {/* MUTE */}
          {/* <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-white p-2 transition max-md:p-3"
          >
            {isMuted ? (
              <svg aria-label="Audio is muted" className="x1lliihq x1n2onr6 x9bdzbf" fill="currentColor" height="16" role="img" viewBox="0 0 48 48" width="16"><title>Audio is muted</title><path clip-rule="evenodd" d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z" fill-rule="evenodd"></path></svg>
            ) : (
              <svg aria-label="Audio is playing" className="x1lliihq x1n2onr6 x9bdzbf" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16"><title>Audio is playing</title><path d="M16.636 7.028a1.5 1.5 0 1 0-2.395 1.807 5.365 5.365 0 0 1 1.103 3.17 5.378 5.378 0 0 1-1.105 3.176 1.5 1.5 0 1 0 2.395 1.806 8.396 8.396 0 0 0 1.71-4.981 8.39 8.39 0 0 0-1.708-4.978Zm3.73-2.332A1.5 1.5 0 1 0 18.04 6.59 8.823 8.823 0 0 1 20 12.007a8.798 8.798 0 0 1-1.96 5.415 1.5 1.5 0 0 0 2.326 1.894 11.672 11.672 0 0 0 2.635-7.31 11.682 11.682 0 0 0-2.635-7.31Zm-8.963-3.613a1.001 1.001 0 0 0-1.082.187L5.265 6H2a1 1 0 0 0-1 1v10.003a1 1 0 0 0 1 1h3.265l5.01 4.682.02.021a1 1 0 0 0 1.704-.814L12.005 2a1 1 0 0 0-.602-.917Z"></path></svg>
            )}
          </button> */}

          {/* PAUSE */}
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="text-white  p-2 transition max-md:p-3"
          >
            {isPaused ? (
              <svg aria-label="Play" className="x1lliihq x1n2onr6 xq3z1fi" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16"><title>Play</title><path d="M5.888 22.5a3.46 3.46 0 0 1-1.721-.46l-.003-.002a3.451 3.451 0 0 1-1.72-2.982V4.943a3.445 3.445 0 0 1 5.163-2.987l12.226 7.059a3.444 3.444 0 0 1-.001 5.967l-12.22 7.056a3.462 3.462 0 0 1-1.724.462Z"></path></svg>
            ) : (
              <svg aria-label="Pause" className="x1lliihq x1n2onr6 xq3z1fi" fill="currentColor" height="16" role="img" viewBox="0 0 48 48" width="16"><title>Pause</title><path d="M15 1c-3.3 0-6 1.3-6 3v40c0 1.7 2.7 3 6 3s6-1.3 6-3V4c0-1.7-2.7-3-6-3zm18 0c-3.3 0-6 1.3-6 3v40c0 1.7 2.7 3 6 3s6-1.3 6-3V4c0-1.7-2.7-3-6-3z"></path></svg>
            )}
          </button>
          <button className="text-white hover:bg-white/20 rounded-full p-2 transition max-md:p-3">
            <MoreHorizontal size={20} className="max-md:size-6" />
          </button>
          {user && parseInt(user.userId) === currentStory.userId && (
            <button
              onClick={onDeleteStory}
              className="text-white hover:bg-red-500/30 rounded-full p-2 transition max-md:p-3"
            >
              <Trash2 size={20} className="max-md:size-6" />
            </button>
          )}

          {/* CLOSE */}
          {/* <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition max-md:p-3"
          >
            <X size={22} className="max-md:size-7" />
          </button> */}
        </div>
      </div>
    </div>
  );
}