import timelineFile from "@/data/franchise-timeline.json";

export type TimelineEvent = {
  dateLabel: string;
  headline: string;
  body: string;
  /**
   * Anchor calendar date (YYYY-MM-DD) for anniversaries. Week matching uses month/day in the
   * viewer’s local year (see `getTimelineEventsInCurrentCalendarWeek`).
   */
  occursOn?: string;
};

export function getFranchiseTimeline(): TimelineEvent[] {
  return timelineFile.events as TimelineEvent[];
}

function startOfWeekMonday(d: Date): Date {
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = c.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  c.setDate(c.getDate() + diff);
  c.setHours(0, 0, 0, 0);
  return c;
}

function endOfWeekSunday(d: Date): Date {
  const s = startOfWeekMonday(d);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
}

/** Month/day from `occursOn`, placed in `ref`’s calendar year (handles Feb 29 edge). */
export function anniversaryInReferenceYear(occursOn: string, ref: Date): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(occursOn.trim());
  if (!m) return null;
  const month = Number(m[2]);
  const day = Number(m[3]);
  const ann = new Date(ref.getFullYear(), month - 1, day);
  if (ann.getMonth() !== month - 1) {
    return new Date(ref.getFullYear(), month, 0);
  }
  return ann;
}

/** Events whose anniversary (month/day) falls in the Monday–Sunday week of `now` (local). */
export function getTimelineEventsInCurrentCalendarWeek(
  now: Date,
  events: TimelineEvent[],
): TimelineEvent[] {
  const ws = startOfWeekMonday(now);
  const we = endOfWeekSunday(now);
  return events.filter((e) => {
    if (!e.occursOn) return false;
    const ann = anniversaryInReferenceYear(e.occursOn, now);
    if (!ann) return false;
    return ann >= ws && ann <= we;
  });
}

export function timelineAttribution(): string {
  return timelineFile.attribution;
}
