import OpenAI from "openai";
import {
  buildAssemblyMessages,
  formatExerciseCatalog,
  parseAssemblyJson,
  validateAssembly,
  validateAssemblyPrompt,
} from "./assemble-workout";
import type { AssembleWorkoutResult, Exercise } from "./types";

export const OPENAI_MODEL = "gpt-4o-mini";

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const baseURL = process.env.OPENAI_BASE_URL?.trim();
  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  });
}

export async function requestWorkoutAssembly(
  prompt: string,
  exercises: Exercise[],
): Promise<AssembleWorkoutResult> {
  const promptError = validateAssemblyPrompt(prompt);
  if (promptError) return promptError;

  const client = getOpenAIClient();
  if (!client) {
    return {
      ok: false,
      message: "Add OPENAI_API_KEY to .env to use workout assembly.",
    };
  }

  if (exercises.length === 0) {
    return { ok: false, message: "Exercise library is empty." };
  }

  try {
    const catalog = formatExerciseCatalog(exercises);
    const { system, user } = buildAssemblyMessages(prompt, catalog);
    const response = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = response.choices[0]?.message?.content ?? "";
    const parsed = parseAssemblyJson(content);
    return validateAssembly(
      parsed,
      new Set(exercises.map((exercise) => exercise.id)),
    );
  } catch {
    return {
      ok: false,
      message: "Could not assemble a workout right now. Try again.",
    };
  }
}
