import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { StatTable } from "@/components/StatTable";
import { coachNamesForSeason } from "@/lib/coaches";
import { getCachedFranchiseSeasons } from "@/lib/nba/queries";

export const revalidate = 3600;

function formatPct(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  return n.toFixed(3);
}

export default async function SeasonsPage() {
  const seasons = await getCachedFranchiseSeasons();
  const rows = [...seasons].reverse().map((s) => {
    const coaches = coachNamesForSeason(s.seasonLabel);
    return [
      <Link
        key={`season-${s.seasonLabel}`}
        href={`/seasons/${encodeURIComponent(s.seasonLabel)}`}
        className="font-medium text-emerald-400 hover:text-emerald-300"
      >
        {s.seasonLabel}
      </Link>,
      s.wins,
      s.losses,
      formatPct(s.winPct),
      s.playoffWins + s.playoffLosses > 0
        ? `${s.playoffWins}-${s.playoffLosses}`
        : "—",
      coaches.length ? coaches.join(", ") : "—",
    ];
  });

  return (
    <>
      <PageHeader
        title="Season by season"
        description="Franchise regular-season records and playoff game wins and losses from NBA.com team year-over-year stats. Coaching names are matched from a static head-coach register when seasons overlap."
      />
      <StatTable
        caption="Timberwolves seasons"
        columns={["Season", "W", "L", "Win%", "Playoffs (W-L)", "Head coach (register)"]}
        rows={rows}
      />
    </>
  );
}
