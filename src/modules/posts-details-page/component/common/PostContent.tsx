import CommentsSection from "@/src/modules/posts-details-page/component/common/CommentsSection";
import PostHeader from "@/src/modules/posts-details-page/component/common/PostHeader";
import PostActions from "@/src/modules/posts-details-page/component/common/PostActions";
import CommentInput from "@/src/modules/posts-details-page/component/common/CommentInput";
import { useRelativeTime } from "@/src/modules/posts/hooks/useRelativeTime";
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

interface PostContentProps {
  post: Post;
  currentUser: User | null;
  comments: any[];
  isLoading: boolean;
  error: string | null;
  isLiked: boolean;
  likeLoading: boolean;
  handleLike: () => void;
  handleFollow: () => void;
  follow: any;
  unfollow: any;
  openDeleteModal: (id: number) => void;
  commentText: string;
  setCommentText: (text: string) => void;
  handlePostComment: () => void;
}

export default function PostContent(props: PostContentProps) {
  const { post, currentUser, comments, isLoading, error, isLiked, likeLoading, handleLike, handleFollow, follow, unfollow, openDeleteModal, commentText, setCommentText, handlePostComment } = props;
  const { getRelativeTime } = useRelativeTime();

  return (
    <div className="w-full lg:w-[335px] h-[631.989px] flex flex-col border border-[#363636]">
      <PostHeader
        post={post}
        currentUser={currentUser}
        handleFollow={handleFollow}
        follow={follow}
        unfollow={unfollow}
      />
      <div className="p-4">
        <p className="line-clamp-2">
          <span className="font-semibold mr-2">
            {post.user.username}
          </span>
          {post.content}
        </p>
      </div>
      <CommentsSection
        comments={comments}
        isLoading={isLoading}
        error={error}
        postAuthorUsername={post.user.username}
        onDelete={openDeleteModal}
      />
      <PostActions
        post={post}
        isLiked={isLiked}
        likeLoading={likeLoading}
        handleLike={handleLike}
      />
      <CommentInput
        currentUser={currentUser}
        commentText={commentText}
        setCommentText={setCommentText}
        handlePostComment={handlePostComment}
      />
    </div>
  );
}
