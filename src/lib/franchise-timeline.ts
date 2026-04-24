import timelineFile from "@/data/franchise-timeline.json";

export type TimelineEvent = {
  dateLabel: string;
  headline: string;
  body: string;
};

export function getFranchiseTimeline(): TimelineEvent[] {
  return timelineFile.events as TimelineEvent[];
}

export function timelineAttribution(): string {
  return timelineFile.attribution;
}
