import { getLastSessionSets, getSetsForExercise } from "./history";
import { getPersonalRecord } from "./pr";
import type { Exercise, NextAim, Session, WorkoutSet } from "./types";

const LOAD_STEP = 5;
const SMALL_STEP = 2.5;

export function getNextAim(
  exercise: Exercise,
  sessions: Session[],
  currentSession: Session,
  todaySets: WorkoutSet[],
): NextAim | null {
  const hasHistory = getSetsForExercise(
    sessions,
    exercise.id,
    currentSession.id,
  ).some(() => true);

  if (!hasHistory) return null;

  const targetReps = exercise.target_reps;
  const allHistorySets = getSetsForExercise(sessions, exercise.id);
  const pr = getPersonalRecord(allHistorySets, targetReps);

  if (todaySets.length === 0) {
    return aimFromLastSession(exercise, sessions, currentSession.id, pr);
  }

  const lastToday = todaySets[todaySets.length - 1];
  return aimFromTodaySet(lastToday, targetReps, pr);
}

function aimFromTodaySet(
  lastSet: WorkoutSet,
  targetReps: number,
  pr: ReturnType<typeof getPersonalRecord>,
): NextAim {
  if (lastSet.reps >= targetReps) {
    const nextWeight = bumpWeight(lastSet.weight_lb, pr?.weight_lb ?? null);
    return {
      reps: targetReps,
      weight_lb: nextWeight,
      reason: `You hit ${lastSet.reps} at ${lastSet.weight_lb}. Nudging load up.`,
    };
  }

  return {
    reps: targetReps,
    weight_lb: lastSet.weight_lb,
    reason: `You hit ${lastSet.reps} when target was ${targetReps}. Hold weight and chase ${targetReps}.`,
  };
}

function aimFromLastSession(
  exercise: Exercise,
  sessions: Session[],
  excludeSessionId: string,
  pr: ReturnType<typeof getPersonalRecord>,
): NextAim {
  const lastSets = getLastSessionSets(sessions, exercise.id, excludeSessionId);
  const targetReps = exercise.target_reps;

  if (lastSets.length === 0) {
    return {
      reps: targetReps,
      weight_lb: LOAD_STEP,
      reason: "Starting from your last logged session.",
    };
  }

  const bestQualifying = lastSets
    .filter((set) => set.reps >= targetReps)
    .reduce<WorkoutSet | null>(
      (best, set) =>
        !best || set.weight_lb > best.weight_lb ? set : best,
      null,
    );

  const lastSet = lastSets[lastSets.length - 1];
  const failedJump = findFailedJump(lastSets, targetReps, bestQualifying);

  if (failedJump && bestQualifying) {
    const nextWeight = bumpWeight(bestQualifying.weight_lb, pr?.weight_lb ?? null);
    return {
      reps: targetReps,
      weight_lb: nextWeight,
      reason: `Last time ${failedJump.weight_lb} only yielded ${failedJump.reps}. Building from ${bestQualifying.weight_lb}×${bestQualifying.reps}.`,
    };
  }

  if (lastSet.reps < targetReps) {
    return {
      reps: targetReps,
      weight_lb: lastSet.weight_lb,
      reason: `Last session ended at ${lastSet.weight_lb}×${lastSet.reps}. Chase ${targetReps} first.`,
    };
  }

  const nextWeight = bumpWeight(lastSet.weight_lb, pr?.weight_lb ?? null);
  return {
    reps: targetReps,
    weight_lb: nextWeight,
    reason: `Last session you hit ${lastSet.weight_lb}×${lastSet.reps}. Stepping up.`,
  };
}

function findFailedJump(
  sets: WorkoutSet[],
  targetReps: number,
  bestQualifying: WorkoutSet | null,
): WorkoutSet | null {
  if (!bestQualifying) return null;

  const failures = sets.filter(
    (set) =>
      set.weight_lb > bestQualifying.weight_lb + LOAD_STEP &&
      set.reps < targetReps,
  );

  return failures.length > 0 ? failures[failures.length - 1] : null;
}

function bumpWeight(current: number, prWeight: number | null): number {
  const stepped = current + LOAD_STEP;
  if (prWeight !== null && stepped > prWeight + LOAD_STEP) {
    return current + SMALL_STEP;
  }
  return stepped;
}

export function formatAimLine(aim: NextAim): string {
  return `${aim.reps} reps at ${aim.weight_lb} lb`;
}
