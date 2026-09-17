import type { WorkoutSet } from "./types";

export type PersonalRecord = {
  weight_lb: number;
  reps: number;
} | null;

export function getPersonalRecord(
  sets: WorkoutSet[],
  targetReps: number,
): PersonalRecord {
  const qualifying = sets.filter((set) => set.reps >= targetReps);
  if (qualifying.length === 0) return null;

  const best = qualifying.reduce((max, set) =>
    set.weight_lb > max.weight_lb ? set : max,
  );

  return { weight_lb: best.weight_lb, reps: best.reps };
}

export function formatPersonalRecord(
  pr: PersonalRecord,
  targetReps: number,
): string {
  if (!pr) return `No PR at this rep target yet`;
  return `${pr.weight_lb} lb`;
}

export function estimateE1rm(weight_lb: number, reps: number): number {
  return weight_lb * (1 + reps / 30);
}
