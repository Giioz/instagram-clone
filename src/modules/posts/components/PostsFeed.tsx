"use client";

import { useState, useEffect } from "react";
import PostItem from "./PostItem";
import type { JWTPayload } from "@/src/lib/auth";
import type { User } from "@prisma/client";

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

export default function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, [refreshTrigger]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        console.error("Response status:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };
  const refreshPosts = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  useEffect(() => {
    (window as any).refreshPosts = refreshPosts;
  }, [refreshPosts]);

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }
  const postsWithImages = posts.filter((post) => post.imageUrl);

  if (postsWithImages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No photo posts yet. Create your first photo post!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {postsWithImages.map((post) => (
        <PostItem key={post.id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
}
