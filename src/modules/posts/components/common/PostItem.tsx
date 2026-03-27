"use client";

import { Heart, MessageCircle, Send } from "lucide-react";
import SavePostButton from "@/src/modules/save-posts/components/common/SavePostButton";
import { usePostLike } from "@/src/modules/posts-details-page/hooks/usePostLike";
import { useRelativeTime } from "../../hooks/useRelativeTime";
import { useFollowMutation } from "@/src/modules/follow/hooks/mutations/useFollowMutation";
import { User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PostOptionsModal from "./PostOptionsModal";
import CommentModal from "@/src/modules/comment/component/common/CommentModal";

interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl: string | null;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
    name: string;
    imageUrl?: string | null;
  };
  _count?: {
    savedBy: number;
  };
  isSaved?: boolean;
  isFollowing?: boolean;
}

interface PostItemProps {
  post: Post;
  currentUser: User | null;
}

export default function PostItem({ post, currentUser }: PostItemProps) {
  const router = useRouter();
  const { likes, isLiked, isLoading, toggleLike } = usePostLike({
    postId: post.id,
    initialLikes: post.likes,
  });
  const { getRelativeTime } = useRelativeTime();
  const { follow, unfollow } = useFollowMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleFollow = async () => {
    if (post.isFollowing) {
      await unfollow.mutateAsync({ followingId: post.user.id.toString() });
    } else {
      await follow.mutateAsync({ followingId: post.user.id.toString() });
    }
  };

  const handleUnfollowFromModal = () => {
    if (post.isFollowing) {
      unfollow.mutateAsync({ followingId: post.user.id.toString() });
    }
    setIsModalOpen(false);
  };

  const handleAddToFavorites = () => {
    console.log("Add to favorites:", post.id);
    setIsModalOpen(false);
  };

  const handleGoToPost = () => {
    router.push(`/posts/${post.id}`);
    setIsModalOpen(false);
  };

  const handleAboutAccount = () => {
    console.log("About account:", post.user.username);
    window.location.href = `/${post.user.username}`;
    setIsModalOpen(false);
  };

  const getImageUrls = (imageUrl: string | null): string[] => {
    if (!imageUrl) return [];
    try {
      const parsed = JSON.parse(imageUrl);
      return Array.isArray(parsed) ? parsed : [imageUrl];
    } catch {
      return [imageUrl];
    }
  };

  const imageUrls = getImageUrls(post.imageUrl);

  return (
    <div className="text-white rounded-lg overflow-hidden w-117.5 mx-auto">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            {post.user.imageUrl ? (
              <Image
                src={post.user.imageUrl}
                alt={`${post.user.username}'s profile`}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {post.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{post.user.username}</span>
            <span className="text-gray-400 text-[14px]">
              • {getRelativeTime(new Date(post.createdAt))}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentUser && currentUser.id !== post.user.id && (
            <button
              onClick={handleFollow}
              disabled={follow.isPending || unfollow.isPending}
              className="text-blue-400 hover:text-blue-500 transition-colors cursor-pointer text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {follow.isPending || unfollow.isPending ? (
                <span className="flex items-center gap-1">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {post.isFollowing ? "Following" : "Follow"}
                </span>
              ) : post.isFollowing ? (
                "Following"
              ) : (
                "Follow"
              )}
            </button>
          )}
          <button onClick={() => setIsModalOpen(true)}>
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="6" cy="12" r="1.5" />
              <circle cx="18" cy="12" r="1.5" />
            </svg>
          </button>
        </div>
      </div>
      {imageUrls.length > 0 && (
        <div className="w-full object-cover ">
          {imageUrls.length === 1 ? (
            <div className="w-full max-h-157.5 rounded-sm border border-[#262626] overflow-hidden flex justify-center">
              <Image
                src={imageUrls[0]}
                alt="post"
                width={800}
                height={800}
                className="w-full h-auto object-contain"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-0.5">
              {imageUrls.slice(0, 4).map((url, index) => (
                <div
                  key={index}
                  className="relative w-full h-75 overflow-hidden"
                >
                  <Image
                    src={url}
                    alt={`post ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {index === 3 && imageUrls.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        +{imageUrls.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="px-3 py-3 min-h-21.25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={toggleLike}
                disabled={isLoading}
                className={`bg-transparent transition-all flex items-center justify-center ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } ${
                  isLiked
                    ? "text-red-500 hover:text-red-600"
                    : " hover:text-red-500"
                }`}
              >
                <Heart
                  size={24}
                  className={`transition-colors ${
                    isLiked ? "fill-red-500" : ""
                  }`}
                />
              </button>

              <div className="text-[16px] font-semibold ">{likes}</div>
            </div>

            <button
              onClick={() => setIsCommentModalOpen(true)}
              className="hover:text-gray-300 transition"
            >
              <svg
                aria-label="Comment"
                fill="none"
                height="24"
                width="24"
                viewBox="0 0 24 24"
                className="stroke-current"
              >
                <path
                  d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="hover:text-gray-300 transition">
              <svg
                aria-label="Share"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-current"
              >
                <title>Share</title>

                <path
                  d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                <line
                  x1="7.488"
                  y1="12.208"
                  x2="15.515"
                  y2="7.641"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <SavePostButton
            postId={post.id}
            isSaved={post.isSaved}
            onSaveChange={(isSaved) => {}}
          />
        </div>

        <p className=" mt-0.5 line-clamp-2">
          <span className="font-semibold  mr-2">{post.user.username}</span>
          <span className="font-normal">{post.content}</span>
        </p>
      </div>

      <PostOptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUnfollow={handleUnfollowFromModal}
        onAddToFavorites={handleAddToFavorites}
        onGoToPost={handleGoToPost}
        onAboutAccount={handleAboutAccount}
        showUnfollow={
          !!(currentUser && currentUser.id !== post.user.id && post.isFollowing)
        }
        user={post.user}
      />

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={post}
      />
    </div>
  );
}
