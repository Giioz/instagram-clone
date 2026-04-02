"use client";

import Link from "next/link";
import type { SuggestedUser } from "../../types";

interface SuggestedUserCardProps {
  user: SuggestedUser;
  following?: boolean;
  busy?: boolean;
  onFollow?: (userId: number) => void;
}

export function SuggestedUserCard({
  user,
  following = false,
  busy = false,
  onFollow,
}: SuggestedUserCardProps) {
  const handleFollow = () => {
    if (!following && !busy && onFollow) {
      onFollow(user.id);
    }
  };

  const firstMutual = user.mutualPreview?.[0];

  return (
    <div className="flex items-center justify-between py-2">
      <Link
        href={`/profile/${encodeURIComponent(user.username)}`}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <img
          src={user.imageUrl || "/default-avatar.png"}
          alt={user.username}
          className="h-[44px] w-[44px] rounded-full object-cover bg-[#262626]"
        />
        
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold ">{user.username}</span>
          <div className="flex items-center gap-1.5 text-xs text-[#a8a8a8]">
            {firstMutual && (
              <img
                src={firstMutual.imageUrl || "/default-avatar.png"}
                alt=""
                className="h-[14px] w-[14px] rounded-full object-cover"
              />
            )}
            <span>
              {firstMutual
                ? `Followed by ${firstMutual.username} + ${user.mutualCount - 1} more`
                : `${user.mutualCount} mutual connections`}
            </span>
          </div>
        </div>
      </Link>
      <button
        onClick={handleFollow}
        disabled={busy}
        className={`text-[12px] font-semibold transition-opacity hover:opacity-70 ${
          following ? "text-[#a8a8a8]" : "text-[rgb(112,141,255)]"
        } ${busy ? "opacity-50" : ""}`}
      >
        {following ? "Following" : busy ? "..." : "Follow"}
      </button>
    </div>
  );
}
