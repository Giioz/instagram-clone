"use client";

import { useFollowStats } from "@/src/modules/follow/hooks/queries/useFollowStats";
import FollowButton from "@/src/modules/follow/components/FollowButton";
import MessageButton from "@/src/modules/messages/components/common/MessageButton";
import { useCurrentUser } from "@/src/modules/auth/hooks/useCurrentUser";
import { useProfileStories } from "@/src/modules/user-profile/hooks/useProfileStories";
import StoryViewer from "@/src/modules/stories/components/sections/StoryViewer";
import type { UserProfile } from "@/src/modules/user-profile/types";
import Link from "next/link";

interface ProfileHeaderProps {
  user: UserProfile;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { data: currentUser } = useCurrentUser();
  const { data: followStats, isLoading } = useFollowStats(user.id.toString());
  const { selectedUserIndex, handleAvatarClick, handleCloseStoryViewer, groupedStories } = useProfileStories({ user });

  return (
    <div className="w-full flex justify-center mb-12">
      <div className="max-w-3xl w-full flex flex-col gap-6">
        <div className="flex items-center gap-8">
          <div className="shrink-0">
            <button
              onClick={handleAvatarClick}
              className="relative group hover:opacity-90 transition-opacity"
            >
              <div className="w-37.5 h-37.5 rounded-full bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)] p-1">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[24px] font-semibold">{user.username}</h1>
              <h2 className="text-[14px] font-semibold">{user.name}</h2>
            </div>
            <div className="flex gap-8 text-sm">
              <div>
                <span className="text-[14px] font-semibold">
                  {user._count.posts}
                </span>{" "}
                posts
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
          {user.isOwnProfile ? (
            <>
              <Link
                href="/profile/edit"
                className="w-[329.93px] h-11 bg-gray-700 text-white text-sm font-medium rounded-xl hover:bg-gray-600 transition flex items-center justify-center"
              >
                Edit Profile
              </Link>
              <button className="w-[329.93px] h-11 bg-gray-700 text-white text-sm font-medium rounded-xl hover:bg-gray-600 transition">
                View Archive
              </button>
            </>
          ) : (
            <>
              <FollowButton
                userId={user.id.toString()}
                isFollowing={followStats?.isFollowing || false}
                isFollowedBy={followStats?.isFollowedBy || false}
                currentUser={currentUser}
                profileUsername={user.username}
              />

              <MessageButton />
            </>
          )}
        </div>
      </div>
      {selectedUserIndex !== null && (
        <StoryViewer
          allGroupedStories={groupedStories}
          currentUserIndex={selectedUserIndex}
          isOpen={selectedUserIndex !== null}
          onClose={handleCloseStoryViewer}
        />
      )}
    </div>
  );
}
