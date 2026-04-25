import type { ReactNode } from "react";

type PageHeaderProps = {
  /** Small label above the title (e.g. section context). */
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header aria-label="Page" className="mb-10 sm:mb-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-zinc-900/20 px-5 py-7 shadow-xl shadow-black/10 ring-1 ring-white/[0.03] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-emerald-500/45 after:via-zinc-600/80 after:to-transparent sm:px-7 sm:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="max-w-4xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.45rem] md:leading-[1.15]">
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-[1.05rem] sm:leading-relaxed">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}
