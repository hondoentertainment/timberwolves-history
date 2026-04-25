import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
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

type PageProps = { searchParams: Promise<{ playoffs?: string; era?: string; theme?: string }> };

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
    <Link
      key={href}
      href={href}
      aria-current={active ? "true" : undefined}
      className={[
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100"
          : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
      ].join(" ")}
    >
      {label}
    </Link>
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

  return (
    <>
      <PageHeader
        title="Season by season"
        description="Franchise regular-season records and playoff game wins and losses from NBA.com team year-over-year stats. Coaching names are matched from a static head-coach register when seasons overlap. Optional theme filters use merged season story graphs (blurbs + era highlights)."
      />
      <nav
        aria-label="Season filters"
        className="mb-6 flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-4 sm:flex-row sm:flex-wrap sm:items-center"
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
        <p className="text-xs text-zinc-600 sm:ml-auto sm:max-w-md">
          Era filter uses each hub’s <strong className="text-zinc-500">highlight seasons</strong>{" "}
          list (editorial subset, not every calendar year in the span). Theme chips match{" "}
          <code className="text-zinc-500">graph.themes</code> after merge with inferred era-highlight tags.
        </p>
      </nav>
      {themeFacets.length ? (
        <nav
          aria-label="Theme facets"
          className="mb-6 flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/25 p-4"
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
        <p className="mb-6 rounded-2xl border border-amber-500/25 bg-amber-950/25 px-5 py-4 text-sm leading-relaxed text-amber-100/95 ring-1 ring-amber-500/10">
          NBA.com team stats are temporarily unavailable (build or network). Retry shortly; cached
          pages fill once the feed responds.
        </p>
      ) : null}
      {themeSlug && !list.length ? (
        <p className="mb-6 rounded-lg border border-amber-500/20 bg-amber-950/20 px-4 py-3 text-sm text-amber-100/90">
          No seasons matched theme “{humanizeTheme(themeSlug)}” with the current filters.{" "}
          <Link href={hrefFrom({ theme: "" })} className="font-medium text-emerald-400 hover:text-emerald-300">
            Clear theme
          </Link>
          .
        </p>
      ) : null}
      <StatTable
        caption={tableCaption}
        columns={["Season", "W", "L", "Win%", "Playoffs (W-L)", "Head coach (register)"]}
        rows={rows}
      />
    </>
  );
}
