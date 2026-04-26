import Link from "next/link";
import type { Metadata } from "next";

import { DataCadenceNote } from "@/components/DataCadenceNote";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, SearchForm, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { getCachedAllTimeWolvesPlayers, getFallbackAllTimeWolvesPlayers } from "@/lib/nba/players-index";

const playersIndexDescription =
  "Players who appeared in at least one Timberwolves regular-season game. Search the merged all-time roster index on Wolves History.";

export const metadata: Metadata = {
  title: "All-time players",
  description: playersIndexDescription,
  openGraph: {
    title: "All-time players",
    description: playersIndexDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All-time players",
    description: playersIndexDescription,
  },
};

export const revalidate = 86_400;

type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function PlayersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const players = await getCachedAllTimeWolvesPlayers().catch(
    () => getFallbackAllTimeWolvesPlayers(),
  );
  const filtered = query
    ? players.filter((p) => p.name.toLowerCase().includes(query))
    : players;

  return (
    <>
      <PageHeader
        title="All-time players"
        description={`${players.length} players have appeared in at least one Timberwolves regular-season game. Use search to filter by name.`}
      />
      <DataCadenceNote routeRevalidateSeconds={86_400} label="This roster index">
        <p>
          Rows merge a shipped all-time snapshot with live season rosters when enabled: entries with
          the same player ID (or normalized name) collapse into one list row with seasons unioned.
        </p>
      </DataCadenceNote>
      {!players.length ? (
        <EmptyState
          tone="warning"
          title="Roster index unavailable"
          description="The merged roster index could not be built because NBA.com was unreachable or timed out. Try again later; the list fills once roster feeds respond."
          className="mb-6"
        />
      ) : null}
      <SearchForm
        action="/players"
        label="Search players"
        defaultValue={q ?? ""}
        placeholder="Search by name..."
        className="mb-4"
      />
      <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <span className="rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1.5">
          Showing {filtered.length} of {players.length}
        </span>
        {query ? (
          <Link href="/players" className={`font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
            Clear search
          </Link>
        ) : null}
      </div>
      <SurfaceCard className="p-4 sm:p-5">
      <ul className="columns-1 gap-x-10 text-sm sm:columns-2 md:columns-3">
        {filtered.map((p) => (
          <li key={p.playerId} className="break-inside-avoid py-2">
            <Link
              href={`/players/${p.playerId}`}
              className={`font-medium text-emerald-400/95 decoration-emerald-500/30 underline-offset-2 hover:text-emerald-300 hover:underline ${premiumLinkFocus}`}
            >
              {p.name}
            </Link>
            <span className="text-zinc-500"> · {p.seasons.length} seasons</span>
          </li>
        ))}
      </ul>
      </SurfaceCard>
      {query && !filtered.length ? (
        <EmptyState
          title="No players match that search"
          description="Try a shorter spelling or clear the filter to return to the full roster index."
          className="mt-8 text-center"
        />
      ) : null}
    </>
  );
}
