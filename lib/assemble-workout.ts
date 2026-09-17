import type { AssembleWorkoutResult, AssembledWorkout, Exercise } from "./types";

export const MIN_ASSEMBLY_PROMPT_LENGTH = 3;
export const MAX_ASSEMBLY_EXERCISES = 10;

export function validateAssemblyPrompt(prompt: string): AssembleWorkoutResult | null {
  const trimmed = prompt.trim();
  if (trimmed.length < MIN_ASSEMBLY_PROMPT_LENGTH) {
    return {
      ok: false,
      message: "Describe your workout in a few words.",
    };
  }
  return null;
}

export function formatExerciseCatalog(exercises: Exercise[]): string {
  return exercises
    .map(
      (exercise) =>
        `${exercise.id}|${exercise.name}|${exercise.body_part}|${exercise.equipment}`,
    )
    .join("\n");
}

export function buildAssemblyMessages(prompt: string, catalog: string) {
  const system = [
    "You assemble gym workouts from a fixed exercise catalog.",
    "Return JSON only with keys: title (short string), exercise_ids (array of catalog ids in workout order), note (one sentence explaining the pick).",
    "Use ONLY exercise ids from the catalog. Do not invent exercises.",
    `Pick between 1 and ${MAX_ASSEMBLY_EXERCISES} exercises unless the user asks for fewer.`,
    "Prefer equipment and body parts the user mentions.",
  ].join(" ");

  const user = [
    `User request: ${prompt.trim()}`,
    "",
    "Catalog (id|name|body_part|equipment):",
    catalog,
  ].join("\n");

  return { system, user };
}

export function parseAssemblyJson(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return JSON.parse(trimmed) as unknown;
}

export function validateAssembly(
  data: unknown,
  allowedIds: Set<string>,
): AssembleWorkoutResult {
  if (!data || typeof data !== "object") {
    return { ok: false, message: "Could not read the workout suggestion." };
  }

  const record = data as Record<string, unknown>;
  const title =
    typeof record.title === "string" && record.title.trim()
      ? record.title.trim()
      : "Today's workout";
  const note =
    typeof record.note === "string" ? record.note.trim() : "";
  const rawIds = record.exercise_ids;

  if (!Array.isArray(rawIds)) {
    return { ok: false, message: "The suggestion did not include exercises." };
  }

  const exercise_ids: string[] = [];
  for (const value of rawIds) {
    if (typeof value !== "string") continue;
    if (!allowedIds.has(value)) continue;
    if (!exercise_ids.includes(value)) {
      exercise_ids.push(value);
    }
    if (exercise_ids.length >= MAX_ASSEMBLY_EXERCISES) break;
  }

  if (exercise_ids.length === 0) {
    return {
      ok: false,
      message: "No matching exercises from your library fit that request.",
    };
  }

  const workout: AssembledWorkout = { title, exercise_ids, note };
  return { ok: true, workout };
}
