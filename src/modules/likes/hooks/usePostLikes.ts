import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@prisma/client";

interface PostLike {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}

interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl: string | null;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UsePostLikesProps {
  currentUser: User | null;
  post: Post;
}

// API functions
const fetchPostLikes = async (postId: number): Promise<PostLike[]> => {
  const response = await fetch(`/api/posts/like?postId=${postId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch likes");
  }
  const data = await response.json();
  return data.likes || [];
};

const togglePostLike = async (postId: number): Promise<PostLike[]> => {
  const response = await fetch("/api/posts/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to toggle like");
  }
  
  const data = await response.json();
  return data.likes || [];
};

export function usePostLikes({ currentUser, post }: UsePostLikesProps) {
  const queryClient = useQueryClient();

  const {
    data: likes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["postLikes", post.id],
    queryFn: () => fetchPostLikes(post.id),
    enabled: !!post && !!currentUser,
  });

  const isLiked = currentUser ? likes.some(like => like.userId === currentUser.id) : false;

  const likeMutation = useMutation({
    mutationFn: () => togglePostLike(post.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["postLikes", post.id] });
      const previousLikes = queryClient.getQueryData<PostLike[]>(["postLikes", post.id]);
      if (currentUser) {
        queryClient.setQueryData(["postLikes", post.id], (old: PostLike[] = []) => {
          if (isLiked) {
            return old.filter(like => like.userId !== currentUser.id);
          } else {
            const newLike: PostLike = {
              id: Date.now(), 
              userId: currentUser.id,
              postId: post.id,
              createdAt: new Date().toISOString(),
              user: {
                id: currentUser.id,
                username: currentUser.username,
                name: currentUser.name,
              },
            };
            return [...old, newLike];
          }
        });
      }
      
      return { previousLikes };
    },
    onError: (err, variables, context) => {
      if (context?.previousLikes) {
        queryClient.setQueryData(["postLikes", post.id], context.previousLikes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["postLikes", post.id] });
    },
  });

  const handleLike = () => {
    if (!currentUser || !post || likeMutation.isPending) return;
    likeMutation.mutate();
  };

  return {
    isLiked,
    isLoading: isLoading || likeMutation.isPending,
    likes,
    error: error?.message || likeMutation.error?.message || null,
    handleLike,
  };
}
