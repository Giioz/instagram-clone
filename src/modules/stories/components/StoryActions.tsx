import { Heart, Send } from "lucide-react";
import type { User } from "@prisma/client";

interface StoryActionsProps {
  currentUser: User;
}

export default function StoryActions({ currentUser }: StoryActionsProps) {
  return (
    <div className="p-4 bg-gray-900 rounded-b-lg flex items-center gap-3">
      <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
        <input
          type="text"
          placeholder={`Reply to ${currentUser?.username || "user"}...`}
          className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="text-white hover:scale-110 transition-transform">
          <Heart size={28} />
        </button>
        <button className="text-white hover:scale-110 transition-transform">
          <Send size={28} />
        </button>
      </div>
    </div>
  );
}
