import logFile from "@/data/changelog.json";

export type ChangelogEntry = {
  date: string;
  title: string;
  items: string[];
};

export function changelogAttribution(): string {
  return logFile.attribution;
}

export function getChangelogEntries(): ChangelogEntry[] {
  return (logFile.entries as ChangelogEntry[]).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
}
