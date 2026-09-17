import { describe, expect, it } from "vitest";
import {
  formatExerciseCatalog,
  parseAssemblyJson,
  validateAssembly,
  validateAssemblyPrompt,
} from "./assemble-workout";
import type { Exercise } from "./types";

const catalog: Exercise[] = [
  {
    id: "ex-smith-squat",
    name: "Smith machine squat",
    target_reps: 10,
    body_part: "legs",
    equipment: "smith",
  },
  {
    id: "ex-cable-row",
    name: "Seated cable row",
    target_reps: 10,
    body_part: "back",
    equipment: "cable",
  },
  {
    id: "ex-db-curl",
    name: "Dumbbell curl",
    target_reps: 10,
    body_part: "arms",
    equipment: "dumbbell",
  },
];

const allowedIds = new Set(catalog.map((exercise) => exercise.id));

describe("assemble-workout", () => {
  it("rejects prompts that are too short", () => {
    const result = validateAssemblyPrompt("ok");
    expect(result?.ok).toBe(false);
  });

  it("formats the exercise catalog for the model", () => {
    const formatted = formatExerciseCatalog(catalog);
    expect(formatted).toContain("ex-smith-squat|Smith machine squat|legs|smith");
  });

  it("accepts valid assembly JSON with known exercise ids", () => {
    const parsed = parseAssemblyJson(
      JSON.stringify({
        title: "Back and arms",
        note: "Cable and dumbbell focus.",
        exercise_ids: ["ex-cable-row", "ex-db-curl", "ex-unknown"],
      }),
    );
    const result = validateAssembly(parsed, allowedIds);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.workout.exercise_ids).toEqual([
        "ex-cable-row",
        "ex-db-curl",
      ]);
      expect(result.workout.title).toBe("Back and arms");
    }
  });

  it("rejects assembly JSON with no valid ids", () => {
    const result = validateAssembly(
      { title: "Empty", exercise_ids: ["ex-missing"] },
      allowedIds,
    );
    expect(result.ok).toBe(false);
  });

  it("rejects malformed assembly JSON", () => {
    expect(() => parseAssemblyJson("{bad")).toThrow();
    expect(validateAssembly(null, allowedIds).ok).toBe(false);
  });
});
