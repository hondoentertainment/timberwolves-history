import { PageHeader } from "@/components/PageHeader";
import { getCorrectionMailto } from "@/lib/corrections";

type Props = {
  title?: string;
  description?: string;
};

export function DataTransparencyPage({
  title = "About the data",
  description =
    "How this site combines live NBA.com stats, cached fetches, and hand-maintained project data for Wolves History.",
}: Props) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-white">Live stats (NBA.com)</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Team year-over-year records, per-season rosters, and player career tables are
            fetched <strong>on the server</strong> from{" "}
            <a
              href="https://www.nba.com/stats"
              rel="noopener noreferrer"
              className="text-emerald-400 underline-offset-2 hover:underline"
            >
              NBA.com Stats
            </a>{" "}
            endpoints (see <code className="text-zinc-300">src/lib/nba/</code>). The browser
            never calls the NBA directly (CORS, headers, and abuse prevention).
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Responses are cached with Next.js <code className="text-zinc-300">revalidate</code>{" "}
            windows and tags such as <code className="text-zinc-300">nba-team-years</code>,{" "}
            <code className="text-zinc-300">wolves-players</code>, and{" "}
            <code className="text-zinc-300">nba-roster</code>.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Scheduled refresh</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            The route <code className="text-zinc-300">/api/cron/rebuild</code> (secured with{" "}
            <code className="text-zinc-300">CRON_SECRET</code>) calls{" "}
            <code className="text-zinc-300">revalidateTag</code> on Vercel Cron (see{" "}
            <code className="text-zinc-300">vercel.json</code>). Set the secret in your hosting
            project environment; without it the route returns 401 (same as a bad secret).
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Static JSON (editorial / register)</h2>
          <ul className="mt-2 list-disc space-y-2 ps-5 text-sm text-zinc-400">
            <li>
              <code className="text-zinc-300">src/data/wolves-coaches.json</code> — head coach
              register and optional bios.
            </li>
            <li>
              <code className="text-zinc-300">src/data/wolves-memes.json</code> — fan-culture
              list.
            </li>
            <li>
              <code className="text-zinc-300">src/data/season-stories.json</code> — short season
              blurbs on season pages.
            </li>
            <li>
              <code className="text-zinc-300">src/data/player-bios.json</code> — optional player
              essays keyed by NBA player ID.
            </li>
            <li>
              <code className="text-zinc-300">src/data/eras.json</code> — era hub pilots and
              metadata.
            </li>
            <li>
              <code className="text-zinc-300">src/data/franchise-timeline.json</code> — milestone
              timeline copy; optional <code className="text-zinc-300">occursOn</code> anchors power the
              home “this week in Wolves history” widget.
            </li>
            <li>
              <code className="text-zinc-300">src/data/draft-picks-by-season.json</code> — curated
              draft rows for every season, including explicit empty years.
            </li>
            <li>
              <code className="text-zinc-300">src/data/all-time-players.json</code> — complete
              all-time roster fallback used for player discovery and season-page roster fallback.
            </li>
            <li>
              <code className="text-zinc-300">src/data/transactions-by-season.json</code> — curated
              trades and waiver-wire notes for narrative context.
            </li>
            <li>
              <code className="text-zinc-300">src/data/guided-paths.json</code> — curated URLs for
              the Browse page “guided paths” block (season filters and era shortcuts).
            </li>
            <li>
              <code className="text-zinc-300">src/data/entity-links.json</code> — cross-links from
              players/coaches to flagship stories.
            </li>
            <li>
              <code className="text-zinc-300">src/data/wolves-figures.json</code> — non-player
              franchise capsules (owners, broadcast, etc.).
            </li>
            <li>
              <code className="text-zinc-300">src/data/changelog.json</code> — substantive site and
              content updates for the public changelog.
            </li>
            <li>
              Longreads ship as typed modules under{" "}
              <code className="text-zinc-300">src/content/longreads/</code> (not live NBA data).
            </li>
          </ul>
        </section>
        <section id="sitemap-strategy">
          <h2 className="text-xl font-semibold text-white">Sitemap (search engines)</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            The XML sitemap is implemented in <code className="text-zinc-300">src/app/sitemap.ts</code>{" "}
            and is marked <code className="text-zinc-300">force-dynamic</code> so a single build step is
            not required to materialize the full player URL list alongside other routes (player fan-out
            plus a cold all-time roster fetch can be heavy).
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-zinc-400">
            <li>
              <strong className="text-zinc-300">Static and hub URLs</strong> — e.g. home, seasons index,
              browse, memes, explore vignettes, leaders: listed with <code className="text-zinc-300">daily</code>{" "}
              or <code className="text-zinc-300">weekly</code> change frequency; home uses priority{" "}
              <code className="text-zinc-300">1</code>, other listed static paths use <code className="text-zinc-300">0.8</code>.
            </li>
            <li>
              <strong className="text-zinc-300">Per-season, coach, era, longread, and figure pages</strong> —{" "}
              generated from project data; priorities are <code className="text-zinc-300">0.6</code> (seasons),{" "}
              <code className="text-zinc-300">0.55</code> (eras), <code className="text-zinc-300">0.65</code> (stories),{" "}
              <code className="text-zinc-300">0.4</code> (coaches), and <code className="text-zinc-300">0.35</code> (figures).
            </li>
            <li>
              <strong className="text-zinc-300">Player pages</strong> — URLs are built from{" "}
              <code className="text-zinc-300">getCachedAllTimeWolvesPlayers()</code> inside a{" "}
              <code className="text-zinc-300">try/catch</code> block. If that call throws, the sitemap
              omits individual player entries for that run (other entries still emit). Default priority
              for player routes is <code className="text-zinc-300">0.5</code> with a weekly change frequency.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Known limitations</h2>
          <ul className="mt-2 list-disc space-y-2 ps-5 text-sm text-zinc-400">
            <li>
              Postseason <strong>round labels</strong> use NBA’s{" "}
              <code className="text-zinc-300">NBA_FINALS_APPEARANCE</code> string when present; we
              do not infer bracket rounds from wins and losses alone.
            </li>
            <li>
              Coaching names on season tables are matched from the static register and may
              overlap in odd interim years.
            </li>
            <li>
              Season rosters prefer NBA.com live roster rows. If a roster feed times out or returns
              empty, the page falls back to the all-time player snapshot for that season, with blank
              vitals where the snapshot does not carry jersey, height, weight, or country.
            </li>
          </ul>
        </section>
        <section id="cache-windows">
          <h2 className="text-xl font-semibold text-white">Cache windows (HIST-006)</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Next.js <code className="text-zinc-300">revalidate</code> on routes controls how long a
            rendered page may be served before regeneration is eligible. Cron invalidates tagged NBA
            caches separately—see <code className="text-zinc-300">/api/cron/rebuild</code>.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            The site footer also shows the last successful server cache fill for the NBA.com{" "}
            <strong>team year-over-year</strong> bundle when available. Player career calls and
            per-season rosters use their own windows and are not timestamped line-by-line there.
          </p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-800/80">
            <table className="w-full min-w-[28rem] text-left text-sm text-zinc-400">
              <thead className="border-b border-zinc-800 bg-zinc-900/50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-2">Route pattern</th>
                  <th className="px-4 py-2">Typical revalidate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs text-zinc-500">/</td>
                  <td className="px-4 py-2">3600s</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs text-zinc-500">
                    /seasons, /seasons/[year]
                  </td>
                  <td className="px-4 py-2">3600s</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs text-zinc-500">/players/[id]</td>
                  <td className="px-4 py-2">3600s</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs text-zinc-500">/players (index)</td>
                  <td className="px-4 py-2">86400s</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs text-zinc-500">/players/leaders</td>
                  <td className="px-4 py-2">Dynamic (on-demand)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Sensitive chapters (STORY-007)</h2>
          <ul className="mt-2 list-disc space-y-2 ps-5 text-sm text-zinc-400">
            <li>
              Treat locker-room conflict, injuries, and ownership politics as{" "}
              <strong className="text-zinc-300">sourced prose</strong>—not inferred from box scores.
            </li>
            <li>
              Prefer even-handed framing; avoid punch-down humor on individuals; link primary-care
              reporting when available.
            </li>
            <li>
              Use <code className="text-zinc-300">lastReviewed</code> on era hubs or essays when you
              materially revise sensitive passages.
            </li>
          </ul>
        </section>
        <section id="suggest-correction">
          <h2 className="text-xl font-semibold text-white">Corrections</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Reference sites improve through trust loops, not by pretending day-one copy is
            perfect. Use{" "}
            <a
              href={getCorrectionMailto()}
              className="font-medium text-emerald-400 underline-offset-2 hover:underline"
            >
              Suggest a correction
            </a>{" "}
            (opens your mail client with a short template). Set{" "}
            <code className="text-zinc-300">NEXT_PUBLIC_CORRECTIONS_EMAIL</code> in production to
            prefill the recipient.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Factual fixes to static JSON are also welcome via git (pull requests or local edits).
            Keep citations on editorial pages when you add new claims; flagship essays may carry a{" "}
            <strong className="text-zinc-300">last reviewed</strong> stamp in metadata.
          </p>
        </section>
      </div>
    </>
  );
}
