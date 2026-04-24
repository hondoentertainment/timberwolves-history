export default function SeasonsLoading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true">
      <p className="sr-only" role="status">
        Loading season
      </p>
      <div className="h-10 w-2/3 rounded bg-zinc-800" />
      <div className="h-4 w-full max-w-xl rounded bg-zinc-800" />
      <div className="h-64 rounded-lg bg-zinc-900" />
    </div>
  );
}
