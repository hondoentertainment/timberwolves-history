import Link from "next/link";
import type { ReactNode } from "react";

type ClassValue = string | false | null | undefined;

function cx(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

export const premiumLinkFocus =
  "outline-offset-2 transition focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-zinc-800/85 bg-zinc-900/35 shadow-lg shadow-black/15 ring-1 ring-white/[0.03]",
        className,
      )}
    >
      {children}
    </div>
  );
}

type ChipLinkProps = {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
};

export function ChipLink({ href, children, active = false, className }: ChipLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-xs font-semibold capitalize tracking-wide transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70",
        active
          ? "border-emerald-400/55 bg-emerald-400/12 text-emerald-50 shadow-[0_0_0_1px_rgba(52,211,153,0.08),0_10px_24px_-18px_rgba(52,211,153,0.9)]"
          : "border-zinc-700/90 bg-zinc-950/30 text-zinc-400 hover:border-zinc-600 hover:bg-white/[0.055] hover:text-zinc-100",
        className,
      )}
    >
      {children}
    </Link>
  );
}

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "warning";
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  tone = "neutral",
  className,
}: EmptyStateProps) {
  const warning = tone === "warning";
  return (
    <div
      className={cx(
        "rounded-2xl border px-5 py-5 text-sm leading-relaxed ring-1",
        warning
          ? "border-amber-500/25 bg-amber-950/25 text-amber-100/95 ring-amber-500/10"
          : "border-dashed border-zinc-800 bg-zinc-900/30 text-zinc-400 ring-white/[0.02]",
        className,
      )}
    >
      <p className={cx("font-semibold", warning ? "text-amber-50" : "text-zinc-200")}>{title}</p>
      {description ? <div className="mt-1 text-zinc-500">{description}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

type SearchFormProps = {
  action: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  submitLabel?: string;
  className?: string;
};

export function SearchForm({
  action,
  label,
  placeholder,
  defaultValue = "",
  submitLabel = "Search",
  className,
}: SearchFormProps) {
  return (
    <form
      className={cx(
        "flex max-w-2xl flex-col gap-3 rounded-2xl border border-zinc-800/85 bg-zinc-900/30 p-2 shadow-inner shadow-black/20 ring-1 ring-white/[0.03] sm:flex-row sm:items-stretch",
        className,
      )}
      action={action}
      method="get"
    >
      <label htmlFor="q" className="sr-only">
        {label}
      </label>
      <input
        id="q"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-h-12 w-full flex-1 rounded-xl border border-transparent bg-zinc-950/50 px-4 py-3 text-base text-white shadow-inner shadow-black/20 placeholder:text-zinc-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 sm:text-sm"
      />
      <button
        type="submit"
        className="min-h-12 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 outline-offset-2 transition hover:from-emerald-400 hover:to-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300/80 active:translate-y-px"
      >
        {submitLabel}
      </button>
    </form>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
};

export function SectionHeader({ eyebrow, title, description, action, id }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-emerald-400/85">
            {eyebrow}
          </p>
        ) : null}
        <h2 id={id} className="text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        {description ? <div className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-500">{description}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  detail?: ReactNode;
  href?: string;
};

export function StatCard({ label, value, detail, href }: StatCardProps) {
  const body = (
    <SurfaceCard className="h-full p-5 transition duration-200 hover:border-zinc-700/90 hover:bg-zinc-900/50">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm leading-relaxed text-zinc-500">{detail}</p> : null}
    </SurfaceCard>
  );

  if (!href) return body;

  return (
    <Link href={href} className={cx("block h-full rounded-2xl", premiumLinkFocus)}>
      {body}
    </Link>
  );
}
