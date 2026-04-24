import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { getCachedAllTimeWolvesPlayers } from "@/lib/nba/players-index";

export const revalidate = 86_400;

type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function PlayersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const players = await getCachedAllTimeWolvesPlayers();
  const filtered = query
    ? players.filter((p) => p.name.toLowerCase().includes(query))
    : players;

  return (
    <>
      <PageHeader
        title="All-time players"
        description={`${players.length} unique players have appeared on a Timberwolves regular-season roster (merged from season-by-season NBA.com roster feeds). Use search to filter by name.`}
      />
      <form className="mb-6 flex max-w-md gap-2" action="/players" method="get">
        <label htmlFor="q" className="sr-only">
          Search players
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name…"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Search
        </button>
      </form>
      <ul className="columns-1 gap-x-8 text-sm sm:columns-2 md:columns-3">
        {filtered.map((p) => (
          <li key={p.playerId} className="break-inside-avoid py-1">
            <Link
              href={`/players/${p.playerId}`}
              className="text-emerald-400 hover:text-emerald-300"
            >
              {p.name}
            </Link>
            <span className="text-zinc-500"> · {p.seasons.length} seasons</span>
          </li>
        ))}
      </ul>
      {query && !filtered.length ? (
        <p className="mt-6 text-sm text-zinc-500">No players match that search.</p>
      ) : null}
    </>
  );
}
