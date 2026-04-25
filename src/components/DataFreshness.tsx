import Link from "next/link";

export function DataFreshness() {
  return (
    <p className="text-xs leading-relaxed text-zinc-600">
      <span className="font-medium text-zinc-500">Data cadence:</span> NBA.com-backed tables on this site use
      server caching (typically about an hour on key aggregates; the roster index uses a longer window). Static JSON
      and editorial routes ship with the app. See{" "}
      <Link
        href="/about-data"
        className="text-emerald-500/90 underline decoration-emerald-600/30 underline-offset-2 hover:text-emerald-400"
      >
        About the data
      </Link>{" "}
      for sources and limitations.
    </p>
  );
}
