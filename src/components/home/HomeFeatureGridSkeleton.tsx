export function HomeFeatureGridSkeleton() {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3"
      aria-busy="true"
      aria-label="Loading feature links"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className="skeleton-shimmer flex min-h-[9.5rem] flex-col rounded-2xl border border-zinc-800/80 p-5 ring-1 ring-white/[0.04]"
        />
      ))}
    </div>
  );
}
