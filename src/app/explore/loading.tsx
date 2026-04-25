export default function ExploreLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <p className="sr-only" role="status">
        Loading explore
      </p>
      <div className="skeleton-shimmer h-40 rounded-3xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="skeleton-shimmer h-48 rounded-2xl" />
        <div className="skeleton-shimmer h-48 rounded-2xl" />
        <div className="skeleton-shimmer h-48 rounded-2xl" />
      </div>
    </div>
  );
}
