import type { ReactNode } from "react";

type ProfileHeroProps = {
  title: string;
  subtitle?: string;
  /** Optional badge (e.g. “Player”, “Head coach”). */
  role?: string;
  media?: ReactNode;
  /** Intro copy under the title (stats attribution, disclaimers, etc.). */
  intro?: ReactNode;
};

export function ProfileHero({ title, subtitle, role, media, intro }: ProfileHeroProps) {
  return (
    <header
      aria-label="Profile"
      className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-6 shadow-xl shadow-black/30 ring-1 ring-white/[0.04] sm:p-8"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-start">
        {media ? (
          <div className="shrink-0 [&_img]:rounded-xl [&_img]:border [&_img]:border-zinc-700/80 [&_img]:shadow-lg [&_img]:shadow-black/40 [&_img]:ring-1 [&_img]:ring-white/10">
            {media}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          {role ? (
            <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300/95">
              {role}
            </span>
          ) : null}
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.35rem] md:leading-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-pretty text-sm text-zinc-400 sm:text-base">{subtitle}</p>
          ) : null}
          {intro ? (
            <div className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-400 sm:text-[0.9375rem]">
              {intro}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
