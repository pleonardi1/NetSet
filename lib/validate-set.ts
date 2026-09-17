import type { SetInput, ValidationResult } from "./types";

export function validateSetInput(input: SetInput): ValidationResult {
  const weightRaw =
    typeof input.weight_lb === "string"
      ? input.weight_lb.trim()
      : String(input.weight_lb);
  const repsRaw =
    typeof input.reps === "string" ? input.reps.trim() : String(input.reps);

  if (weightRaw === "" || repsRaw === "") {
    return { ok: false, message: "Enter weight and reps greater than zero." };
  }

  const weight_lb = Number(weightRaw);
  const reps = Number(repsRaw);

  if (!Number.isFinite(weight_lb) || !Number.isFinite(reps)) {
    return { ok: false, message: "Enter weight and reps greater than zero." };
  }

  if (weight_lb <= 0 || reps <= 0) {
    return { ok: false, message: "Enter weight and reps greater than zero." };
  }

  return { ok: true, weight_lb, reps };
}
