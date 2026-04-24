export default function PlayersLoading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true">
      <p className="sr-only" role="status">
        Loading players
      </p>
      <div className="h-10 w-1/2 rounded bg-zinc-800" />
      <div className="h-10 w-full max-w-md rounded bg-zinc-800" />
      <div className="h-96 rounded-lg bg-zinc-900" />
    </div>
  );
}
