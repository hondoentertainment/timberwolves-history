import { describe, expect, it } from "vitest";

import { coachCoversSeason } from "@/lib/coaches";

describe("coachCoversSeason", () => {
  it("returns true when the coach tenure spans the season", () => {
    expect(coachCoversSeason("flip-saunders", "2003-04")).toBe(true);
  });

  it("returns false for unknown coach ids", () => {
    expect(coachCoversSeason("not-a-real-coach", "2003-04")).toBe(false);
  });
});
