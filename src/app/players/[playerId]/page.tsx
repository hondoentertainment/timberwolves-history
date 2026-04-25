import Link from "next/link";
import { notFound } from "next/navigation";

import { EditorialProse } from "@/components/EditorialProse";
import { PlayerHeadshot } from "@/components/PlayerHeadshot";
import {
  ProfileHero,
  ProfileLayout,
  ProfileMetaGrid,
  ProfileSection,
} from "@/components/profile";
import { RelatedReading, type RelatedReadingLink } from "@/components/RelatedReading";
import { StatTable } from "@/components/StatTable";
import { getRelatedStoriesForPlayer } from "@/lib/entity-links";
import { getAllEraHubsForPlayer } from "@/lib/eras";
import { getLongreadRelatedLinksForPlayer } from "@/lib/profile-related-from-graph";
import { formatCareerStatRows } from "@/lib/player-format";
import { getPlayerBio, playerBiosAttribution } from "@/lib/player-bios";
import { computeWolvesHighlightBullets } from "@/lib/player-highlights";
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

  const tenureNote = indexRow ? (
    <>
      <p>
        Appeared for the Wolves in{" "}
        <span className="text-zinc-200">{indexRow.seasons.length}</span> tracked seasons:{" "}
        <span className="text-zinc-300">{indexRow.seasons.join(", ")}</span>
      </p>
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
