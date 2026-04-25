import { Suspense } from "react";

import { HomeFeatureGridSkeleton } from "@/components/home/HomeFeatureGridSkeleton";
import { HomeFranchiseFeatureGrid } from "@/components/home/HomeFranchiseFeatureGrid";
import { PageHeader } from "@/components/PageHeader";
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
