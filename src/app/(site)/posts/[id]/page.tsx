import { notFound } from "next/navigation";
import PostDetailsPage from "@/src/modules/posts-details-page/component/sections/PostDetailsPage";
import { getPost, getCurrentUser, checkIfUserSavedPost, checkIfUserIsFollowing } from "@/src/modules/posts-details-page/hooks/usePostData";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const postId = id;
  if (!postId) {
    notFound();
  }
  
  const post = await getPost(postId);
  const currentUser = await getCurrentUser();

  if (!post) {
    notFound();
  }

  const isSaved = currentUser ? await checkIfUserSavedPost(postId, currentUser.id) : false;
  const isFollowing = currentUser ? await checkIfUserIsFollowing(post.userId, currentUser.id) : false;

  const postWithExtras = {
    ...post,
    isSaved,
    isFollowing,
  };

  return (
    <PostDetailsPage 
      post={postWithExtras} 
      currentUser={currentUser} 
    />
  );
}
