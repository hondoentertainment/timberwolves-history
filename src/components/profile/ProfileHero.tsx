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
    <header aria-label="Profile" className="border-b border-zinc-800 pb-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {media ? <div className="shrink-0">{media}</div> : null}
        <div className="min-w-0 flex-1">
          {role ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400/90">
              {role}
            </p>
          ) : null}
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">{subtitle}</p>
          ) : null}
          {intro ? <div className="mt-4 text-sm leading-relaxed text-zinc-400">{intro}</div> : null}
        </div>
      </div>
    </header>
  );
}
