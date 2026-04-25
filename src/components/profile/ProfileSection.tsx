import type { ReactNode } from "react";

type ProfileSectionProps = {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

function titleToSectionBase(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return slug.length ? slug : "section";
}

export function ProfileSection({ id, title, description, children }: ProfileSectionProps) {
  const base = id ?? titleToSectionBase(title);
  const headingId = `${base}-heading`;
  return (
    <section id={base} aria-labelledby={headingId} className="scroll-mt-24">
      <div className="mb-4 flex flex-col gap-2 border-b border-zinc-800/70 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3">
          <span
            className="h-7 w-0.5 shrink-0 rounded-full bg-gradient-to-b from-emerald-400/80 to-teal-600/40 sm:h-8 sm:w-1"
            aria-hidden
          />
          <h2
            id={headingId}
            className="text-xl font-semibold tracking-tight text-white sm:text-[1.35rem]"
          >
            {title}
          </h2>
        </div>
        {description ? (
          <p className="max-w-xl text-pretty text-xs leading-relaxed text-zinc-500 sm:text-right sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
