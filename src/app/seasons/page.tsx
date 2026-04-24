import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { StatTable } from "@/components/StatTable";
import { coachNamesForSeason } from "@/lib/coaches";
import { getFranchiseSeasonsOrEmpty } from "@/lib/nba/queries";

export const revalidate = 3600;

function formatPct(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  return n.toFixed(3);
}

export default async function SeasonsPage() {
  const seasons = await getFranchiseSeasonsOrEmpty();
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
      {!seasons.length ? (
        <p className="mb-4 rounded-lg border border-amber-800/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-100/90">
          NBA.com team stats are temporarily unavailable (build or network). Retry shortly; cached
          pages fill once the feed responds.
        </p>
      ) : null}
      <StatTable
        caption="Timberwolves seasons"
        columns={["Season", "W", "L", "Win%", "Playoffs (W-L)", "Head coach (register)"]}
        rows={rows}
      />
    </>
  );
}
