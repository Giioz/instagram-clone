"use client";

import Link from "next/link";
import type { SuggestedUser } from "../../types";
import { SuggestedUserCard } from "../common/SuggestedUserCard";
import { SuggestedForYouSkeleton } from "../skeletons/SuggestedForYouSkeleton";
import { useSuggestedUsers } from "../../hooks/useSuggestedUsers";

const IG_BLUE = "#0095f6";
const IG_MUTED = "#a8a8a8";

export function SuggestedForYou() {
  const { me, authLoading, suggestedUsers, loading, followingIds, busyId, handleFollow } = useSuggestedUsers();

  if (authLoading) {
    return <SuggestedForYouSkeleton />;
  }

  if (!me) {
    return (
      <p className="text-sm" style={{ color: IG_MUTED }}>
        Log in to see suggestions.
      </p>
    );
  }

  const imageUrl = "imageUrl" in me && me.imageUrl ? me.imageUrl : null;

  return (
    <aside className="w-full max-w-[319px] max-h-[550px] text-[var(--sfy-fg,white)]">
      <div className="mb-6 flex items-center justify-between gap-2">
        <Link
          href={`/profile/${encodeURIComponent(me.username)}`}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <img
            src={imageUrl || "/default-avatar.png"}
            alt=""
            className="h-[44px] w-[44px] shrink-0 rounded-full object-cover bg-[#262626]"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{me.username}</p>
            <p className="truncate text-sm font-normal" style={{ color: IG_MUTED }}>
              {me.name?.trim() ? me.name : me.username}
            </p>
          </div>
        </Link>
        <button
          type="button"
          className="shrink-0 text-[12px] font-medium text-[rgb(133, 161, 255)] hover:opacity-80"
          style={{ color: IG_BLUE }}
        >
          Switch
        </button>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold">Suggested for you</h2>
      </div>

      {loading ? (
        <SuggestedForYouSkeleton />
      ) : suggestedUsers.length === 0 ? (
        <p className="py-4 text-sm" style={{ color: IG_MUTED }}>
          No suggestions right now.
        </p>
      ) : (
        <ul className="space-y-0.5">
          {suggestedUsers.map((u) => (
            <li key={u.id}>
              <SuggestedUserCard
                user={u}
                onFollow={handleFollow}
                following={followingIds.has(u.id)}
                busy={busyId === u.id}
              />
            </li>
          ))}
        </ul>
      )}


      <footer className="mt-8 font-normal space-y-3 text-[12px]" style={{ color: IG_MUTED }}>
        <nav className="flex flex-wrap gap-y-1 leading-relaxed">
          {[
            "About",
            "Help",
            "Press",
            "API",
            "Jobs",
            "Privacy",
            "Terms",
            "Locations",
            "Language",
            "Meta Verified",
          ].map((label, i) => (
            <span key={label} className="inline-flex items-center">
              {i > 0 ? <span className="mx-1 text-[rgb(168,168,168)]">·</span> : null}
              <button type="button" className="hover:underline">
                {label}
              </button>
            </span>
          ))}
        </nav>
        <p className="text-xs uppercase text-[#737373]">© 2026 Instagram from Meta</p>
      </footer>
    </aside>
  );
}
