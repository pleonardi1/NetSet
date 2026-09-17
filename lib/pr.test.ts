import { describe, expect, it } from "vitest";
import { estimateE1rm, formatPersonalRecord, getPersonalRecord } from "./pr";

describe("pr", () => {
  it("returns heaviest qualifying set at target reps", () => {
    const pr = getPersonalRecord(
      [
        { id: "1", exercise_id: "ex-bench", weight_lb: 120, reps: 8, logged_at: "" },
        { id: "2", exercise_id: "ex-bench", weight_lb: 150, reps: 10, logged_at: "" },
        { id: "3", exercise_id: "ex-bench", weight_lb: 155, reps: 11, logged_at: "" },
      ],
      10,
    );
    expect(pr).toEqual({ weight_lb: 155, reps: 11 });
  });

  it("returns null when no qualifying sets", () => {
    expect(getPersonalRecord([], 10)).toBeNull();
    expect(formatPersonalRecord(null, 10)).toBe("No PR at this rep target yet");
  });

  it("formats a personal record line", () => {
    expect(formatPersonalRecord({ weight_lb: 150, reps: 10 }, 10)).toBe(
      "150 lb",
    );
  });

  it("estimates e1rm with Epley", () => {
    expect(estimateE1rm(100, 10)).toBeCloseTo(133.33, 1);
  });
});
