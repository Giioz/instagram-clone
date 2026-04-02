"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { useProfile } from "@/src/modules/edit-profile/hooks/useProfile";

export default function ProfileIndexRedirect() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, fetchLoading } = useProfile();

  useEffect(() => {
    if (authLoading || fetchLoading) return;
    const username = user?.username?.trim() || profile?.username?.trim();
    if (username) {
      router.replace(`/profile/${encodeURIComponent(username)}`);
    }
  }, [authLoading, fetchLoading, user, profile, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      <p className="text-sm text-gray-400">
        {authLoading || fetchLoading || user?.username || profile?.username
          ? "Redirecting…"
          : "Sign in to view your profile."}
      </p>
    </div>
  );
}
