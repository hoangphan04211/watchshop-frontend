"use client";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-20">
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div className="space-y-3 w-full md:w-1/2">
          <div className="h-3 w-40 bg-slate-200/60 dark:bg-slate-800/40 animate-pulse uppercase tracking-[0.4em]" />
          <div className="h-10 w-full bg-slate-200/80 dark:bg-slate-800/60 animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-slate-200/80 dark:bg-slate-800/60 animate-pulse border border-border/30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border border-border/30 bg-white/60 dark:bg-slate-900/10 overflow-hidden"
          >
            <div className="aspect-[3/4] bg-slate-200/60 dark:bg-slate-800/40 animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-2 w-1/4 bg-accent/20 animate-pulse" />
              <div className="h-5 w-3/4 bg-slate-200/80 dark:bg-slate-800/60 animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-200/60 dark:bg-slate-800/40 animate-pulse" />
              <div className="h-12 w-full bg-slate-950 dark:bg-slate-800 animate-pulse mt-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

