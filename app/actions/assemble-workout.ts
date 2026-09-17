"use server";

import { requestWorkoutAssembly } from "@/lib/openai";
import { seedData } from "@/lib/seed-data";
import type { AssembleWorkoutResult, Exercise } from "@/lib/types";

export async function assembleWorkoutAction(
  prompt: string,
  customExercises: Exercise[] = [],
): Promise<AssembleWorkoutResult> {
  const exercises = [...seedData.exercises, ...customExercises];
  return requestWorkoutAssembly(prompt, exercises);
}
