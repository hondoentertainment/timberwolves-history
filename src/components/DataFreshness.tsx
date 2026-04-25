import Link from "next/link";

function formatFetchedAt(iso: string | null | undefined): string | null {
  if (!iso || typeof iso !== "string") return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type Props = {
  /** ISO timestamp from cached NBA.com team year-over-year bundle (HIST-006). */
  franchiseStatsFetchedAtIso?: string | null;
};

export function DataFreshness({ franchiseStatsFetchedAtIso }: Props) {
  const refreshed = formatFetchedAt(franchiseStatsFetchedAtIso);

  return (
    <p className="text-xs leading-relaxed text-zinc-600">
      {refreshed ? (
        <>
          <span className="font-medium text-zinc-500">Team stats cache:</span> franchise year-over-year
          table last refreshed on the server{" "}
          <time dateTime={franchiseStatsFetchedAtIso ?? undefined} className="text-zinc-500">
            {refreshed}
          </time>
          .{" "}
        </>
      ) : (
        <>
          <span className="font-medium text-zinc-500">Data cadence:</span> NBA.com-backed tables use
          server caching (about an hour on team aggregates; roster index uses a longer window).{" "}
        </>
      )}
      Dynamic routes such as <code className="text-zinc-600">/players/[id]</code> and{" "}
      <code className="text-zinc-600">/seasons/[year]</code> set{" "}
      <code className="text-zinc-600">revalidate = 3600</code> unless noted. Static JSON and editorial
      routes ship with the app. See{" "}
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
