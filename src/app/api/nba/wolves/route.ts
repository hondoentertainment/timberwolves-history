import { NextRequest, NextResponse } from "next/server";

import { getFranchiseSeasonsFetchedAtIso, getFranchiseSeasonsOrEmpty } from "@/lib/nba/queries";

/** Allowlisted JSON snapshot for integrations; prefer RSC pages for browsing. */
export async function GET(req: NextRequest) {
  const kind = req.nextUrl.searchParams.get("kind") ?? "team-years";
  if (kind !== "team-years") {
    return NextResponse.json(
      { error: "Unsupported kind. Use kind=team-years." },
      { status: 400 },
    );
  }
  const [seasons, fetchedAtIso] = await Promise.all([
    getFranchiseSeasonsOrEmpty(),
    getFranchiseSeasonsFetchedAtIso(),
  ]);
  return NextResponse.json({ seasons, fetchedAtIso });
}
