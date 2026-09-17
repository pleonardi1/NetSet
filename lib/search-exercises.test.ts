import { describe, expect, it } from "vitest";
import {
  formatBodyPart,
  formatEquipment,
  searchExercises,
} from "./search-exercises";
import type { Exercise } from "./types";

const sample: Exercise[] = [
  {
    id: "ex-smith-squat",
    name: "Smith machine squat",
    target_reps: 10,
    body_part: "legs",
    equipment: "smith",
    illustration: "squat",
  },
  {
    id: "ex-bench",
    name: "Barbell bench press",
    target_reps: 10,
    body_part: "chest",
    equipment: "barbell",
    illustration: "bench",
  },
];

describe("searchExercises", () => {
  it("finds exercises by multi-word query", () => {
    const results = searchExercises(sample, "smith machine squat");
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("ex-smith-squat");
  });

  it("filters by body part and equipment", () => {
    const results = searchExercises(sample, "", {
      body_part: "chest",
      equipment: "barbell",
    });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("ex-bench");
  });

  it("formats labels for display", () => {
    expect(formatBodyPart("chest")).toBe("Chest");
    expect(formatEquipment("bodyweight")).toBe("Bodyweight");
    expect(formatEquipment("smith")).toBe("Smith");
  });
});
