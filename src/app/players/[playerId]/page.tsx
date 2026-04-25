import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { EditorialProse } from "@/components/EditorialProse";
import { PlayerHeadshot } from "@/components/PlayerHeadshot";
import {
  ProfileHero,
  ProfileLayout,
  ProfileMetaGrid,
  ProfileSection,
} from "@/components/profile";
import { EmptyState, SurfaceCard, premiumLinkFocus } from "@/components/PremiumUX";
import { RelatedReading, type RelatedReadingLink } from "@/components/RelatedReading";
import { StatTable } from "@/components/StatTable";
import { getRelatedStoriesForPlayer } from "@/lib/entity-links";
import { getAllEraHubsForPlayer } from "@/lib/eras";
import { getLongreadRelatedLinksForPlayer } from "@/lib/profile-related-from-graph";
import { formatCareerStatRows } from "@/lib/player-format";
import { getPlayerBio, playerBiosAttribution } from "@/lib/player-bios";
import { computeWolvesHighlightBullets, summarizeWolvesStatRows } from "@/lib/player-highlights";
import { getCachedAllTimeWolvesPlayers } from "@/lib/nba/players-index";
import { liveNbaStatsEnabled } from "@/lib/nba/live";
import {
  fetchCommonPlayerInfo,
  fetchPlayerCareerStats,
  filterWolvesSeasons,
  getFranchiseSeasonsOrEmpty,
  parseCommonPlayerInfo,
  parseSeasonTotalsPerGame,
} from "@/lib/nba/queries";
import { playoffTeamSeasonOverlapCount } from "@/lib/wolves-tenure-snapshot";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageProps = { params: Promise<{ playerId: string }> };

function formatPeak(value: number | null, season: string | null, suffix: string): string {
  if (!value || !season) return "—";
  return `${value.toFixed(1)} ${suffix} (${season})`;
}

function ProfileStatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: ReactNode;
}) {
  return (
    <SurfaceCard className="p-4">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
      {detail ? <div className="mt-1 text-xs leading-relaxed text-zinc-500">{detail}</div> : null}
    </SurfaceCard>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { playerId: raw } = await params;
  const id = Number(raw);
  if (!Number.isFinite(id)) return { title: "Player" };
  const [infoJson, index] = await Promise.all([
    liveNbaStatsEnabled() ? fetchCommonPlayerInfo(id).catch(() => null) : Promise.resolve(null),
    getCachedAllTimeWolvesPlayers().catch(() => []),
  ]);
  const row = infoJson ? parseCommonPlayerInfo(infoJson) : null;
  const indexRow = index.find((p) => p.playerId === id);
  const name = row ? String(row["DISPLAY_FIRST_LAST"] ?? indexRow?.name ?? `Player ${id}`) : (indexRow?.name ?? `Player ${id}`);
  return {
    title: name,
    description: `${name} — Minnesota Timberwolves career splits and NBA.com player profile.`,
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { playerId: raw } = await params;
  const id = Number(raw);
  if (!Number.isFinite(id)) notFound();

  const live = liveNbaStatsEnabled();
  const [infoJson, careerJson, index, franchiseSeasons] = await Promise.all([
    live ? fetchCommonPlayerInfo(id).catch(() => null) : Promise.resolve(null),
    live ? fetchPlayerCareerStats(id).catch(() => null) : Promise.resolve(null),
    getCachedAllTimeWolvesPlayers().catch(() => [] as { playerId: number; name: string; seasons: string[] }[]),
    getFranchiseSeasonsOrEmpty(),
  ]);

  const info = infoJson ? parseCommonPlayerInfo(infoJson) : null;
  const indexRow = index.find((p) => p.playerId === id);
  if (!info && !indexRow) notFound();

  const name = String(info?.["DISPLAY_FIRST_LAST"] ?? indexRow?.name ?? `Player ${id}`);
  const careerRows = careerJson ? parseSeasonTotalsPerGame(careerJson) : [];
  const wolvesRows = filterWolvesSeasons(careerRows);
  const wolvesStatSummary = summarizeWolvesStatRows(wolvesRows);
  const allRows = formatCareerStatRows(careerRows);
  const wolvesTable = formatCareerStatRows(wolvesRows);
  const editorialBio = getPlayerBio(id);
  const eraHubs = getAllEraHubsForPlayer(id);
  const relatedStories = getRelatedStoriesForPlayer(id);
  const graphStories = getLongreadRelatedLinksForPlayer(id);

  const highlightBullets =
    editorialBio?.highlightBullets?.length && editorialBio.highlightBullets.length > 0
      ? editorialBio.highlightBullets
      : computeWolvesHighlightBullets(wolvesRows);

  const relatedLinks: RelatedReadingLink[] = [];
  const pushLink = (link: RelatedReadingLink) => {
    if (relatedLinks.some((l) => l.href === link.href)) return;
    relatedLinks.push(link);
  };
  for (const eraHub of eraHubs) {
    pushLink({
      href: `/eras/${eraHub.slug}`,
      label: eraHub.linkLabel,
      hint: "Era hub",
    });
  }
  for (const s of relatedStories) {
    pushLink({
      href: `/stories/${s.slug}`,
      label: s.title,
      hint: "Editorial essay",
    });
  }
  for (const l of graphStories) {
    pushLink(l);
  }

  const jersey = String(info?.["JERSEY"] ?? "");
  const position = String(info?.["POSITION"] ?? "");
  const height = String(info?.["HEIGHT"] ?? "");
  const weight = String(info?.["WEIGHT"] ?? "");
  const birth = String(info?.["BIRTHDATE"] ?? "");
  const country = String(info?.["COUNTRY"] ?? "");
  const school = String(info?.["SCHOOL"] ?? "");
  const draftYear = String(info?.["DRAFT_YEAR"] ?? "");
  const draftNum = String(info?.["DRAFT_NUMBER"] ?? "");

  const metaRows = [
    { label: "Position", value: position },
    { label: "Height", value: height },
    { label: "Weight", value: weight },
    { label: "Birthdate", value: birth },
    { label: "Country", value: country },
    { label: "School", value: school },
    {
      label: "Draft",
      value: draftYear && draftNum ? `${draftYear} · Pick ${draftNum}` : "",
    },
    { label: "Listed jersey", value: jersey },
  ];

  const playoffEraOverlap =
    indexRow && franchiseSeasons.length
      ? playoffTeamSeasonOverlapCount(indexRow.seasons, franchiseSeasons)
      : 0;

  const trackedSeasonCount = indexRow?.seasons.length ?? wolvesStatSummary.seasonCount;
  const statSourceLabel = wolvesRows.length
    ? "NBA.com MIN rows"
    : indexRow
      ? "Roster index only"
      : "Career rows only";

  const tenureNote = indexRow ? (
    <>
      <p>
        Appeared for the Wolves in <span className="text-zinc-200">{indexRow.seasons.length}</span>{" "}
        tracked season{indexRow.seasons.length === 1 ? "" : "s"}.
      </p>
      <ol className="mt-4 flex flex-wrap gap-2" aria-label={`${name} Timberwolves seasons`}>
        {indexRow.seasons.map((seasonId) => (
          <li key={seasonId}>
            <Link
              href={`/seasons/${seasonId}`}
              className={`inline-flex min-h-10 items-center rounded-full border border-zinc-800 bg-zinc-950/45 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 ${premiumLinkFocus}`}
            >
              {seasonId}
            </Link>
          </li>
        ))}
      </ol>
      {franchiseSeasons.length ? (
        <p className="mt-3 text-zinc-400">
          <span className="font-medium text-zinc-500">Playoff-era overlap:</span>{" "}
          <span className="tabular-nums text-zinc-200">{playoffEraOverlap}</span> tracked Wolves
          seasons line up with franchise years when the team had playoff games in our NBA.com team
          feed—this does <span className="italic">not</span> prove postseason minutes. Compare on{" "}
          <Link href="/players/leaders" className="text-emerald-400 hover:text-emerald-300">
            Wolves tenure leaders
          </Link>
          .
        </p>
      ) : null}
    </>
  ) : (
    <p className="text-amber-200/90">
      Not found in the merged all-time roster index (may still have career rows if traded
      mid-year or missing roster rows for older seasons).
    </p>
  );

  const pageNavItems = [
    { href: "#overview", label: "Overview" },
    editorialBio ? { href: "#story", label: "Story" } : null,
    highlightBullets.length ? { href: "#highlights", label: "Highlights" } : null,
    { href: "#vitals", label: "Vitals" },
    { href: "#tenure", label: "Seasons" },
    { href: "#wolves-stats", label: "Wolves stats" },
    { href: "#career-stats", label: "Career" },
    relatedLinks.length ? { href: "#related", label: "Related" } : null,
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <ProfileLayout navItems={pageNavItems}>
      <ProfileHero
        role="Player"
        title={name}
        intro={
          <p>
            Per-game regular-season splits from NBA.com. Wolves tenure highlights rows where
            the team abbreviation is MIN.
          </p>
        }
        media={<PlayerHeadshot playerId={id} name={name} />}
      />
      <ProfileSection
        id="overview"
        title="At a glance"
        description="Roster footprint, Wolves stat peaks, and data coverage for this profile."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ProfileStatCard
            label="Tracked Wolves seasons"
            value={String(trackedSeasonCount || "—")}
            detail={indexRow ? "From the merged all-time roster index." : "No roster-index row found."}
          />
          <ProfileStatCard
            label="MIN games in stat rows"
            value={wolvesStatSummary.totalGames ? String(wolvesStatSummary.totalGames) : "—"}
            detail={statSourceLabel}
          />
          <ProfileStatCard
            label="Best scoring row"
            value={formatPeak(wolvesStatSummary.bestPts.value, wolvesStatSummary.bestPts.season, "PPG")}
            detail="Regular-season per-game rows where team is MIN."
          />
          <ProfileStatCard
            label="Playoff-era overlap"
            value={String(playoffEraOverlap || "—")}
            detail="Team playoff seasons only; not proof of postseason minutes."
          />
        </div>
        {!wolvesRows.length ? (
          <EmptyState
            tone="warning"
            title="Wolves stat rows unavailable"
            description={
              indexRow
                ? "This profile is confirmed in the all-time Wolves roster index, but NBA.com did not return MIN per-game rows for the current cache. The tenure and related links remain available."
                : "NBA.com did not return Wolves-specific rows, and this player was not found in the roster index."
            }
            className="mt-4"
          />
        ) : null}
      </ProfileSection>
      <SurfaceCard className="p-5">
        <h2 className="text-lg font-semibold text-white">Why this profile matters</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          This page connects roster tenure, Wolves-only stat rows, editorial context, and related
          era/story links so a player profile works like a hub instead of a stat stub.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link
            href={`/compare/players?a=${id}`}
            className={`rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-2 font-semibold text-emerald-400 hover:border-zinc-700 hover:text-emerald-300 ${premiumLinkFocus}`}
          >
            Compare this tenure
          </Link>
          <Link
            href="/record-book"
            className={`rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-2 font-semibold text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 ${premiumLinkFocus}`}
          >
            Open record book
          </Link>
        </div>
      </SurfaceCard>
      {editorialBio ? (
        <ProfileSection
          id="story"
          title="Story"
          description="Editorial notes; not sourced from NBA.com player feeds."
        >
          <EditorialProse
            title="Franchise context"
            attribution={playerBiosAttribution()}
            paragraphs={editorialBio.paragraphs}
            sources={editorialBio.sources}
          />
        </ProfileSection>
      ) : null}
      {highlightBullets.length ? (
        <ProfileSection
          id="highlights"
          title="Wolves career highlights"
          description={
            editorialBio?.highlightBullets?.length
              ? "Editorial bullets from player-bios.json (override)."
              : "Derived from MIN per-game rows; not a complete advanced-stat audit."
          }
        >
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-zinc-300">
            {highlightBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </ProfileSection>
      ) : null}
      <ProfileSection id="vitals" title="Bio & vitals">
        <ProfileMetaGrid rows={metaRows} />
      </ProfileSection>
      <ProfileSection id="tenure" title="Wolves seasons" description="Tracked regular-season appearances.">
        <div className="text-sm leading-relaxed text-zinc-400">{tenureNote}</div>
      </ProfileSection>
      <ProfileSection
        id="wolves-stats"
        title="Timberwolves seasons (MIN)"
        description="Per-game rows while listed with MIN."
      >
        <StatTable
          caption={`${name} Wolves per-game splits`}
          columns={wolvesTable.columns}
          rows={wolvesTable.tableRows}
          emptyLabel="No MIN rows in career per-game table."
        />
      </ProfileSection>
      <ProfileSection id="career-stats" title="Full NBA career (per game)">
        <StatTable
          caption={`${name} full career`}
          columns={allRows.columns}
          rows={allRows.tableRows}
          emptyLabel="No career rows returned."
        />
      </ProfileSection>
      {relatedLinks.length ? (
        <ProfileSection id="related" title="Related reading" description="Era hubs and essays tied to this profile.">
          <RelatedReading links={relatedLinks} title="" />
        </ProfileSection>
      ) : null}
      <p className="text-sm text-zinc-500">
        <Link href="/players" className="text-emerald-400 hover:text-emerald-300">
          ← All players
        </Link>
      </p>
    </ProfileLayout>
  );
}
