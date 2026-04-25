import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { getCachedAllTimeWolvesPlayers } from "@/lib/nba/players-index";

export const revalidate = 86_400;

type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function PlayersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const players = await getCachedAllTimeWolvesPlayers().catch(
    () => [] as { playerId: number; name: string; seasons: string[] }[],
  );
  const filtered = query
    ? players.filter((p) => p.name.toLowerCase().includes(query))
    : players;

  return (
    <>
      <PageHeader
        title="All-time players"
        description={`${players.length} unique players have appeared on a Timberwolves regular-season roster (merged from season-by-season NBA.com roster feeds). Use search to filter by name.`}
      />
      {!players.length ? (
        <p className="mb-6 rounded-2xl border border-amber-500/25 bg-amber-950/25 px-5 py-4 text-sm leading-relaxed text-amber-100/95 ring-1 ring-amber-500/10">
          The merged roster index could not be built (NBA.com unreachable or timed out). Try again
          later; the list fills once roster feeds respond.
        </p>
      ) : null}
      <form
        className="mb-8 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch"
        action="/players"
        method="get"
      >
        <label htmlFor="q" className="sr-only">
          Search players
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name…"
          className="w-full flex-1 rounded-xl border border-zinc-700/90 bg-zinc-900/50 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 placeholder:text-zinc-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
        />
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 outline-offset-2 transition hover:from-emerald-400 hover:to-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300/80 active:translate-y-px"
        >
          Search
        </button>
      </form>
      <ul className="columns-1 gap-x-10 text-sm sm:columns-2 md:columns-3">
        {filtered.map((p) => (
          <li key={p.playerId} className="break-inside-avoid py-2">
            <Link
              href={`/players/${p.playerId}`}
              className="font-medium text-emerald-400/95 decoration-emerald-500/30 underline-offset-2 transition hover:text-emerald-300 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
            >
              {p.name}
            </Link>
            <span className="text-zinc-500"> · {p.seasons.length} seasons</span>
          </li>
        ))}
      </ul>
      {query && !filtered.length ? (
        <p className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-center text-sm text-zinc-500">
          No players match that search.
        </p>
      ) : null}
    </>
  );
}
