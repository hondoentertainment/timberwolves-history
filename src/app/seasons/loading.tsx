export default function SeasonsLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <p className="sr-only" role="status">
        Loading season
      </p>
      <div className="skeleton-shimmer h-10 w-2/3 max-w-lg rounded-xl" />
      <div className="skeleton-shimmer h-4 w-full max-w-xl rounded-lg" />
      <div className="skeleton-shimmer h-64 rounded-2xl" />
    </div>
  );
}
