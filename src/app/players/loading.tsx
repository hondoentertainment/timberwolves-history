export default function PlayersLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <p className="sr-only" role="status">
        Loading players
      </p>
      <div className="skeleton-shimmer h-10 w-1/2 max-w-md rounded-xl" />
      <div className="skeleton-shimmer h-12 w-full max-w-lg rounded-xl" />
      <div className="skeleton-shimmer h-96 rounded-2xl" />
    </div>
  );
}
