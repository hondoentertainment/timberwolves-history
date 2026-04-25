import Link from "next/link";
import { Suspense } from "react";

import { HomeFeatureGridSkeleton } from "@/components/home/HomeFeatureGridSkeleton";
import { HomeFranchiseFeatureGrid } from "@/components/home/HomeFranchiseFeatureGrid";
import { PageHeader } from "@/components/PageHeader";
import { premiumLinkFocus } from "@/components/PremiumUX";
import { ThisWeekInWolvesHistory } from "@/components/ThisWeekInWolvesHistory";
import { getLongreadBySlug } from "@/lib/longreads";

export const revalidate = 3600;

export default function HomePage() {
  const flagship = getLongreadBySlug("weight-of-the-north");

  return (
    <>
      <PageHeader
        eyebrow="Franchise archive"
        title="Minnesota Timberwolves history"
        description="Season-by-season records, all-time roster lineage from NBA.com, player and coach profiles, era hubs, timeline, longform stories, and trivia—built for reading, not live scores."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/browse"
              className={`inline-flex min-h-11 items-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-400 ${premiumLinkFocus}`}
            >
              Start browsing
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
      <Suspense fallback={<HomeFeatureGridSkeleton />}>
        <HomeFranchiseFeatureGrid flagship={flagship} />
      </Suspense>
    </>
  );
}
