import { useFollowMutation } from "../hooks/mutations/useFollowMutation";
import type { JWTPayload } from "@/src/lib/auth";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  isFollowedBy: boolean;
  currentUser: JWTPayload | null | undefined;
  profileUsername: string;
}

export default function FollowButton({
  userId,
  isFollowing,
  isFollowedBy,
  currentUser,
  profileUsername,
}: FollowButtonProps) {
  const { follow, unfollow } = useFollowMutation();

  const handleFollow = () => {
    if (!currentUser) {
      return;
    }

    const mutation = isFollowing ? unfollow : follow;
    mutation.mutate({
      followingId: userId,
    });
  };

  if (currentUser && parseInt(currentUser.userId) === parseInt(userId)) {
    return null;
  }

  if (!currentUser) {
    return null;
  }
  const getButtonText = () => {
    if (isFollowing) return "Following";
    if (isFollowedBy && !isFollowing) return "Follow Back";
    return "Follow";
  };

  return (
    <button
      onClick={handleFollow}
      disabled={follow.isPending || unfollow.isPending}
      className={`w-[324.016px] h-[44px] rounded-lg font-semibold transition-all ${
        isFollowing
          ? "bg-gray-700 text-white hover:bg-gray-600"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {follow.isPending || unfollow.isPending
        ? "Loading..."
        : getButtonText()}
    </button>
  );
}
