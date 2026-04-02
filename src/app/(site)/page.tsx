"use client";

import Stories from "@/src/modules/stories/components/sections/Stories";
import PostsFeed from "@/src/modules/posts/components/section/PostsFeed";
import { SuggestedForYou } from "@/src/modules/suggested-for-you";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen ">
      <div className="flex flex-1 justify-center">
        <div className="mx-auto flex gap-8 p-5 lg:gap-16">
          <div className="w-full max-w-[630px] shrink-0 lg:w-[630px]">
            <Stories />
            <div className="mt-6">
              <PostsFeed />
            </div>
          </div>
          <div className="hidden w-[319px] shrink-0 lg:block">
            <div className="sticky top-10">
              {user && <SuggestedForYou />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}