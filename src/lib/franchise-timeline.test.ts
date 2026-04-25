import { describe, expect, it } from "vitest";

import {
  anniversaryInReferenceYear,
  getFranchiseTimeline,
  getTimelineEventsInCurrentCalendarWeek,
} from "./franchise-timeline";

describe("franchise-timeline week matching", () => {
  it("maps occursOn to the reference calendar year", () => {
    const ref = new Date(2026, 3, 24);
    const ann = anniversaryInReferenceYear("2018-04-21", ref);
    expect(ann?.getFullYear()).toBe(2026);
    expect(ann?.getMonth()).toBe(3);
    expect(ann?.getDate()).toBe(21);
  });

  it("returns playoff drought event in the ISO week of 2018-04-21", () => {
    const events = getFranchiseTimeline();
    const anchor = new Date(2018, 3, 21);
    const hits = getTimelineEventsInCurrentCalendarWeek(anchor, events);
    const titles = hits.map((e) => e.headline);
    expect(titles.some((t) => t.includes("Playoff drought"))).toBe(true);
  });
});
