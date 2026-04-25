export default function BrowseLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <p className="sr-only" role="status">
        Loading browse
      </p>
      <div className="skeleton-shimmer h-40 rounded-3xl" />
      <div className="skeleton-shimmer h-24 rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="skeleton-shimmer h-56 rounded-2xl" />
        <div className="skeleton-shimmer h-56 rounded-2xl" />
      </div>
    </div>
  );
}
