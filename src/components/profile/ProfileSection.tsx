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
    <section id={base} aria-labelledby={headingId}>
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id={headingId} className="text-lg font-semibold text-white">
          {title}
        </h2>
        {description ? (
          <p className="text-xs text-zinc-500 sm:max-w-md sm:text-right">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
