import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { siteSearch } from "@/lib/site-search";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search Wolves History for players, coaches, eras, seasons, stories, and franchise figures.",
};

type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const hits = query ? await siteSearch(query) : [];

  return (
    <>
      <PageHeader
        title="Search"
        description="Matches player names (from the merged roster index), coaches, eras, flagship stories, figures, and season slugs. Stats tables themselves are not full-text indexed."
      />
      <form className="mb-8 flex max-w-xl flex-col gap-3 sm:flex-row" action="/search" method="get">
        <label htmlFor="q" className="sr-only">
          Search query
        </label>
        <input
          id="q"
          name="q"
          defaultValue={query}
          placeholder="Try Garnett, 2003-04, Butler…"
          className="w-full flex-1 rounded-xl border border-zinc-700/90 bg-zinc-900/50 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 placeholder:text-zinc-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
        />
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 transition hover:from-emerald-400 hover:to-emerald-500"
        >
          Search
        </button>
      </form>
      {!query ? (
        <p className="text-sm text-zinc-500">Enter a term above to search.</p>
      ) : hits.length ? (
        <ul className="space-y-3">
          {hits.map((h) => (
            <li
              key={h.href}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-3 ring-1 ring-white/[0.02]"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{h.kind}</span>
                <Link
                  href={h.href}
                  className="font-medium text-emerald-400/95 hover:text-emerald-300 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
                >
                  {h.title}
                </Link>
              </div>
              {h.snippet ? <p className="mt-1 text-sm text-zinc-500">{h.snippet}</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">No matches for “{query}”.</p>
      )}
    </>
  );
}
