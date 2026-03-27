"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import PostContent from "@/src/modules/posts-details-page/component/common/PostContent";
import CommentOptionsModal from "@/src/modules/comment/component/common/CommentOptionsModal";

import { usePostImages } from "@/src/modules/posts-details-page/hooks/usePostImages";
import { usePostContent } from "@/src/modules/posts-details-page/hooks/usePostContent";

import { User } from "@prisma/client";

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

interface Props {
  post: Post;
  currentUser: User | null;
}

export default function PostDetailsPage({ post, currentUser }: Props) {
  const router = useRouter();

  const { imageUrls } = usePostImages(post.imageUrl);

  const {
    postContentProps,
    selectedCommentId,
    isDeleteModalOpen,
    handleDeleteComment,
    closeDeleteModal,
  } = usePostContent(post, currentUser);

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-[935px] mx-auto pt-[30.3636px]">
        <div className="flex flex-col lg:flex-row justify-center items-start">
          <div className="w-full lg:w-[449.091px] h-[631.989px] bg-[#212121] flex items-center justify-center border border-[#363636] border-r-0">
            {imageUrls.length > 0 ? (
              <div className="relative w-full h-full">
                <Image
                  src={imageUrls[0]}
                  alt="post"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="text-gray-500">No image</div>
            )}
          </div>
          <PostContent {...postContentProps} />
        </div>
      </div>
      <CommentOptionsModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={() =>
          selectedCommentId && handleDeleteComment(selectedCommentId)
        }
      />
    </div>
  );
}