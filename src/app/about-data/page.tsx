import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About the data",
  description:
    "How Wolves History combines NBA.com stats, static JSON, editorial content, and scheduled cache refresh.",
};

export default function AboutDataPage() {
  return (
    <>
      <PageHeader
        title="About the data"
        description="Transparency for readers and for anyone extending this codebase. Nothing here is an official NBA or Timberwolves data product."
      />
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
            project environment; without it the route returns 501.
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
              timeline copy.
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
              The merged all-time player index walks many seasons; the first cold build can be
              slow—cached afterward.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Corrections</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Factual fixes to static JSON are welcome via your normal git workflow (pull requests
            or local edits). Keep citations on editorial pages when you add new claims.
          </p>
        </section>
      </div>
    </>
  );
}
