/** Sort key for NBA season slugs like `2003-04` (start year dominant). */
export function seasonChronoKey(seasonId: string): number {
  const m = /^(\d{4})-(\d{2})$/.exec(seasonId.trim());
  if (!m) return 0;
  return Number(m[1]) * 100 + Number(m[2]);
}

export function compareSeasonIds(a: string, b: string): number {
  return seasonChronoKey(a) - seasonChronoKey(b);
}
