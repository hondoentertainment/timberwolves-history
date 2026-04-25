type PageHeaderProps = {
  /** Small label above the title (e.g. section context). */
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header aria-label="Page" className="mb-10 sm:mb-12">
      <div className="relative pb-8 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-emerald-500/45 after:via-zinc-600/80 after:to-transparent">
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
    </header>
  );
}
