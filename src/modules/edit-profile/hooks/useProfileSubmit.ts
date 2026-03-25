"use client";

export const useProfileSubmit = (
  profile: any,
  bio: string,
  website: string,
  gender: any,
  imageUrl: string | null,
  selectedFile: File | null,
  isUploadingProfilePhoto: boolean,
  updateMutation: any
) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) return;

    let finalImageUrl = imageUrl;
    if (selectedFile && !isUploadingProfilePhoto) {
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

  return {
    handleSubmit,
    hasChanges,
  };
};
