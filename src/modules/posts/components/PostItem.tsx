"use client";

import { Heart, MessageCircle, Send } from "lucide-react";
import SavePostButton from "@/src/modules/save-posts/components/common/SavePostButton";
import { usePostLikes } from "@/src/modules/likes/hooks/usePostLikes";

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
  };
  _count?: {
    savedBy: number;
  };
  isSaved?: boolean;
}

interface PostItemProps {
  post: Post;
  currentUser: any;
}

export default function PostItem({ post, currentUser }: PostItemProps) {
  const { isLiked, isLoading, handleLike, likes } = usePostLikes(
    currentUser,
    post,
  );
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
    <div className="text-white rounded-lg overflow-hidden w-[470px] mx-auto">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full" />
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{post.user.username}</span>
            <span className="text-gray-400">
              • {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">•••</button>
      </div>
      {imageUrls.length > 0 && (
        <div className="w-full">
          {imageUrls.length === 1 ? (
            <img
              src={imageUrls[0]}
              alt="post"
              className="w-full rounded-[4px] object-cover max-h-[600px]"
            />
          ) : imageUrls.length === 2 ? (
            <div className="grid grid-cols-2 gap-0.5">
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`post ${index + 1}`}
                  className="w-full object-cover max-h-[300px]"
                />
              ))}
            </div>
          ) : imageUrls.length === 3 ? (
            <div className="grid grid-cols-2 gap-0.5">
              <img
                src={imageUrls[0]}
                alt="post 1"
                className="w-full object-cover max-h-[400px] row-span-2"
              />
              <div className="grid grid-rows-2 gap-0.5">
                {imageUrls.slice(1).map((url, index) => (
                  <img
                    key={index + 1}
                    src={url}
                    alt={`post ${index + 2}`}
                    className="w-full object-cover max-h-[200px]"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-0.5">
              {imageUrls.slice(0, 4).map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`post ${index + 1}`}
                    className="w-full object-cover max-h-[300px]"
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

      <div className="px-3 py-3 min-h-[85px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`bg-transparent transition ${isLoading ? "opacity-50" : ""} ${isLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"}`}
            >
              <Heart size={22} className={isLiked ? "fill-red-500" : ""} />
            </button>

            <button className="hover:text-gray-300 transition">
              <MessageCircle size={22} />
            </button>

            <button className="hover:text-gray-300 transition">
              <Send size={22} />
            </button>
          </div>

          <SavePostButton
            postId={post.id}
            isSaved={post.isSaved}
            onSaveChange={(isSaved) => {}}
          />
        </div>

        <p className="text-sm font-semibold mt-1">{likes.length} likes</p>

        <p className="text-sm mt-0.5 line-clamp-2">
          <span className="font-semibold mr-2">{post.user.username}</span>
          {post.content}
        </p>

        <p className="text-gray-400 text-sm mt-0.5 cursor-pointer">
          View all comments
        </p>
      </div>
    </div>
  );
}
