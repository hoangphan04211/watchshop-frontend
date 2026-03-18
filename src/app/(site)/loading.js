"use client";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-60 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/60 animate-pulse" />
        <div className="h-10 w-10 rounded-full bg-zinc-200/80 dark:bg-zinc-800/60 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-[var(--border)] bg-white/60 dark:bg-zinc-950/30 overflow-hidden"
          >
            <div className="aspect-[4/3] bg-zinc-200/70 dark:bg-zinc-800/50 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-3/4 rounded bg-zinc-200/80 dark:bg-zinc-800/60 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-zinc-200/70 dark:bg-zinc-800/50 animate-pulse" />
              <div className="h-10 w-full rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/60 animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

