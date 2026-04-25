"use client";

import { useCallback, useRef, useState } from "react";
import { useReportWebVitals } from "next/web-vitals";

import type { NextWebVitalsMetric } from "@/lib/performance/next-metric";
import { processWebVital } from "@/lib/performance/process-web-vital";
import { worseRating, type VitalRating } from "@/lib/performance/web-vitals-policy";

type SessionIssue = {
  name: string;
  rating: VitalRating;
  recommendations: string[];
  value: number;
  at: number;
};

const ENDPOINT = process.env.NEXT_PUBLIC_PERF_ENDPOINT?.trim();
const SHOW_DEV_PANEL = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_PERF_UI === "1";

function postVital(payload: Record<string, unknown>) {
  if (!ENDPOINT) return;
  const url = ENDPOINT.startsWith("/") ? ENDPOINT : `/${ENDPOINT}`;
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* non-blocking */
  });
}

/**
 * Subscribes to Next.js Web Vitals. When metrics fall below targets, logs actionable
 * recommendations and optionally POSTs to {@link ENDPOINT} (e.g. `/api/vitals`).
 */
export function PerformanceMonitor() {
  const issuesRef = useRef<Map<string, SessionIssue>>(new Map());
  const [, bump] = useState(0);

  const report = useCallback((metric: NextWebVitalsMetric) => {
    const processed = processWebVital({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
    });
    if (!processed) return;

    if (processed.shouldRecommend) {
      console.warn(
        `[perf] ${processed.name} (${processed.rating})`,
        processed.value,
        processed.recommendations,
      );
      postVital(processed.payload);

      if (SHOW_DEV_PANEL) {
        const prev = issuesRef.current.get(processed.name);
        const nextRating = worseRating(prev?.rating ?? null, processed.rating);
        if (nextRating) {
          issuesRef.current.set(processed.name, {
            name: processed.name,
            rating: nextRating,
            recommendations: processed.recommendations,
            value: processed.value,
            at: Date.now(),
          });
          bump((n) => n + 1);
        }
      }
    }
  }, []);

  useReportWebVitals(report);

  if (!SHOW_DEV_PANEL) return null;

  return <DevPerfPanel issues={issuesRef} />;
}

function DevPerfPanel({ issues }: { issues: React.MutableRefObject<Map<string, SessionIssue>> }) {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(true);
  const list = [...issues.current.values()].sort((a, b) => b.at - a.at);

  if (dismissed || list.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[200] max-w-sm rounded-xl border border-amber-500/30 bg-zinc-950/95 p-3 text-xs text-zinc-200 shadow-xl shadow-black/40 backdrop-blur-md"
      role="status"
      aria-label="Performance recommendations"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-amber-200/95">Perf monitor</p>
        <div className="flex gap-1">
          <button
            type="button"
            className="rounded px-1.5 py-0.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            {open ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            className="rounded px-1.5 py-0.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            onClick={() => setDismissed(true)}
          >
            Dismiss
          </button>
        </div>
      </div>
      {open ? (
        <ul className="mt-2 max-h-64 space-y-3 overflow-y-auto pr-1">
          {list.map((issue) => (
            <li key={issue.name} className="border-t border-zinc-800/80 pt-2 first:border-t-0 first:pt-0">
              <p className="font-medium text-zinc-100">
                {issue.name}{" "}
                <span className="text-zinc-500">
                  ({issue.rating}) {issue.value < 10 ? issue.value.toFixed(3) : Math.round(issue.value)}
                </span>
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-zinc-400">
                {issue.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-2 text-[10px] leading-snug text-zinc-600">
        Shown when metrics need improvement. Set <code className="text-zinc-500">NEXT_PUBLIC_PERF_UI=0</code>{" "}
        in prod builds to hide. POST vitals to <code className="text-zinc-500">NEXT_PUBLIC_PERF_ENDPOINT</code>.
      </p>
    </div>
  );
}
