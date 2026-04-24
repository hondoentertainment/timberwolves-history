import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EditorialProse } from "@/components/EditorialProse";
import {
  ProfileHero,
  ProfileLayout,
  ProfileMetaGrid,
  ProfileSection,
} from "@/components/profile";
import { StatTable } from "@/components/StatTable";
import { getEraHubLinkForPlayer } from "@/lib/eras";
import { formatCareerStatRows } from "@/lib/player-format";
import { getPlayerBio, playerBiosAttribution } from "@/lib/player-bios";
import { getCachedAllTimeWolvesPlayers } from "@/lib/nba/players-index";
import {
  fetchCommonPlayerInfo,
  fetchPlayerCareerStats,
  filterWolvesSeasons,
  parseCommonPlayerInfo,
  parseSeasonTotalsPerGame,
} from "@/lib/nba/queries";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageProps = { params: Promise<{ playerId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { playerId: raw } = await params;
  const id = Number(raw);
  if (!Number.isFinite(id)) return { title: "Player" };
  const infoJson = await fetchCommonPlayerInfo(id);
  const row = parseCommonPlayerInfo(infoJson);
  const name = row ? String(row["DISPLAY_FIRST_LAST"] ?? `Player ${id}`) : `Player ${id}`;
  return {
    title: name,
    description: `${name} — Minnesota Timberwolves career splits and NBA.com player profile.`,
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { playerId: raw } = await params;
  const id = Number(raw);
  if (!Number.isFinite(id)) notFound();

  const [infoJson, careerJson, index] = await Promise.all([
    fetchCommonPlayerInfo(id),
    fetchPlayerCareerStats(id),
    getCachedAllTimeWolvesPlayers().catch(() => [] as { playerId: number; seasons: string[] }[]),
  ]);

  const info = parseCommonPlayerInfo(infoJson);
  if (!info) notFound();

  const name = String(info["DISPLAY_FIRST_LAST"] ?? `Player ${id}`);
  const careerRows = parseSeasonTotalsPerGame(careerJson);
  const wolvesRows = filterWolvesSeasons(careerRows);
  const allRows = formatCareerStatRows(careerRows);
  const wolvesTable = formatCareerStatRows(wolvesRows);
  const indexRow = index.find((p) => p.playerId === id);
  const editorialBio = getPlayerBio(id);
  const eraHub = getEraHubLinkForPlayer(id);

  const jersey = String(info["JERSEY"] ?? "");
  const position = String(info["POSITION"] ?? "");
  const height = String(info["HEIGHT"] ?? "");
  const weight = String(info["WEIGHT"] ?? "");
  const birth = String(info["BIRTHDATE"] ?? "");
  const country = String(info["COUNTRY"] ?? "");
  const school = String(info["SCHOOL"] ?? "");
  const draftYear = String(info["DRAFT_YEAR"] ?? "");
  const draftNum = String(info["DRAFT_NUMBER"] ?? "");

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

  const tenureNote = indexRow ? (
    <p>
      Appeared on a Wolves roster in{" "}
      <span className="text-zinc-200">{indexRow.seasons.length}</span> tracked seasons:{" "}
      <span className="text-zinc-300">{indexRow.seasons.join(", ")}</span>
    </p>
  ) : (
    <p className="text-amber-200/90">
      Not found in the merged all-time roster index (may still have career rows if traded
      mid-year or missing roster rows for older seasons).
    </p>
  );

  return (
    <ProfileLayout>
      <ProfileHero
        role="Player"
        title={name}
        intro={
          <p>
            Per-game regular-season splits from NBA.com. Wolves tenure highlights rows where
            the team abbreviation is MIN.
          </p>
        }
        media={
          <Image
            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`}
            alt={`Headshot of ${name}`}
            width={208}
            height={156}
            className="rounded-lg border border-zinc-800 bg-zinc-900 object-cover"
            unoptimized
          />
        }
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
          {eraHub ? (
            <p className="mt-4 text-sm text-zinc-500">
              <Link
                href={`/eras/${eraHub.slug}`}
                className="text-emerald-400 outline-offset-2 hover:text-emerald-300 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/80"
              >
                {eraHub.linkLabel} →
              </Link>
            </p>
          ) : null}
        </ProfileSection>
      ) : null}
      <ProfileSection id="vitals" title="Bio & vitals">
        <ProfileMetaGrid rows={metaRows} />
      </ProfileSection>
      <ProfileSection id="tenure" title="Wolves roster index" description="Merged season rosters.">
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
      <p className="text-sm text-zinc-500">
        <Link href="/players" className="text-emerald-400 hover:text-emerald-300">
          ← All players
        </Link>
      </p>
    </ProfileLayout>
  );
}
