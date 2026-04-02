"use client";

import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import type { SuggestedUser } from "../types";

export function useSuggestedUsers() {
  const { user: me, loading: authLoading } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState<Set<number>>(new Set());
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/suggested-users", { credentials: "include" });
      if (!response.ok) {
        setSuggestedUsers([]);
        return;
      }
      const data = (await response.json()) as { suggestedUsers?: SuggestedUser[] };
      setSuggestedUsers(data.suggestedUsers ?? []);
    } catch (e) {
      console.error("Error fetching suggested users:", e);
      setSuggestedUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!me) {
      setLoading(false);
      setSuggestedUsers([]);
      return;
    }
    void load();
  }, [me, load]);

  const handleFollow = async (userId: number) => {
    setBusyId(userId);
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ followingId: String(userId) }),
      });
      if (!res.ok) return;
      setFollowingIds((prev) => new Set(prev).add(userId));
      setSuggestedUsers((list) => list.filter((u) => u.id !== userId));
    } catch (e) {
      console.error(e);
    } finally {
      setBusyId(null);
    }
  };

  return {
    me,
    authLoading,
    suggestedUsers,
    loading,
    followingIds,
    busyId,
    handleFollow,
  };
}
