import { prisma } from "@/src/lib/db";
import type { JWTPayload } from "@/src/lib/auth";

function nfc(s: string): string {
  try {
    return s.normalize("NFC");
  } catch {
    return s;
  }
}

function usernameLookupCandidates(raw: string): string[] {
  const seen = new Set<string>();
  const add = (s: string) => {
    const t = s.trim();
    if (!t) return;
    seen.add(t);
    seen.add(nfc(t));
    if (/^[a-zA-Z0-9._]+$/.test(t)) {
      seen.add(t.toLowerCase());
      seen.add(t.toUpperCase());
    }
  };

  add(raw);

  try {
    let s = raw.trim();
    for (let i = 0; i < 3 && /%[0-9A-Fa-f]{2}/.test(s); i++) {
      const next = decodeURIComponent(s);
      if (next === s) break;
      add(next);
      s = next;
    }
  } catch {
    // ignore
  }

  return [...seen];
}

export async function getUserProfile(usernameParam: string, currentUser: JWTPayload | null) {
  const candidates = usernameLookupCandidates(usernameParam);
  if (candidates.length === 0) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      username: { in: candidates },
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      createdAt: true,
      posts: {
        select: {
          id: true,
          content: true,
          imageUrl: true,
          likes: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }
  let isFollowing = false;
  if (currentUser) {
    const followRelation = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: parseInt(currentUser.userId),
          followingId: user.id,
        },
      },
    });
    isFollowing = !!followRelation;
  }
  const isOwnProfile =
    !!currentUser && nfc(currentUser.username) === nfc(user.username);

  return {
    ...user,
    isFollowing,
    isOwnProfile,
  };
}
