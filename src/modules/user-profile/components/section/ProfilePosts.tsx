import type { Post } from "@prisma/client";
import Image from "next/image";

interface ProfilePostsProps {
  posts: Post[];
}

export default function ProfilePosts({ posts }: ProfilePostsProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {posts.map((post) => (
        <div key={post.id} className="relative aspect-square">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={`Post by ${post.id}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <p className="text-gray-400 text-sm text-center p-4">
                {post.content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
