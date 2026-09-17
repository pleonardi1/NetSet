import type { BodyPart, Equipment, Exercise } from "./types";

export type ExerciseFilters = {
  body_part?: BodyPart | "all";
  equipment?: Equipment | "all";
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function searchExercises(
  exercises: Exercise[],
  query: string,
  filters: ExerciseFilters = {},
): Exercise[] {
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery ? normalizedQuery.split(/\s+/).filter(Boolean) : [];

  return exercises.filter((exercise) => {
    if (filters.body_part && filters.body_part !== "all") {
      if (exercise.body_part !== filters.body_part) return false;
    }
    if (filters.equipment && filters.equipment !== "all") {
      if (exercise.equipment !== filters.equipment) return false;
    }

    if (tokens.length === 0) return true;

    const haystack = normalize(
      `${exercise.name} ${exercise.body_part} ${exercise.equipment}`,
    );

    return tokens.every((token) => haystack.includes(token));
  });
}

export function formatBodyPart(bodyPart: BodyPart): string {
  return bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1);
}

export function formatEquipment(equipment: Equipment): string {
  if (equipment === "bodyweight") return "Bodyweight";
  return equipment.charAt(0).toUpperCase() + equipment.slice(1);
}
