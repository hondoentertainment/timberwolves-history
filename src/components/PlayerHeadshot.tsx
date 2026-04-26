"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function PlayerHeadshot({
  playerId,
  name,
  width = 208,
  height = 156,
  className = "",
  /** Hint LCP when this headshot is above the fold (e.g. player profile hero). */
  priority = false,
}: {
  playerId: number;
  name: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const initials = useMemo(() => initialsFromName(name), [name]);
  const onError = useCallback(() => setFailed(true), []);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 text-2xl font-semibold tracking-tight text-zinc-200 ring-1 ring-white/10 ${className}`}
        style={{ width, height }}
        aria-label={`${name} (initials; headshot unavailable)`}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`}
      alt={`Headshot of ${name}`}
      width={width}
      height={height}
      priority={priority}
      className={`rounded-xl border border-zinc-700/80 bg-zinc-900 object-cover shadow-lg shadow-black/40 ring-1 ring-white/10 ${className}`}
      unoptimized
      onError={onError}
    />
  );
}
