import { describe, expect, it } from "vitest";
import {
  exerciseHasHistory,
  formatLastSessionSummary,
  getLastSessionSets,
  getSetsForExercise,
  mergeSessions,
} from "./history";
import type { Session } from "./types";

const seedSession: Session = {
  id: "seed-1",
  session_type_id: "type-push",
  started_at: "2026-09-10T18:00:00.000Z",
  exercise_ids: ["ex-bench"],
  started_exercise_ids: ["ex-bench"],
  sets: [
    {
      id: "s1",
      exercise_id: "ex-bench",
      weight_lb: 90,
      reps: 10,
      logged_at: "2026-09-10T18:04:00.000Z",
    },
  ],
};

const legsSession: Session = {
  id: "legs-1",
  session_type_id: "type-legs",
  started_at: "2026-09-12T18:00:00.000Z",
  exercise_ids: ["ex-bench"],
  started_exercise_ids: ["ex-bench"],
  sets: [
    {
      id: "s2",
      exercise_id: "ex-bench",
      weight_lb: 100,
      reps: 10,
      logged_at: "2026-09-12T18:04:00.000Z",
    },
  ],
};

describe("history", () => {
  it("merges seed and stored sessions without duplicate ids", () => {
    const merged = mergeSessions([seedSession], [seedSession]);
    expect(merged).toHaveLength(1);
  });

  it("returns last session sets across workout types", () => {
    const merged = mergeSessions([seedSession], [legsSession]);
    const last = getLastSessionSets(merged, "ex-bench", "new-session");
    expect(last).toHaveLength(1);
    expect(last[0].weight_lb).toBe(100);
  });

  it("formats empty last session copy", () => {
    expect(formatLastSessionSummary([])).toBe("No previous session yet");
    expect(formatLastSessionSummary(seedSession.sets)).toBe("90×10");
  });

  it("collects sets for an exercise and can exclude one session", () => {
    const merged = mergeSessions([seedSession], [legsSession]);
    expect(getSetsForExercise(merged, "ex-bench")).toHaveLength(2);
    expect(getSetsForExercise(merged, "ex-bench", "legs-1")).toHaveLength(1);
  });

  it("detects exercise history excluding current session", () => {
    const merged = mergeSessions([seedSession], []);
    expect(exerciseHasHistory(merged, "ex-bench", "live")).toBe(true);
    expect(exerciseHasHistory(merged, "ex-fly", "live")).toBe(false);
  });
});
