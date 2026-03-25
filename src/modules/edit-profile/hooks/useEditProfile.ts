"use client";

import { useProfile } from "./useProfile";
import { useProfileUpdate } from "./useProfileUpdate";
import { useProfileForm } from "./useProfileForm";
import { useProfileImage } from "./useProfileImage";
import { useProfileSubmit } from "./useProfileSubmit";

export const useEditProfile = () => {
  const { profile, bio, website, gender, imageUrl, fetchLoading, fetchError } = useProfile();
  const { updateMutation, loading, success, error } = useProfileUpdate();
  const {
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
  } = useProfileForm();
  
  const { handleImageChange, handleProfilePhotoUpload, ProfilePhotoUploadButton } = useProfileImage(
    profile,
    setImageUrl,
    setSelectedFile,
    setIsUploadingProfilePhoto,
    updateMutation
  );
  
  const { handleSubmit, hasChanges } = useProfileSubmit(
    profile,
    bio,
    website,
    gender,
    imageUrl,
    selectedFile,
    isUploadingProfilePhoto,
    updateMutation
  );

  return {
    profile,
    loading,
    fetchLoading,
    success,
    error: error || fetchError?.message || "",
    bio,
    setBio,
    website,
    setWebsite,
    gender,
    setGender,
    imageUrl,
    setImageUrl,
    selectedFile,
    setSelectedFile,
    maxBioLength,
    handleImageChange,
    handleSubmit,
    hasChanges,
    resetForm,
    ProfilePhotoUploadButton,
    isUploadingProfilePhoto,
  };
};
