import { NextRequest, NextResponse } from "next/server";

import { getCachedFranchiseSeasons } from "@/lib/nba/queries";

/** Allowlisted JSON snapshot for integrations; prefer RSC pages for browsing. */
export async function GET(req: NextRequest) {
  const kind = req.nextUrl.searchParams.get("kind");
  if (kind !== "team-years") {
    return NextResponse.json(
      { error: "Unsupported kind. Use kind=team-years." },
      { status: 400 },
    );
  }
  try {
    const seasons = await getCachedFranchiseSeasons();
    return NextResponse.json({ seasons });
  } catch {
    return NextResponse.json(
      { error: "Upstream data temporarily unavailable." },
      { status: 502 },
    );
  }
}
