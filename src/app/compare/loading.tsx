export default function CompareLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <p className="sr-only" role="status">
        Loading comparison
      </p>
      <div className="skeleton-shimmer h-40 rounded-3xl" />
      <div className="skeleton-shimmer h-32 rounded-2xl" />
      <div className="skeleton-shimmer h-72 rounded-2xl" />
    </div>
  );
}
