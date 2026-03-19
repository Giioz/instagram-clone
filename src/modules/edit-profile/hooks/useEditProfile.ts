"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile, Gender } from "../types/types";
import React from "react";
import { ProfilePhotoUploader } from "../components/common/ProfilePhotoUploader";

const fetchProfile = async (): Promise<UserProfile> => {
  const response = await fetch("/api/profile");
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch profile");
  }
  return response.json();
};

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

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [gender, setGender] = useState<Gender>("PREFER_NOT_TO_SAY");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false);

  const maxBioLength = 150;

  const {
    data: profile,
    isLoading: fetchLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
  
  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? "");
      setWebsite(profile.website ?? "");
      setGender(profile.gender);
      setImageUrl(profile.imageUrl ?? null);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      setBio(updatedProfile.bio ?? "");
      setWebsite(updatedProfile.website ?? "");
      setGender(updatedProfile.gender as Gender);
      setImageUrl(updatedProfile.imageUrl ?? null);
      setSelectedFile(null);
      setIsUploadingProfilePhoto(false);
    },
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) return;

    let finalImageUrl = imageUrl;
    if (selectedFile && !isUploadingProfilePhoto) {
      // Fallback to base64 if UploadThing wasn't used
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });
      finalImageUrl = await base64Promise;
    }

    updateMutation.mutate({
      bio: bio.trim() || null,
      website: website.trim() || null,
      gender,
      imageUrl: finalImageUrl,
    });
  };

  const hasChanges =
    profile &&
    ((profile.bio || "") !== bio ||
      (profile.website || "") !== website ||
      profile.gender !== gender ||
      selectedFile !== null);

  const resetForm = () => {
    if (profile) {
      setBio(profile.bio ?? "");
      setWebsite(profile.website ?? "");
      setGender(profile.gender);
      setImageUrl(profile.imageUrl ?? null);
      setSelectedFile(null);
    }
  };

  const ProfilePhotoUploadButton = () => 
    React.createElement(ProfilePhotoUploader, { 
      onUpload: handleProfilePhotoUpload
    });

  return {
    profile,
    loading: updateMutation.isPending,
    fetchLoading,
    success: updateMutation.isSuccess,
    error: updateMutation.error?.message || fetchError?.message || "",
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
