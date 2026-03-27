"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserProfile, Gender } from "../types/types";

export const useProfileForm = () => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false);

  const maxBioLength = 150;

  const updateFormState = (updates: Partial<UserProfile>) => {
    queryClient.setQueryData(["profile"], (old: UserProfile | undefined) => {
      if (!old) return old;
      return { ...old, ...updates };
    });
  };

  const setBio = (newBio: string) => updateFormState({ bio: newBio });
  const setWebsite = (newWebsite: string) => updateFormState({ website: newWebsite });
  const setGender = (newGender: Gender) => updateFormState({ gender: newGender });
  const setImageUrl = (newImageUrl: string | null) => updateFormState({ imageUrl: newImageUrl });

  const resetForm = () => {
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    setSelectedFile(null);
  };

  return {
    selectedFile,
    setSelectedFile,
    isUploadingProfilePhoto,
    setIsUploadingProfilePhoto,
    maxBioLength,
    setBio,
    setWebsite,
    setGender,
    setImageUrl,
    resetForm,
  };
};
