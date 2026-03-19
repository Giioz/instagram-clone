"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { useEditProfile } from "../../hooks/useEditProfile";
import WebsiteInput from "../common/inputs/WebsiteInput";
import BioInput from "../common/inputs/BioInput";
import GenderSelect from "../common/inputs/GenderSelect";

export default function ProfileEditForm() {
  const {
    profile,
    loading,
    success,
    error,
    bio,
    setBio,
    website,
    setWebsite,
    gender,
    setGender,
    imageUrl,
    setImageUrl,
    selectedFile,
    maxBioLength,
    handleImageChange,
    handleSubmit,
    hasChanges,
  } = useEditProfile();

  return (
    <div className="min-h-screen bg-[#0B1014] py-8 px-4">
      <div className="max-w-150 mx-auto">
        <div className="mb-8">
          <h1 className="text-white text-[20px] font-bold mb-2">
            Edit profile
          </h1>
        </div>
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Profile updated successfully!</span>
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-[#262626] rounded-2xl border border-white/10 p-6 mb-6 w-152.5 h-22 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden relative">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-semibold">
                    {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-white text-[16px] font-bold leading-none">
                  {profile?.username}
                </h2>
                <p className="text-gray-400 text-[14px] leading-none mt-1">
                  {profile?.name}
                </p>
              </div>
            </div>
            <label className="bg-[#4a5df9] text-white px-4 h-8 rounded-lg font-medium text-sm cursor-pointer flex items-center justify-center hover:opacity-90 transition">
              Change photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <WebsiteInput value={website} onChange={setWebsite} />
          <BioInput value={bio} onChange={setBio} maxLength={maxBioLength} />
          <GenderSelect value={gender} onChange={setGender} />

          <div className="flex items-center gap-2 text-gray-400 text-[12px] whitespace-nowrap">
            <p>
              Certain profile info, like your name, bio and links, is visible to
              everyone.
              <a
                href="https://help.instagram.com/347751748650214?ref=igweb"
                className="text-[#708DFF] hover:underline"
              >
                See what profile info is visible
              </a>
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading || !hasChanges}
              className={`text-white px-5 w-63.25 h-11 rounded-xl font-medium disabled:cursor-not-allowed transition-colors ${
                hasChanges && !loading
                  ? "bg-[#4A5DF9] hover:bg-[#3B4FE8]"
                  : "bg-[#19208B] disabled:bg-[#19208B]"
              }`}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
