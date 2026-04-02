import { notFound } from "next/navigation";
import { verifyTokenString } from "@/src/lib/auth";
import type { JWTPayload } from "@/src/lib/auth";
import { cookies } from "next/headers";
import { getUserProfile } from "@/src/modules/user-profile/services/getUserProfile";
import ProfileHeader from "./ProfileHeader";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
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
    <div className="min-h-screen flex text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader user={userProfile} />
        {/* <ProfilePosts posts={userProfile.posts} /> */}
      </div>
    </div>
  );
}
