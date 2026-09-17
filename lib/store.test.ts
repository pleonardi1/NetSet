import { beforeEach, describe, expect, it } from "vitest";
import {
  addSetToSession,
  addExerciseToSession,
  canUpdateStartedTemplate,
  completeSession,
  createAssembledSession,
  createQuickStartSession,
  createSession,
  getSessionDisplayName,
  deleteWorkoutTemplate,
  moveExerciseInSession,
  removeExerciseFromSession,
  getExerciseMap,
  getLastSessionLabel,
  getMergedSessionTypes,
  getMergedSessions,
  getSessionTypeName,
  loadDeletedSessionTypeIds,
  loadStoredSessions,
  loadStoredSessionTypes,
  saveStoredSessions,
  saveWorkoutTemplate,
  sessionExerciseListChanged,
  swapExerciseInSession,
  updateWorkoutTemplate,
  upsertStoredSession,
} from "./store";
import type { SessionType } from "./types";

const pushType: SessionType = {
  id: "type-push",
  name: "Push",
  exercise_ids: ["ex-bench", "ex-ohp"],
};

const sampleExercise = {
  id: "ex-bench",
  name: "Bench",
  target_reps: 10,
  body_part: "chest" as const,
  equipment: "barbell" as const,
};

beforeEach(() => {
  window.localStorage.clear();
});

describe("store", () => {
  it("creates a session from a session type", () => {
    const session = createSession(pushType);
    expect(session.exercise_ids).toEqual(pushType.exercise_ids);
    expect(session.started_exercise_ids).toEqual(pushType.exercise_ids);
    expect(session.sets).toEqual([]);
  });

  it("persists new sessions in localStorage", () => {
    const session = createSession(pushType);
    saveStoredSessions([session]);
    expect(loadStoredSessions()).toHaveLength(1);
    expect(getMergedSessions([], loadStoredSessions())).toHaveLength(1);
  });

  it("adds a set and keeps prior sets after reload", () => {
    const session = createSession(pushType);
    const withSet = addSetToSession(session, {
      exercise_id: "ex-bench",
      weight_lb: 135,
      reps: 8,
    });
    saveStoredSessions([withSet]);
    const reloaded = getMergedSessions([], loadStoredSessions())[0];
    expect(reloaded.sets).toHaveLength(1);
    expect(reloaded.sets[0].weight_lb).toBe(135);
  });

  it("swaps an exercise for this session only", () => {
    const session = createSession(pushType);
    const swapped = swapExerciseInSession(session, 0, "ex-fly");
    expect(swapped.exercise_ids[0]).toBe("ex-fly");
    expect(pushType.exercise_ids[0]).toBe("ex-bench");
  });

  it("upserts an existing stored session", () => {
    const session = createSession(pushType);
    saveStoredSessions([session]);
    const updated = addSetToSession(session, {
      exercise_id: "ex-bench",
      weight_lb: 95,
      reps: 10,
    });
    upsertStoredSession(updated);
    expect(loadStoredSessions()[0].sets).toHaveLength(1);
  });

  it("handles invalid localStorage gracefully", () => {
    window.localStorage.setItem("nextset:sessions", "{bad");
    expect(loadStoredSessions()).toEqual([]);
  });

  it("completes a session and maps exercises", () => {
    const session = completeSession(createSession(pushType));
    expect(session.completed_at).toBeTruthy();
    const map = getExerciseMap([sampleExercise]);
    expect(map.get("ex-bench")?.name).toBe("Bench");
  });

  it("allows duplicate exercises in a session", () => {
    const session = createSession(pushType);
    const next = addExerciseToSession(session, "ex-fly");
    const duplicate = addExerciseToSession(next, "ex-fly");
    expect(duplicate.exercise_ids.filter((id) => id === "ex-fly")).toHaveLength(
      2,
    );
  });

  it("saves a custom workout template", () => {
    const saved = saveWorkoutTemplate("Upper mix", ["ex-bench", "ex-fly"]);
    expect(saved?.name).toBe("Upper mix");
    expect(getMergedSessionTypes([pushType])).toContainEqual(saved);
    expect(loadStoredSessionTypes()).toHaveLength(1);
  });

  it("rejects blank workout names", () => {
    expect(saveWorkoutTemplate("  ", ["ex-bench"])).toBeNull();
  });

  it("updates and deletes workout templates", () => {
    saveWorkoutTemplate("Leg day", ["ex-squat"]);
    const custom = loadStoredSessionTypes()[0];
    const updated = updateWorkoutTemplate(
      custom.id,
      { name: "Heavy legs", exercise_ids: ["ex-squat", "ex-rdl"] },
      [pushType],
    );
    expect(updated?.name).toBe("Heavy legs");
    deleteWorkoutTemplate(custom.id);
    expect(getMergedSessionTypes([pushType])).toHaveLength(1);
  });

  it("marks seeded templates deleted without removing custom ones", () => {
    deleteWorkoutTemplate("type-push");
    expect(getMergedSessionTypes([pushType])).toHaveLength(0);
    expect(loadDeletedSessionTypeIds()).toContain("type-push");
  });

  it("detects when a session exercise list changed", () => {
    const session = addExerciseToSession(createSession(pushType), "ex-fly");
    expect(sessionExerciseListChanged(session)).toBe(true);
    expect(canUpdateStartedTemplate(session)).toBe(true);
    expect(sessionExerciseListChanged(createSession(pushType))).toBe(false);
  });

  it("does not offer template update for quick-start sessions", () => {
    const session = addExerciseToSession(
      createQuickStartSession("ex-bench"),
      "ex-fly",
    );
    expect(canUpdateStartedTemplate(session)).toBe(false);
  });

  it("reorders and removes exercises from a session", () => {
    const session = createSession(pushType);
    const moved = moveExerciseInSession(session, 1, 0);
    expect(moved.exercise_ids[0]).toBe("ex-ohp");
    expect(moveExerciseInSession(session, 0, 0)).toBe(session);
    const removed = removeExerciseFromSession(moved, 1);
    expect(removed.exercise_ids).toEqual(["ex-ohp"]);
    expect(removeExerciseFromSession(session, 99)).toBe(session);
  });

  it("returns null when updating a missing template", () => {
    expect(
      updateWorkoutTemplate("missing", { name: "Nope" }, [pushType]),
    ).toBeNull();
  });

  it("handles invalid stored session types", () => {
    window.localStorage.setItem("nextset:session-types", "{bad");
    expect(loadStoredSessionTypes()).toEqual([]);
    window.localStorage.setItem("nextset:deleted-session-types", "[]");
  });

  it("creates a quick-start session", () => {
    const session = createQuickStartSession("ex-smith-squat");
    expect(session.exercise_ids).toEqual(["ex-smith-squat"]);
  });

  it("creates an AI-assembled session with a display label", () => {
    const session = createAssembledSession("Cable back day", [
      "ex-cable-row",
      "ex-db-curl",
    ]);
    expect(session.label).toBe("Cable back day");
    expect(getSessionDisplayName(session, [])).toBe("Cable back day");
  });

  it("returns session type name and last session label", () => {
    const session = createSession(pushType);
    expect(getSessionTypeName([pushType], pushType.id)).toBe("Push");
    expect(getSessionTypeName([pushType], "missing")).toBe("Workout");
    expect(
      getLastSessionLabel(
        [{ ...session, started_exercise_ids: session.exercise_ids, started_at: "2026-09-15T12:00:00.000Z" }],
        pushType.id,
      ),
    ).toBeTruthy();
    expect(getLastSessionLabel([], pushType.id)).toBeNull();
  });
});
