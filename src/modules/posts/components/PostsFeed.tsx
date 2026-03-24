"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setCursor(null);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        limit: '10',
        ...(cursor && !isInitial && { cursor })
      });

      const response = await fetch(`/api/posts?${params}`);

      if (response.ok) {
        const data = await response.json();
        const newPosts = data.posts || [];
        
        if (isInitial) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } else {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        console.error("Response status:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [cursor]);

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

  useEffect(() => {
    fetchPosts(true);
    fetchCurrentUser();
  }, [refreshTrigger]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchPosts(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, fetchPosts]);

  const refreshPosts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    (window as any).refreshPosts = refreshPosts;
  }, [refreshPosts]);

  if (loading) {
    return <div className="text-center py-8 text-white">Loading posts...</div>;
  }

  const postsWithImages = posts.filter((post) => post.imageUrl);

  if (postsWithImages.length === 0 && !loadingMore) {
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

      <div ref={loadMoreRef} className="h-4">
        {loadingMore && hasMore && (
          <div className="text-center py-4 text-white">
            <div className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading more posts...
            </div>
          </div>
        )}
      </div>
      
      {!hasMore && postsWithImages.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more posts to load
        </div>
      )}
    </div>
  );
}
