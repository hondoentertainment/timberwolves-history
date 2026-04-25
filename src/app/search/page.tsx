import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { ChipLink, EmptyState, SearchForm, SectionHeader, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { getFeaturedJourneys, getSuggestedSearches } from "@/lib/journeys";
import { groupSearchHits, siteSearch } from "@/lib/site-search";

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
  const groupedHits = groupSearchHits(hits);
  const journeys = getFeaturedJourneys(3);
  const suggestedSearches = getSuggestedSearches();

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
        <div className="space-y-8">
          <section aria-labelledby="suggested-searches">
            <SectionHeader
              id="suggested-searches"
              title="Suggested searches"
              description="Start with a name, season, theme, or turning point."
            />
            <div className="flex flex-wrap gap-2">
              {suggestedSearches.map((term) => (
                <ChipLink key={term} href={`/search?q=${encodeURIComponent(term)}`}>
                  {term}
                </ChipLink>
              ))}
            </div>
          </section>
          <section aria-labelledby="search-journeys">
            <SectionHeader
              id="search-journeys"
              title="Popular paths"
              description="Not sure what to search? These guided trails are better starting points than a blank box."
            />
            <ul className="grid gap-3 md:grid-cols-3">
              {journeys.map((journey) => (
                <li key={journey.id}>
                  <SurfaceCard className="h-full p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      {journey.audience}
                    </p>
                    <Link
                      href={journey.href}
                      className={`mt-2 block font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}
                    >
                      {journey.title}
                    </Link>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-600">{journey.description}</p>
                  </SurfaceCard>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : hits.length ? (
        <div className="space-y-8">
          {groupedHits.map((group) => (
            <section key={group.kind} aria-labelledby={`search-group-${group.kind.toLowerCase()}`}>
              <SectionHeader
                id={`search-group-${group.kind.toLowerCase()}`}
                title={group.kind}
                description={`${group.hits.length} result${group.hits.length === 1 ? "" : "s"}`}
              />
              <ul className="space-y-3">
                {group.hits.map((h) => (
                  <li key={h.href}>
                    <SurfaceCard className="px-4 py-3 transition hover:border-zinc-700/90 hover:bg-zinc-900/50">
                      <Link
                        href={h.href}
                        className={`font-medium text-emerald-400/95 hover:text-emerald-300 ${premiumLinkFocus}`}
                      >
                        {h.title}
                      </Link>
                      {h.snippet ? <p className="mt-1 text-sm text-zinc-500">{h.snippet}</p> : null}
                    </SurfaceCard>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No matches for "${query}"`}
          description="Try a shorter term, a season slug like 2003-04, or start with one of the curated journeys."
          action={
            <div className="flex flex-wrap gap-2">
              <Link href="/start-here" className={`text-sm font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
                Start Here
              </Link>
              <Link href="/browse" className={`text-sm font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
                Open Browse
              </Link>
            </div>
          }
        />
      )}
    </>
  );
}
