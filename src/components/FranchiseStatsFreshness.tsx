import "server-only";

import { DataFreshness } from "@/components/DataFreshness";
import { getFranchiseSeasonsFetchedAtIso } from "@/lib/nba/queries";

export async function FranchiseStatsFreshness() {
  const iso = await getFranchiseSeasonsFetchedAtIso();
  return <DataFreshness franchiseStatsFetchedAtIso={iso} />;
}
