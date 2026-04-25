import Link from "next/link";
import { Suspense } from "react";

import { DataFreshness } from "@/components/DataFreshness";
import { FranchiseStatsFreshness } from "@/components/FranchiseStatsFreshness";
import { PrimaryNav } from "@/components/PrimaryNav";
import { getCorrectionMailto } from "@/lib/corrections";

const mobileQuickNav = [
  { href: "/start-here", label: "Start" },
  { href: "/browse", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/explore", label: "Explore" },
] as const;

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
        className="site-header sticky top-0 z-50 border-b border-white/10 bg-zinc-950/90 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl backdrop-saturate-150"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            <span className="min-w-0 truncate text-emerald-400/90">Minnesota Timberwolves archive</span>
            <span className="shrink-0 tabular-nums text-zinc-500">Story, stats, context</span>
          </div>
          <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-5">
            <Link
              href="/"
              className="group flex min-w-0 shrink-0 items-center gap-3 rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-300/30 bg-gradient-to-br from-emerald-300/18 via-zinc-900 to-sky-400/10 text-xs font-black tracking-tight text-emerald-100 shadow-md shadow-emerald-950/25 transition group-hover:border-emerald-300/50 sm:h-11 sm:w-11 sm:rounded-2xl sm:text-sm">
                WH
              </span>
              <span className="min-w-0">
                <span className="block bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-lg font-semibold tracking-tight text-transparent sm:text-xl md:text-2xl">
                  Wolves History
                </span>
                <span className="mt-0.5 block text-xs font-medium leading-snug tracking-wide text-zinc-500 transition-colors group-hover:text-zinc-400 sm:text-sm">
                  Deep Wolves archive from 1989 to today
                </span>
              </span>
            </Link>
            <div className="relative -mx-4 min-w-0 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] lg:mx-0 lg:max-w-none lg:flex-1 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-zinc-950/90 to-transparent lg:hidden"
              />
              <PrimaryNav />
            </div>
          </div>
        </div>
      </header>
      <main
        id="main"
        className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-12 sm:py-14 md:py-16"
      >
        {children}
      </main>
      <nav
        aria-label="Mobile quick navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-zinc-950/92 px-3 py-2 shadow-[0_-18px_44px_-28px_rgba(0,0,0,0.95)] backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
          {mobileQuickNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 touch-manipulation items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-2 text-xs font-semibold text-zinc-300 outline-offset-2 transition hover:bg-white/[0.08] hover:text-white active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
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
            <span className="text-zinc-600"> · </span>
            <Link
              className="font-medium text-emerald-400/95 underline decoration-emerald-500/40 underline-offset-2 outline-offset-2 transition hover:text-emerald-300 hover:decoration-emerald-400/60 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
              href="/about-data"
            >
              About the data
            </Link>
            <span className="text-zinc-600"> — caching, sources, and limitations.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
