export default function SearchLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <p className="sr-only" role="status">
        Loading search
      </p>
      <div className="skeleton-shimmer h-40 rounded-3xl" />
      <div className="skeleton-shimmer h-16 max-w-2xl rounded-2xl" />
      <div className="skeleton-shimmer h-40 rounded-2xl" />
    </div>
  );
}
