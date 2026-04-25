import Link from "next/link";
import type { ReactNode } from "react";

type Accent = "emerald" | "sky" | "violet" | "amber";

const accents: Record<Accent, { bar: string; link: string }> = {
  emerald: {
    bar: "from-emerald-400 to-teal-500",
    link: "text-emerald-300 hover:text-emerald-200",
  },
  sky: {
    bar: "from-sky-400 to-cyan-500",
    link: "text-sky-300 hover:text-sky-200",
  },
  violet: {
    bar: "from-violet-400 to-purple-500",
    link: "text-violet-300 hover:text-violet-200",
  },
  amber: {
    bar: "from-amber-400 to-orange-500",
    link: "text-amber-300 hover:text-amber-200",
  },
};

type FeatureCardProps = {
  title: string;
  description: string;
  href: string;
  cta: string;
  accent?: Accent;
  /** Optional footer line (e.g. attribution). */
  footer?: ReactNode;
};

export function FeatureCard({
  title,
  description,
  href,
  cta,
  accent = "emerald",
  footer,
}: FeatureCardProps) {
  const a = accents[accent];
  return (
    <section className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 shadow-lg shadow-black/20 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-zinc-700/90 hover:bg-zinc-900/55 hover:shadow-xl">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${a.bar} to-transparent opacity-80`}
        aria-hidden
      />
      <div className="relative flex items-start gap-3">
        <span
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br ${a.bar} shadow-sm`}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-zinc-400">{description}</p>
        </div>
      </div>
      <div className="relative mt-5 flex flex-1 flex-col justify-end">
        <Link
          href={href}
          className={`inline-flex w-fit items-center gap-1 text-sm font-semibold ${a.link} outline-offset-2 transition-colors focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70`}
        >
          {cta}
          <span aria-hidden className="translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
        {footer ? <div className="mt-4 border-t border-zinc-800/80 pt-4 text-xs text-zinc-500">{footer}</div> : null}
      </div>
    </section>
  );
}
