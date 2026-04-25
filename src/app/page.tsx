import Link from "next/link";
import { Suspense } from "react";

import { HomeFeatureGridSkeleton } from "@/components/home/HomeFeatureGridSkeleton";
import { HomeFranchiseFeatureGrid } from "@/components/home/HomeFranchiseFeatureGrid";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { ThisWeekInWolvesHistory } from "@/components/ThisWeekInWolvesHistory";
import { getFeaturedJourneys } from "@/lib/journeys";
import { getLongreadBySlug } from "@/lib/longreads";

export const revalidate = 3600;

export default function HomePage() {
  const flagship = getLongreadBySlug("weight-of-the-north");
  const journeys = getFeaturedJourneys(3);

  return (
    <>
      <PageHeader
        eyebrow="Franchise archive"
        title="Minnesota Timberwolves history"
        description="Season-by-season records, all-time roster lineage from NBA.com, player and coach profiles, era hubs, timeline, longform stories, and trivia—built for reading, not live scores."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/start-here"
              className={`inline-flex min-h-11 items-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-400 ${premiumLinkFocus}`}
            >
              Start here
            </Link>
            <Link
              href="/search"
              className={`inline-flex min-h-11 items-center rounded-xl border border-zinc-700/90 bg-zinc-950/40 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900/70 ${premiumLinkFocus}`}
            >
              Search archive
            </Link>
          </div>
        }
      />
      <div className="mb-12 sm:mb-14">
        <ThisWeekInWolvesHistory />
      </div>
      <section className="mb-12 sm:mb-14" aria-labelledby="home-journeys">
        <SectionHeader
          id="home-journeys"
          title="Choose your Wolves path"
          description="Curated fan journeys connect the archive like a product, not a filing cabinet."
          action={
            <Link href="/start-here" className={`text-sm font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
              See all journeys
            </Link>
          }
        />
        <ul className="grid gap-4 md:grid-cols-3">
          {journeys.map((journey) => (
            <li key={journey.id}>
              <SurfaceCard className="h-full p-5 transition hover:border-zinc-700/90 hover:bg-zinc-900/50">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {journey.audience}
                </p>
                <Link
                  href={journey.href}
                  className={`mt-3 block text-lg font-semibold text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}
                >
                  {journey.title}
                </Link>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{journey.description}</p>
              </SurfaceCard>
            </li>
          ))}
        </ul>
      </section>
      <Suspense fallback={<HomeFeatureGridSkeleton />}>
        <HomeFranchiseFeatureGrid flagship={flagship} />
      </Suspense>
    </>
  );
}
