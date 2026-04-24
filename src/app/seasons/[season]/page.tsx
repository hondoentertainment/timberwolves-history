import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ProfileHero,
  ProfileLayout,
  ProfileSection,
  SeasonStoryBlurb,
} from "@/components/profile";
import { StatTable } from "@/components/StatTable";
import { coachNamesForSeason } from "@/lib/coaches";
import { formatPlayoffNarrative } from "@/lib/playoff-summary";
import {
  fetchTeamRoster,
  getFranchiseSeasonsOrEmpty,
  parseRoster,
} from "@/lib/nba/queries";
import { parseSeasonSlug } from "@/lib/nba/seasons";
import { getSeasonStory } from "@/lib/season-stories";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageProps = { params: Promise<{ season: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { season: raw } = await params;
  const seasonId = decodeURIComponent(raw);
  const valid = parseSeasonSlug(seasonId);
  if (!valid) return { title: "Season" };
  return {
    title: `${valid} season`,
    description: `Minnesota Timberwolves roster, record, and postseason snapshot for the ${valid} NBA season.`,
  };
}

export default async function SeasonDetailPage({ params }: PageProps) {
  const { season: raw } = await params;
  const seasonId = decodeURIComponent(raw);
  const valid = parseSeasonSlug(seasonId);
  if (!valid) notFound();

  const [franchiseRows, rosterJson] = await Promise.all([
    getFranchiseSeasonsOrEmpty(),
    fetchTeamRoster(valid).catch(() => null),
  ]);
  const summary = franchiseRows.find((r) => r.seasonLabel === valid);
  const roster = rosterJson
    ? parseRoster(rosterJson, valid).sort((a, b) => a.name.localeCompare(b.name))
    : [];
  const coachNames = coachNamesForSeason(valid);
  const story = getSeasonStory(valid);

  const playoffLine = summary
    ? formatPlayoffNarrative({
        playoffWins: summary.playoffWins,
        playoffLosses: summary.playoffLosses,
        finalsAppearance: String(summary.raw["NBA_FINALS_APPEARANCE"] ?? ""),
      })
    : "Season stats unavailable.";

  const intro = summary ? (
    <div className="space-y-2">
      <p>
        <span className="text-zinc-300">Regular season: </span>
        <span className="font-medium text-white">
          {summary.wins}-{summary.losses}
        </span>
        {summary.winPct !== null ? (
          <span className="text-zinc-400"> ({summary.winPct.toFixed(3)} win pct)</span>
        ) : null}
        <span className="text-zinc-500"> · Source: NBA.com team year-over-year stats.</span>
      </p>
      <p className="text-zinc-300">{playoffLine}</p>
    </div>
  ) : (
    <p className="text-zinc-400">
      Season summary from NBA.com was not found for this label. Roster below may still load.
    </p>
  );

  const rosterRows = roster.map((p) => [
    <Link
      key={p.playerId}
      href={`/players/${p.playerId}`}
      className="font-medium text-emerald-400 hover:text-emerald-300"
    >
      {p.name}
    </Link>,
    p.number || "—",
    p.position || "—",
    p.height || "—",
    p.weight || "—",
    p.country || "—",
  ]);

  return (
    <ProfileLayout>
      <ProfileHero title={`${valid} Timberwolves`} role="Season" intro={intro} />
      {story ? (
        <SeasonStoryBlurb blurb={story.blurb} updated={story.updated} />
      ) : null}
      <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
        <span>
          <span className="text-zinc-500">Conference rank: </span>
          {summary?.confRank ?? "—"}
        </span>
        <span>
          <span className="text-zinc-500">Division rank: </span>
          {summary?.divRank ?? "—"}
        </span>
        <span>
          <span className="text-zinc-500">Head coach (register): </span>
          {coachNames.length ? coachNames.join(", ") : "—"}
        </span>
      </div>
      <ProfileSection
        id="roster"
        title="Roster"
        description="Opening-night style listing from NBA.com common team roster for this season."
      >
        <StatTable
          caption={`Timberwolves roster ${valid}`}
          columns={["Player", "#", "Pos", "Ht", "Wt", "Country"]}
          rows={rosterRows}
          emptyLabel="No roster rows returned for this season."
        />
      </ProfileSection>
      <p className="text-sm text-zinc-500">
        <Link href="/seasons" className="text-emerald-400 hover:text-emerald-300">
          ← All seasons
        </Link>
      </p>
    </ProfileLayout>
  );
}
