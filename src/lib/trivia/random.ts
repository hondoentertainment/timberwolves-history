/** Fisher–Yates shuffle (returns a new array). */
export function shuffled<T>(items: readonly T[], rng: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = a[i];
    a[i] = a[j]!;
    a[j] = t!;
  }
  return a;
}

export function pickUnique<T>(pool: readonly T[], count: number, rng: () => number): T[] {
  const copy = shuffled(pool, rng);
  return copy.slice(0, Math.min(count, copy.length));
}

export function intFromRange(min: number, max: number, rng: () => number): number {
  return min + Math.floor(rng() * (max - min + 1));
}
