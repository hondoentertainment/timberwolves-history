import "server-only";

export function liveNbaStatsEnabled(): boolean {
  return process.env.NBA_LIVE_STATS === "1";
}
