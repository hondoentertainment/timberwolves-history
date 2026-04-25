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
        title="Minnesota Timberwolves franchise history"
        description="Explore every season since the 1989 expansion, the full all-time roster lineage (from NBA.com team rosters), player profiles with career stats, era hubs, a franchise timeline, a head-coach register, and editorial layers documented on About the data."
      />
      <div className="mb-10">
        <ThisWeekInWolvesHistory />
      </div>
      <Suspense fallback={<HomeFeatureGridSkeleton />}>
        <HomeFranchiseFeatureGrid flagship={flagship} />
      </Suspense>
    </>
  );
}
