export type Gender = "MALE" | "FEMALE" | "CUSTOM" | "PREFER_NOT_TO_SAY";

export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  bio?: string | null;
  website?: string | null;
  gender: Gender;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface ProfileUpdateData {
  bio?: string | null;
  website?: string | null;
  gender?: Gender;
  imageUrl?: string;
}
export type UpdateProfileResponse = UserProfile;