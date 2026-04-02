export function SuggestedForYouSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-1 items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-[#262626]" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-24 rounded bg-[#262626]" />
            <div className="h-3 w-32 rounded bg-[#1a1a1a]" />
          </div>
        </div>
        <div className="h-3 w-12 rounded bg-[#262626]" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-2 py-2">
          <div className="h-11 w-11 shrink-0 rounded-full bg-[#262626]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 w-28 rounded bg-[#262626]" />
            <div className="h-3 w-40 rounded bg-[#1a1a1a]" />
          </div>
          <div className="h-3 w-12 shrink-0 rounded bg-[#262626]" />
        </div>
      ))}
    </div>
  );
}