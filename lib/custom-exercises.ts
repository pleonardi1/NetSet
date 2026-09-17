import type { BodyPart, Equipment, Exercise } from "./types";

export const CUSTOM_EXERCISES_KEY = "nextset:custom-exercises";

export type CustomExerciseInput = {
  name: string;
  body_part: BodyPart;
  equipment: Equipment;
  target_reps?: number;
};

export type CustomExerciseResult =
  | { ok: true; exercise: Exercise }
  | { ok: false; message: string };

export function validateCustomExerciseInput(
  input: CustomExerciseInput,
): CustomExerciseResult {
  const name = input.name.trim();
  if (!name) {
    return { ok: false, message: "Exercise name is required." };
  }
  return {
    ok: true,
    exercise: {
      id: `ex-custom-${crypto.randomUUID()}`,
      name,
      target_reps: input.target_reps ?? 10,
      body_part: input.body_part,
      equipment: input.equipment,
    },
  };
}

export function loadCustomExercises(): Exercise[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_EXERCISES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Exercise[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomExercises(exercises: Exercise[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(exercises));
}

export function addCustomExercise(input: CustomExerciseInput): CustomExerciseResult {
  const result = validateCustomExerciseInput(input);
  if (!result.ok) return result;
  const stored = loadCustomExercises();
  saveCustomExercises([...stored, result.exercise]);
  return result;
}

export function mergeExercises(
  seedExercises: Exercise[],
  customExercises: Exercise[] = loadCustomExercises(),
): Exercise[] {
  return [...seedExercises, ...customExercises];
}
