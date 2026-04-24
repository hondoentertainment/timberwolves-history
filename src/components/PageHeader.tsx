type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header aria-label="Page" className="mb-8 border-b border-zinc-800 pb-6">
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-400">
          {description}
        </p>
      ) : null}
    </header>
  );
}
