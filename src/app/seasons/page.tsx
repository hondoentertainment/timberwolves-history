import Link from "next/link";
import type { Metadata } from "next";

import { DataCadenceNote } from "@/components/DataCadenceNote";
import { PageHeader } from "@/components/PageHeader";
import { ChipLink, EmptyState, SurfaceCard } from "@/components/PremiumUX";
import { StatTable } from "@/components/StatTable";
import { coachNamesForSeason } from "@/lib/coaches";
import { getAllEras, getEraBySlug } from "@/lib/eras";
import { collectThemeFacetsForSeasons, seasonLabelMatchesThemeParam } from "@/lib/season-theme-facets";
import { getFranchiseSeasonsOrEmpty } from "@/lib/nba/queries";

export const revalidate = 3600;

function formatPct(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  return n.toFixed(3);
}

function humanizeTheme(slug: string): string {
  return slug.replace(/-/g, " ");
}

type SeasonsSearchParams = Promise<{ playoffs?: string; era?: string; theme?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SeasonsSearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const eraSlug = typeof sp.era === "string" ? sp.era.trim() : "";
  const themeSlug = typeof sp.theme === "string" ? sp.theme.trim() : "";
  const era = eraSlug ? getEraBySlug(eraSlug) : undefined;
  const playoffsOnly = sp.playoffs === "1" || sp.playoffs === "true";

  const activeFilters = [
    playoffsOnly ? "Playoff years" : null,
    era ? era.title : null,
    themeSlug ? `Theme: ${humanizeTheme(themeSlug)}` : null,
  ].filter(Boolean) as string[];

  const title =
    activeFilters.length > 0 ? `Season by season · ${activeFilters.join(" · ")}` : "Season by season";

  const description =
    activeFilters.length > 0
      ? `${title} — Minnesota Timberwolves franchise regular-season records, playoff results, and coach context on Wolves History.`
      : "Franchise regular-season records, playoff results, and coach context. Filter by playoff years, era highlights, or editorial themes.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

type PageProps = { searchParams: SeasonsSearchParams };

export default async function SeasonsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const seasons = await getFranchiseSeasonsOrEmpty();
  const eraSlug = typeof sp.era === "string" ? sp.era.trim() : "";
  const themeSlug = typeof sp.theme === "string" ? sp.theme.trim() : "";
  const era = eraSlug ? getEraBySlug(eraSlug) : undefined;
  const playoffsOnly = sp.playoffs === "1" || sp.playoffs === "true";

  let list = [...seasons].reverse();
  if (playoffsOnly) {
    list = list.filter((s) => s.playoffWins + s.playoffLosses > 0);
  }
  if (era) {
    const allowed = new Set(era.highlightSeasonIds);
    list = list.filter((s) => allowed.has(s.seasonLabel));
  }
  if (themeSlug) {
    list = list.filter((s) => seasonLabelMatchesThemeParam(s.seasonLabel, themeSlug));
  }

  const eras = getAllEras();
  const themeFacets = collectThemeFacetsForSeasons(seasons.map((s) => s.seasonLabel)).slice(0, 28);

  const hrefFrom = (over: Partial<{ playoffs: boolean; era: string; theme: string }>) => {
    const p = "playoffs" in over ? over.playoffs! : playoffsOnly;
    const e = "era" in over ? over.era! : eraSlug;
    const t = "theme" in over ? over.theme! : themeSlug;
    const qs = new URLSearchParams();
    if (p) qs.set("playoffs", "1");
    if (e) qs.set("era", e);
    if (t) qs.set("theme", t);
    const q = qs.toString();
    return q ? `/seasons?${q}` : "/seasons";
  };

  const chip = (label: string, href: string, active: boolean) => (
    <ChipLink key={href} href={href} active={active}>
      {label}
    </ChipLink>
  );

  const rows = list.map((s) => {
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

  const tableCaption = (() => {
    if (playoffsOnly && era && themeSlug) {
      return `Timberwolves seasons (${era.title} highlights, playoff years, theme: ${humanizeTheme(themeSlug)})`;
    }
    if (playoffsOnly && era) {
      return `Timberwolves seasons (${era.title} highlights, playoff years)`;
    }
    if (playoffsOnly && themeSlug) {
      return `Timberwolves seasons (playoff years, theme: ${humanizeTheme(themeSlug)})`;
    }
    if (era && themeSlug) {
      return `Timberwolves seasons (${era.title} highlights, theme: ${humanizeTheme(themeSlug)})`;
    }
    if (playoffsOnly) return "Timberwolves seasons (playoff years)";
    if (era) return `Timberwolves seasons (${era.title} highlights)`;
    if (themeSlug) return `Timberwolves seasons (theme: ${humanizeTheme(themeSlug)})`;
    return "Timberwolves seasons";
  })();

  const activeFilters = [
    playoffsOnly ? "Playoff years" : null,
    era ? era.title : null,
    themeSlug ? `Theme: ${humanizeTheme(themeSlug)}` : null,
  ].filter(Boolean);

  return (
    <>
      <PageHeader
        title="Season by season"
        description="Franchise regular-season records, playoff results, and coach context. Filter by playoff years, era highlights, or editorial themes."
      />
      <DataCadenceNote
        routeRevalidateSeconds={3600}
        label="This page"
        includeTeamStatsFetchedAt
      >
        <p>Table rows follow the same franchise team-year feed as season hub pages (cached together).</p>
      </DataCadenceNote>
      <nav
        aria-label="Season filters"
        className="mb-6 flex flex-col gap-3 rounded-2xl border border-zinc-800/85 bg-zinc-900/30 p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.03]"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Filters</span>
        <div className="flex flex-wrap gap-2">
          {chip("All seasons", hrefFrom({ playoffs: false, era: "", theme: "" }), !playoffsOnly && !eraSlug && !themeSlug)}
          {chip("Playoff years", hrefFrom({ playoffs: !playoffsOnly }), playoffsOnly)}
          {eras.map((e) =>
            chip(
              e.title.replace(/ era$/, ""),
              hrefFrom({ era: eraSlug === e.slug ? "" : e.slug }),
              eraSlug === e.slug,
            ),
          )}
        </div>
        <p className="text-xs leading-relaxed text-zinc-600">
          Era filters focus on highlight seasons from each hub; theme filters follow recurring story
          arcs across the archive.
        </p>
      </nav>
      {themeFacets.length ? (
        <nav
          aria-label="Theme facets"
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-zinc-800/85 bg-zinc-900/30 p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.03]"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Themes</span>
          <div className="flex flex-wrap gap-2">
            {chip("Clear theme", hrefFrom({ theme: "" }), !themeSlug)}
            {themeFacets.map((t) =>
              chip(
                humanizeTheme(t),
                hrefFrom({ theme: themeSlug === t ? "" : t }),
                themeSlug === t,
              ),
            )}
          </div>
        </nav>
      ) : null}
      {!seasons.length ? (
        <EmptyState
          tone="warning"
          title="Season feed temporarily unavailable"
          description="NBA.com team stats are unavailable right now. Retry shortly; cached pages fill once the feed responds."
          className="mb-6"
        />
      ) : null}
      {themeSlug && !list.length ? (
        <EmptyState
          tone="warning"
          title={`No seasons matched "${humanizeTheme(themeSlug)}"`}
          description={
            <>
              Try clearing the theme or loosening the current filter set.{" "}
          <Link href={hrefFrom({ theme: "" })} className="font-medium text-emerald-400 hover:text-emerald-300">
            Clear theme
          </Link>
              .
            </>
          }
          className="mb-6"
        />
      ) : null}
      <SurfaceCard className="mb-4 flex flex-col gap-2 px-4 py-3 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing <strong className="font-semibold text-zinc-100">{list.length}</strong> of{" "}
          <strong className="font-semibold text-zinc-100">{seasons.length}</strong> seasons
          {activeFilters.length ? ` · ${activeFilters.join(" · ")}` : ""}
        </span>
        {activeFilters.length ? (
          <Link href="/seasons" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Clear all filters
          </Link>
        ) : null}
      </SurfaceCard>
      <StatTable
        caption={tableCaption}
        columns={["Season", "W", "L", "Win%", "Playoffs (W-L)", "Head coach (register)"]}
        rows={rows}
      />
    </>
  );
}
