import Image from "next/image";
import { useRelativeTime } from "@/src/modules/posts/hooks/useRelativeTime";
import { User } from "@prisma/client";

interface Post {
  id: number;
  userId: number;
  user: {
    id: number;
    username: string;
    name: string;
    imageUrl?: string | null;
  };
  isFollowing?: boolean;
  createdAt: Date;
}

interface PostHeaderProps {
  post: Post;
  currentUser: User | null;
  handleFollow: () => void;
  follow: any;
  unfollow: any;
}

export default function PostHeader({ post, currentUser, handleFollow, follow, unfollow }: PostHeaderProps) {
  const { getRelativeTime } = useRelativeTime();

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8">
          {post.user.imageUrl ? (
            <Image
              src={post.user.imageUrl}
              alt="profile"
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center text-xs font-semibold">
              {post.user.username[0].toUpperCase()}
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

      {currentUser && currentUser.id !== post.user.id && (
        <button
          onClick={handleFollow}
          disabled={follow.isPending || unfollow.isPending}
          className="text-blue-400 hover:text-blue-500 text-sm font-medium disabled:opacity-50"
        >
          {follow.isPending || unfollow.isPending
            ? "..."
            : post.isFollowing
            ? "Following"
            : "Follow"}
        </button>
      )}
    </div>
  );
}
