import { describe, expect, it } from "vitest";
import { validateSetInput } from "./validate-set";

describe("validateSetInput", () => {
  it("accepts valid weight and reps", () => {
    expect(validateSetInput({ weight_lb: "120", reps: "10" })).toEqual({
      ok: true,
      weight_lb: 120,
      reps: 10,
    });
  });

  it("rejects blank weight", () => {
    expect(validateSetInput({ weight_lb: "", reps: "10" })).toEqual({
      ok: false,
      message: "Enter weight and reps greater than zero.",
    });
  });

  it("rejects non-numeric input", () => {
    expect(validateSetInput({ weight_lb: "abc", reps: "10" }).ok).toBe(false);
  });

  it("rejects zero reps", () => {
    expect(validateSetInput({ weight_lb: "100", reps: "0" })).toEqual({
      ok: false,
      message: "Enter weight and reps greater than zero.",
    });
  });
});
