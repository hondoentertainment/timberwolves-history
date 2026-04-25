"use client";

import { useCallback, useState } from "react";

export function LongreadReadModeShell({ children }: { children: React.ReactNode }) {
  const [readMode, setReadMode] = useState(false);
  const toggle = useCallback(() => setReadMode((v) => !v), []);

  return (
    <div
      className={
        readMode
          ? "read-mode-active rounded-2xl border border-zinc-800/60 bg-zinc-950/95 px-4 py-6 sm:px-8"
          : ""
      }
    >
      <div className="no-print mb-6 flex justify-end">
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm font-medium text-zinc-200 outline-offset-2 transition hover:border-emerald-700/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400/70"
        >
          {readMode ? "Exit read mode" : "Read mode"}
        </button>
      </div>
      {children}
    </div>
  );
}
