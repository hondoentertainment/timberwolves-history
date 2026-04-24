import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { erasAttribution, getAllEras } from "@/lib/eras";

export const metadata: Metadata = {
  title: "Eras",
  description:
    "Editorial era hubs for Minnesota Timberwolves history—starting with the Kevin Garnett era pilot.",
};

export default function ErasIndexPage() {
  const eras = getAllEras();
  return (
    <>
      <PageHeader
        title="Franchise eras"
        description={`${erasAttribution()} More era hubs can be added alongside the pilot below.`}
      />
      <ul className="space-y-4">
        {eras.map((e) => (
          <li
            key={e.slug}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-4"
          >
            <h2 className="text-lg font-semibold text-white">
              <Link
                href={`/eras/${e.slug}`}
                className="text-emerald-400 outline-offset-2 hover:text-emerald-300 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/80"
              >
                {e.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-zinc-500">{e.yearsLabel}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
