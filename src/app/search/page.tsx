import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { EmptyState, SearchForm, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { siteSearch } from "@/lib/site-search";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search Wolves History for players, coaches, eras, seasons, stories, and franchise figures. When your query lines up with graph tags, results can include season index theme filters that jump to /seasons?theme=… for that editorial lens. For curated, stable trails across the site, use /browse guided paths instead of relying on ad-hoc search alone.",
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
        description="Find players, coaches, eras, seasons, stories, figures, and editorial themes. Use Browse when you want curated trails instead of a direct lookup."
      />
      <SearchForm
        action="/search"
        label="Search query"
        defaultValue={query}
        placeholder="Try Garnett, 2003-04, Butler, mvp..."
        className="mb-8"
      />
      {!query ? (
        <EmptyState
          title="Search the full archive"
          description="Try a player, season, era, coach, story title, or theme. Examples: Garnett, 2003-04, Butler, playoffs."
          action={
            <Link href="/browse" className={`text-sm font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
              Browse curated paths
            </Link>
          }
        />
      ) : hits.length ? (
        <ul className="space-y-3">
          {hits.map((h) => (
            <li key={h.href}>
              <SurfaceCard className="px-4 py-3 transition hover:border-zinc-700/90 hover:bg-zinc-900/50">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{h.kind}</span>
                <Link
                  href={h.href}
                  className={`font-medium text-emerald-400/95 hover:text-emerald-300 ${premiumLinkFocus}`}
                >
                  {h.title}
                </Link>
              </div>
              {h.snippet ? <p className="mt-1 text-sm text-zinc-500">{h.snippet}</p> : null}
              </SurfaceCard>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={`No matches for "${query}"`}
          description="Try a shorter term, a season slug like 2003-04, or browse the curated paths."
          action={
            <Link href="/browse" className={`text-sm font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
              Open Browse
            </Link>
          }
        />
      )}
    </>
  );
}
