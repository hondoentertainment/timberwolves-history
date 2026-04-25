import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { figuresAttribution, getAllFigures } from "@/lib/figures";

export const metadata: Metadata = {
  title: "Franchise figures",
  description:
    "Editorial capsules on owners, broadcasters, and other non-player personas tied to Timberwolves history.",
};

export default function FiguresIndexPage() {
  const figures = getAllFigures();
  return (
    <>
      <PageHeader
        title="Franchise figures"
        description={`${figuresAttribution()} These are not NBA.com profiles—use linked sources for verification.`}
      />
      <ul className="space-y-4">
        {figures.map((f) => (
          <li
            key={f.slug}
            className="rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-5 ring-1 ring-white/[0.03]"
          >
            <h2 className="text-lg font-semibold text-white">
              <Link
                href={`/figures/${f.slug}`}
                className="text-emerald-400/95 hover:text-emerald-300 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
              >
                {f.title}
              </Link>
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {f.role} · {f.yearsLabel}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.paragraphs[0]}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
