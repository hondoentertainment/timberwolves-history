import "server-only";

import { NBA_STATS_BASE } from "./constants";
import type { NbaStatsJson } from "./types";
import { parseNbaStatsJson } from "./parse";

const DEFAULT_TIMEOUT_MS = 8_000;

const browserLikeHeaders: Record<string, string> = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Connection: "keep-alive",
  Origin: "https://www.nba.com",
  Referer: "https://www.nba.com/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
};

export type NbaFetchInit = {
  timeoutMs?: number;
  next?: { revalidate?: number; tags?: string[] };
  cache?: RequestCache;
};

export async function nbaStatsFetch(
  endpoint: string,
  params: Record<string, string | number | undefined>,
  init: NbaFetchInit = {},
): Promise<NbaStatsJson> {
  const safeEndpoint = endpoint.replace(/^\/+/, "");
  if (!/^[a-zA-Z0-9_]+$/.test(safeEndpoint)) {
    throw new Error("Invalid NBA stats endpoint");
  }

  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    search.set(k, String(v));
  }

  const url = `${NBA_STATS_BASE}/${safeEndpoint}?${search.toString()}`;
  const timeoutMs = init.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // Do not combine `cache: "no-store"` with `next: { revalidate }` — Next ignores
    // revalidate/tags when no-store is set, which bypasses the Data Cache and hammers upstream.
    const fetchInit: RequestInit = {
      method: "GET",
      headers: browserLikeHeaders,
      signal: controller.signal,
    };
    if (init.next) {
      fetchInit.next = init.next;
      if (init.cache !== undefined) {
        fetchInit.cache = init.cache;
      }
    } else {
      fetchInit.cache = init.cache ?? "no-store";
    }
    const res = await fetch(url, fetchInit);
    if (!res.ok) {
      throw new Error(`NBA stats HTTP ${res.status} for ${safeEndpoint}`);
    }
    const text = await res.text();
    return parseNbaStatsJson(text);
  } finally {
    clearTimeout(t);
  }
}
