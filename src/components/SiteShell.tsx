import Link from "next/link";
import { Suspense } from "react";

import { DataFreshness } from "@/components/DataFreshness";
import { FranchiseStatsFreshness } from "@/components/FranchiseStatsFreshness";
import { PrimaryNav } from "@/components/PrimaryNav";
import { getCorrectionMailto } from "@/lib/corrections";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col text-zinc-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-lg"
      >
        Skip to content
      </a>
      <header
        aria-label="Site"
        className="site-header sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/70 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4">
          <Link
            href="/"
            className="group shrink-0 rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
          >
            <span className="block bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-xl font-semibold tracking-tight text-transparent">
              Wolves History
            </span>
            <span className="mt-0.5 block text-xs font-medium tracking-wide text-zinc-500 transition-colors group-hover:text-zinc-400">
              Minnesota Timberwolves franchise archive
            </span>
          </Link>
          <PrimaryNav />
        </div>
      </header>
      <main
        id="main"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:py-14 md:py-16"
      >
        {children}
      </main>
      <footer className="site-footer mt-auto border-t border-zinc-800/80 bg-zinc-950/80 py-10 text-sm text-zinc-500">
        <div className="mx-auto max-w-6xl space-y-4 px-4">
          <Suspense fallback={<DataFreshness franchiseStatsFetchedAtIso={null} />}>
            <FranchiseStatsFreshness />
          </Suspense>
          <p className="max-w-3xl leading-relaxed">
            Player and team statistics are fetched server-side from{" "}
            <a
              className="font-medium text-emerald-400/95 underline decoration-emerald-500/40 underline-offset-2 outline-offset-2 transition hover:text-emerald-300 hover:decoration-emerald-400/60 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
              href="https://www.nba.com/stats"
            >
              NBA.com Stats
            </a>{" "}
            for personal, non-commercial reference. This site is not affiliated with the NBA or
            the Minnesota Timberwolves.
          </p>
          <p className="max-w-3xl leading-relaxed">
            Coaching summaries on coach pages combine NBA roster-era stats with a static head-coach
            register derived from public sources (see each page).
          </p>
          <p>
            <Link
              className="font-medium text-emerald-400/95 underline decoration-emerald-500/40 underline-offset-2 outline-offset-2 transition hover:text-emerald-300 hover:decoration-emerald-400/60 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
              href="/changelog"
            >
              Changelog
            </Link>
            <span className="text-zinc-600"> · </span>
            <Link
              className="font-medium text-emerald-400/95 underline decoration-emerald-500/40 underline-offset-2 outline-offset-2 transition hover:text-emerald-300 hover:decoration-emerald-400/60 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
              href="/feed.xml"
            >
              RSS
            </Link>
            <span className="text-zinc-600"> · </span>
            <a
              className="font-medium text-emerald-400/95 underline decoration-emerald-500/40 underline-offset-2 outline-offset-2 transition hover:text-emerald-300 hover:decoration-emerald-400/60 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
              href={getCorrectionMailto()}
            >
              Suggest a correction
            </a>
            <span className="text-zinc-600"> — </span>
            <span className="text-zinc-600">sources, static JSON, caching, and limitations.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
