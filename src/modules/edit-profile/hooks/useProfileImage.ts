"use client";

import React from "react";
import { ProfilePhotoUploader } from "../components/common/ProfilePhotoUploader";
import { UserProfile } from "../types/types";

export const useProfileImage = (
  profile: UserProfile | undefined,
  setImageUrl: (url: string | null) => void,
  setSelectedFile: (file: File | null) => void,
  setIsUploadingProfilePhoto: (uploading: boolean) => void,
  updateMutation: any
) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const handleProfilePhotoUpload = async (uploadedUrl: string) => {
    setIsUploadingProfilePhoto(true);
    setImageUrl(uploadedUrl);
    setSelectedFile(null);

    if (profile) {
      updateMutation.mutate({
        bio: profile.bio ?? null,
        website: profile.website ?? null,
        gender: profile.gender,
        imageUrl: uploadedUrl,
      });
    }
  };

  const ProfilePhotoUploadButton = () => 
    React.createElement(ProfilePhotoUploader, { 
      onUpload: handleProfilePhotoUpload
    });

  return {
    handleImageChange,
    handleProfilePhotoUpload,
    ProfilePhotoUploadButton,
  };
};
