import { mergeExercises } from "./custom-exercises";
import { seedData } from "./seed-data";
import type { Exercise } from "./types";

export function getMergedExercises(
  seedExercises: Exercise[] = seedData.exercises,
): Exercise[] {
  return mergeExercises(seedExercises);
}
