"use client";

import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "../types/types";

const fetchProfile = async (): Promise<UserProfile> => {
  const response = await fetch("/api/profile");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch profile");
  }
  return response.json();
};

export const useProfile = () => {
  const {
    data: profile,
    isLoading: fetchLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const bio = profile?.bio ?? "";
  const website = profile?.website ?? "";
  const gender = profile?.gender ?? "PREFER_NOT_TO_SAY";
  const imageUrl = profile?.imageUrl ?? null;

  return {
    profile,
    bio,
    website,
    gender,
    imageUrl,
    fetchLoading,
    fetchError,
  };
};
