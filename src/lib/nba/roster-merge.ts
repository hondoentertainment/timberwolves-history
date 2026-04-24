export function mergeRosterIntoIndex(
  index: Map<number, { name: string; seasons: Set<string> }>,
  seasonId: string,
  roster: { playerId: number; name: string }[],
) {
  for (const p of roster) {
    const cur =
      index.get(p.playerId) ??
      ({ name: p.name, seasons: new Set<string>() } as {
        name: string;
        seasons: Set<string>;
      });
    if (p.name) cur.name = p.name;
    cur.seasons.add(seasonId);
    index.set(p.playerId, cur);
  }
}
