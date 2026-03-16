import { notFound } from "next/navigation";
import { verifyTokenString } from "@/src/lib/auth";
import type { JWTPayload } from "@/src/lib/auth";
import { cookies } from "next/headers";
import { getUserProfile, ProfileHeader, ProfilePosts } from "@/src/modules/user-profile";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ username: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { username } = await params;

  if (!username) {
    notFound();
  }
  
  let currentUser: JWTPayload | null = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      currentUser = verifyTokenString(token);
    }
  } catch (error) {
  }

  const userProfile = await getUserProfile(username, currentUser);

  if (!userProfile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 flex text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader user={userProfile} />
        {/* <ProfilePosts posts={userProfile.posts} /> */}
      </div>
    </div>
  );
}