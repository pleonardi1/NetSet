import { beforeEach, describe, expect, it } from "vitest";
import {
  addCustomExercise,
  loadCustomExercises,
  mergeExercises,
  validateCustomExerciseInput,
} from "./custom-exercises";

beforeEach(() => {
  window.localStorage.clear();
});

describe("custom-exercises", () => {
  it("rejects blank names", () => {
    const result = validateCustomExerciseInput({
      name: "   ",
      body_part: "chest",
      equipment: "barbell",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/required/i);
    }
  });

  it("persists a custom exercise", () => {
    const result = addCustomExercise({
      name: "Landmine rotation",
      body_part: "core",
      equipment: "barbell",
    });
    expect(result.ok).toBe(true);
    expect(loadCustomExercises()).toHaveLength(1);
    expect(loadCustomExercises()[0].name).toBe("Landmine rotation");
  });

  it("handles invalid custom exercise storage", () => {
    window.localStorage.setItem("nextset:custom-exercises", "{bad");
    expect(loadCustomExercises()).toEqual([]);
  });

  it("merges seed and custom exercises", () => {
    addCustomExercise({
      name: "Custom move",
      body_part: "back",
      equipment: "cable",
    });
    const merged = mergeExercises([
      {
        id: "ex-bench",
        name: "Bench",
        target_reps: 10,
        body_part: "chest",
        equipment: "barbell",
      },
    ]);
    expect(merged).toHaveLength(2);
  });
});
