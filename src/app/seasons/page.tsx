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
        className="font-medium text-emerald-400/95 decoration-emerald-500/25 underline-offset-2 transition hover:text-emerald-300 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
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
        <p className="mb-6 rounded-2xl border border-amber-500/25 bg-amber-950/25 px-5 py-4 text-sm leading-relaxed text-amber-100/95 ring-1 ring-amber-500/10">
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
