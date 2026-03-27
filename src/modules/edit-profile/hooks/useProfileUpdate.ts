"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile, Gender } from "../types/types";

const updateProfile = async (data: {
  bio: string | null;
  website: string | null;
  gender: Gender;
  imageUrl: string | null;
}): Promise<UserProfile> => {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update profile");
  }

  return response.json();
};

export const useProfileUpdate = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
    },
  });

  return {
    updateMutation,
    loading: updateMutation.isPending,
    success: updateMutation.isSuccess,
    error: updateMutation.error?.message,
  };
};
