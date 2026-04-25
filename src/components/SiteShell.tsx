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
        className="site-header sticky top-0 z-50 border-b border-white/10 bg-zinc-950/82 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.95)] backdrop-blur-2xl backdrop-saturate-150"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent"
        />
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            <span className="hidden text-emerald-300/85 sm:inline">Minnesota Timberwolves archive</span>
            <span className="text-zinc-500">1989 to today</span>
            <Link
              className="rounded-full border border-emerald-400/20 px-2.5 py-1 text-[0.65rem] text-emerald-200/90 outline-offset-2 transition hover:border-emerald-300/45 hover:bg-emerald-400/10 hover:text-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
              href="/about-data"
            >
              Data notes
            </Link>
          </div>
          <div className="grid gap-4 py-4 lg:grid-cols-[minmax(15rem,1fr)_auto] lg:items-center">
            <Link
              href="/"
              className="group flex min-w-0 items-center gap-3 rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-emerald-300/25 bg-gradient-to-br from-emerald-300/20 via-zinc-900 to-sky-400/10 text-sm font-black tracking-tight text-emerald-100 shadow-lg shadow-emerald-950/30 transition group-hover:border-emerald-300/45">
                WH
              </span>
              <span className="min-w-0">
                <span className="block bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-xl font-semibold tracking-tight text-transparent sm:text-2xl">
                  Wolves History
                </span>
                <span className="mt-0.5 block truncate text-xs font-medium tracking-wide text-zinc-500 transition-colors group-hover:text-zinc-400 sm:text-sm">
                  Seasons, profiles, eras, stories, and franchise context
                </span>
              </span>
            </Link>
            <div className="-mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
              <PrimaryNav />
            </div>
          </div>
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
