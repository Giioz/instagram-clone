import { useFollowMutation } from "@/src/modules/follow/hooks/mutations/useFollowMutation";

export function usePostFollow(postUserId: number, isFollowing: boolean) {
  const { follow, unfollow } = useFollowMutation();

  const handleFollow = async () => {
    const id = postUserId.toString();

    if (isFollowing) {
      await unfollow.mutateAsync({ followingId: id });
    } else {
      await follow.mutateAsync({ followingId: id });
    }
  };

  return {
    handleFollow,
    follow,
    unfollow
  };
}
