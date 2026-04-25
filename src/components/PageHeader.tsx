type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header aria-label="Page" className="mb-10 sm:mb-12">
      <div className="relative pb-8 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-emerald-500/45 after:via-zinc-600/80 after:to-transparent">
        <h1 className="max-w-4xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.5rem] md:leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
