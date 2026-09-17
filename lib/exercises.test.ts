import { beforeEach, describe, expect, it } from "vitest";
import { addCustomExercise } from "./custom-exercises";
import { getMergedExercises } from "./exercises";

beforeEach(() => {
  window.localStorage.clear();
});

describe("getMergedExercises", () => {
  it("merges seed exercises with custom entries", () => {
    addCustomExercise({
      name: "Custom row",
      body_part: "back",
      equipment: "cable",
    });
    const merged = getMergedExercises([
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
