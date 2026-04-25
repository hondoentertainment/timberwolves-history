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
import { getDraftPicksForSeason } from "@/lib/draft-picks";
import { getFallbackAllTimeWolvesPlayers } from "@/lib/nba/players-index";
import { formatPlayoffNarrative } from "@/lib/playoff-summary";
import {
  fetchTeamRoster,
  getFranchiseSeasonsOrEmpty,
  parseRoster,
} from "@/lib/nba/queries";
import type { RosterEntry } from "@/lib/nba/queries";
import { parseSeasonSlug } from "@/lib/nba/seasons";
import { getSeasonStory } from "@/lib/season-stories";
import {
  getTransactionsForSeason,
  transactionKindLabel,
  transactionsAttribution,
} from "@/lib/transactions-season";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageProps = { params: Promise<{ season: string }> };

function fallbackRosterForSeason(seasonId: string): RosterEntry[] {
  return getFallbackAllTimeWolvesPlayers()
    .filter((p) => p.seasons.includes(seasonId))
    .map((p) => ({
      playerId: p.playerId,
      name: p.name,
      number: "",
      position: "",
      height: "",
      weight: "",
      birthDate: "",
      country: "",
      seasonId,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

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
  const liveRoster = rosterJson
    ? parseRoster(rosterJson, valid).sort((a, b) => a.name.localeCompare(b.name))
    : [];
  const roster = liveRoster.length ? liveRoster : fallbackRosterForSeason(valid);
  const rosterSource = liveRoster.length ? "NBA.com common team roster" : "local all-time roster snapshot";
  const coachNames = coachNamesForSeason(valid);
  const story = getSeasonStory(valid);
  const draftPicks = getDraftPicksForSeason(valid);
  const transactions = getTransactionsForSeason(valid);
  const hasWaiverWireRows = transactions.some((t) => t.kind === "waiver");

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

  const draftRows = draftPicks.map((d) => [
    d.round,
    d.pickOverall,
    d.playerName,
    d.note && d.note.length ? d.note : "—",
  ]);

  const pageNavItems = [
    story ? { href: "#story", label: "Story" } : null,
    { href: "#draft", label: "Draft" },
    { href: transactions.length ? "#transactions" : "#curated-transactions", label: "Transactions" },
    { href: "#roster", label: "Roster" },
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <ProfileLayout navItems={pageNavItems}>
      <ProfileHero title={`${valid} Timberwolves`} role="Season" intro={intro} />
      {story ? (
        <SeasonStoryBlurb
          blurb={story.blurb}
          updated={story.updated}
          graph={story.graph}
          graphPlayerLabels={story.graphPlayerLabels}
        />
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
      {draftPicks.length ? (
        <ProfileSection
          id="draft"
          title="Draft class (curated)"
          description="Wolves draft-history rows from the team’s official historical register—not a complete league draft log."
        >
          <StatTable
            caption={`Timberwolves draft selections ${valid}`}
            columns={["Rd", "Pick", "Player", "Note"]}
            rows={draftRows}
          />
        </ProfileSection>
      ) : (
        <ProfileSection
          id="draft"
          title="Draft class (curated)"
          description="Coverage is complete for this season in the Wolves draft-history register."
        >
          <p className="text-sm leading-relaxed text-zinc-400">
            No Wolves draft selections are listed for this season.
          </p>
        </ProfileSection>
      )}
      {transactions.length ? (
        <ProfileSection
          id="transactions"
          title="Trades & waiver wire"
          description={transactionsAttribution()}
        >
          <ul className="space-y-4 text-sm leading-relaxed text-zinc-300">
            {transactions.map((t) => (
              <li
                key={`${t.kind ?? "transaction"}-${t.dateLabel}-${t.summary.slice(0, 24)}`}
                className="border-b border-zinc-800/60 pb-4 last:border-b-0"
              >
                <p className="flex flex-wrap items-center gap-2 font-medium text-zinc-200">
                  <span>{t.dateLabel}</span>
                  <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[0.68rem] uppercase tracking-wide text-emerald-200">
                    {transactionKindLabel(t.kind)}
                  </span>
                </p>
                <p className="mt-1 text-zinc-400">{t.summary}</p>
              </li>
            ))}
          </ul>
          {!hasWaiverWireRows ? (
            <p className="mt-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-3 text-xs leading-relaxed text-zinc-500">
              No sourced waiver-wire claim or release is listed for this season yet. Curated waiver
              rows will appear here alongside trade and signing notes as coverage expands.
            </p>
          ) : null}
        </ProfileSection>
      ) : null}
      {!transactions.length ? (
        <ProfileSection
          id="curated-transactions"
          title="Curated trades & waiver wire"
          description="Honest gap marker for transaction context — not a substitute for league archives."
        >
          <p className="text-sm leading-relaxed text-zinc-400">
            There are no static editorial rows in{" "}
            <code className="text-zinc-500">transactions-by-season.json</code> for this season yet.
            Roster and standings above still come from NBA.com where available, and draft coverage is
            handled separately from the official Wolves draft-history register.
          </p>
        </ProfileSection>
      ) : null}
      <ProfileSection
        id="roster"
        title="Roster"
        description={`Player coverage from ${rosterSource}. Blank vitals mean the fallback player snapshot is being used.`}
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
