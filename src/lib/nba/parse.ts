import "server-only";

import type { NbaResultSet, NbaStatsJson } from "./types";

export function getResultSet(
  data: NbaStatsJson,
  indexOrName: number | string,
): NbaResultSet | undefined {
  const sets = data.resultSets;
  if (!sets?.length) return undefined;
  if (typeof indexOrName === "number") return sets[indexOrName];
  return sets.find((s) => s.name === indexOrName);
}

export function rowsToObjects<T extends Record<string, unknown>>(
  rs: NbaResultSet,
): T[] {
  const { headers, rowSet } = rs;
  if (!Array.isArray(headers) || !Array.isArray(rowSet)) {
    return [];
  }
  return rowSet.map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? null;
    });
    return obj as T;
  });
}

export function parseNbaStatsJson(text: string): NbaStatsJson {
  const data = JSON.parse(text) as unknown;
  if (
    data === null ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !("resultSets" in data)
  ) {
    throw new Error("Invalid NBA stats JSON");
  }
  return data as NbaStatsJson;
}
