export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  createdAt: Date;
  posts: Array<{
    id: number;
    content: string;
    imageUrl: string | null;
    likes: number;
    createdAt: Date;
  }>;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
  isFollowing: boolean;
  isOwnProfile: boolean;
}

export interface UserProfileResponse {
  user: UserProfile | null;
  error?: string;
}
