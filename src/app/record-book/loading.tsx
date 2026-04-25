export default function RecordBookLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <p className="sr-only" role="status">
        Loading record book
      </p>
      <div className="skeleton-shimmer h-40 rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="skeleton-shimmer h-32 rounded-2xl" />
        <div className="skeleton-shimmer h-32 rounded-2xl" />
        <div className="skeleton-shimmer h-32 rounded-2xl" />
        <div className="skeleton-shimmer h-32 rounded-2xl" />
      </div>
      <div className="skeleton-shimmer h-80 rounded-2xl" />
    </div>
  );
}
