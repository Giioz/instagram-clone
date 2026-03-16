"use client";
import { useFollowStats } from "@/src/modules/follow/hooks/queries/useFollowStats";
import FollowButton from "@/src/modules/follow/components/FollowButton";
import MessageButton from "@/src/modules/follow/components/MessageButton";
import { useCurrentUser } from "@/src/modules/auth/hooks/useCurrentUser";
import type { UserProfile } from "@/src/modules/user-profile/types";

interface ProfileHeaderProps {
  user: UserProfile;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { data: currentUser } = useCurrentUser();
  const { data: followStats, isLoading } = useFollowStats(user.id.toString());

  return (
    <div className="w-full flex justify-center mb-12">
      <div className="max-w-3xl w-full flex flex-col gap-6">
        <div className="flex items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-[150px] h-[150px] rounded-full bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)] p-1">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <h1 className="text-[24px] font-semibold">{user.username}</h1>
              <h2 className="text-[14px] font-semibold">{user.name}</h2>
            </div>
            <div className="flex gap-8 text-sm">
              <div>
                <span className="text-[14px] font-semibold">{user._count.posts}</span> posts
              </div>

              <div>
                <span className="text-[14px] font-semibold">
                  {isLoading ? "0" : followStats?.followersCount || 0}
                </span>{" "}
                followers
              </div>

              <div>
                <span className="text-[14px] font-semibold">
                  {isLoading ? "0" : followStats?.followingCount || 0}
                </span>{" "}
                following
              </div>
            </div>

          </div>
        </div>

        <div className="flex gap-2">
          <FollowButton
            userId={user.id.toString()}
            isFollowing={followStats?.isFollowing || false}
            currentUser={currentUser}
            profileUsername={user.username}
          />

          <MessageButton />
        </div>

      </div>
    </div>
  );
}
