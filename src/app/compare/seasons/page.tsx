import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { EmptyState, SectionHeader, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { StatTable } from "@/components/StatTable";
import { compareFranchiseSeasons } from "@/lib/compare";
import { getFranchiseSeasonsOrEmpty } from "@/lib/nba/queries";
import { compareSeasonIds } from "@/lib/trivia/season-order";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Compare seasons",
  description: "Compare two Minnesota Timberwolves seasons across record, ranks, and playoff results.",
};

type PageProps = { searchParams: Promise<{ a?: string; b?: string }> };

export default async function CompareSeasonsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const seasons = [...(await getFranchiseSeasonsOrEmpty())].sort((a, b) =>
    compareSeasonIds(b.seasonLabel, a.seasonLabel),
  );
  const defaultA = seasons[0]?.seasonLabel ?? "";
  const defaultB = seasons.find((s) => s.seasonLabel !== defaultA)?.seasonLabel ?? defaultA;
  const aLabel = sp.a ?? defaultA;
  const bLabel = sp.b ?? defaultB;
  const a = seasons.find((s) => s.seasonLabel === aLabel);
  const b = seasons.find((s) => s.seasonLabel === bLabel);
  const metrics = a && b ? compareFranchiseSeasons(a, b) : [];

  return (
    <>
      <PageHeader
        eyebrow="Head to head"
        title="Compare Wolves seasons"
        description="Pick two seasons and compare the record, ranks, and postseason footprint from the franchise season feed."
      />
      <SurfaceCard className="mb-8 p-4">
        <form action="/compare/seasons" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-sm font-semibold text-zinc-300">
            Season A
            <select name="a" defaultValue={aLabel} className="mt-2 min-h-12 w-full rounded-xl border border-zinc-700/90 bg-zinc-950/60 px-3 py-2 text-base text-white sm:text-sm">
              {seasons.map((season) => (
                <option key={`a-${season.seasonLabel}`} value={season.seasonLabel}>
                  {season.seasonLabel}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-zinc-300">
            Season B
            <select name="b" defaultValue={bLabel} className="mt-2 min-h-12 w-full rounded-xl border border-zinc-700/90 bg-zinc-950/60 px-3 py-2 text-base text-white sm:text-sm">
              {seasons.map((season) => (
                <option key={`b-${season.seasonLabel}`} value={season.seasonLabel}>
                  {season.seasonLabel}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="min-h-12 self-end rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-400">
            Compare
          </button>
        </form>
      </SurfaceCard>

      {a && b ? (
        <section aria-labelledby="season-compare-results">
          <SectionHeader
            id="season-compare-results"
            title={`${a.seasonLabel} vs ${b.seasonLabel}`}
            description="Leader markers are directional; rank metrics treat lower as better."
          />
          <StatTable
            caption={`Compare ${a.seasonLabel} and ${b.seasonLabel}`}
            columns={["Metric", a.seasonLabel, b.seasonLabel, "Edge"]}
            rows={metrics.map((metric) => [
              metric.label,
              metric.a,
              metric.b,
              metric.leader === "a"
                ? a.seasonLabel
                : metric.leader === "b"
                  ? b.seasonLabel
                  : metric.leader === "tie"
                    ? "Tie"
                    : "-",
            ])}
          />
          <p className="mt-5 text-sm text-zinc-500">
            <Link href={`/seasons/${a.seasonLabel}`} className={`text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
              Open {a.seasonLabel}
            </Link>
            <span className="text-zinc-700"> · </span>
            <Link href={`/seasons/${b.seasonLabel}`} className={`text-emerald-400 hover:text-emerald-300 ${premiumLinkFocus}`}>
              Open {b.seasonLabel}
            </Link>
          </p>
        </section>
      ) : (
        <EmptyState title="Choose two valid seasons" description="The comparison needs two season labels from the franchise index." />
      )}
    </>
  );
}
