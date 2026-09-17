import { describe, expect, it } from "vitest";
import { formatAimLine, getNextAim } from "./next-aim";
import type { Exercise, Session } from "./types";

const bench: Exercise = {
  id: "ex-bench",
  name: "Bench press",
  target_reps: 10,
  body_part: "chest",
  equipment: "barbell",
};

const priorSession: Session = {
  id: "prior",
  session_type_id: "type-push",
  started_at: "2026-09-10T18:00:00.000Z",
  exercise_ids: ["ex-bench"],
  started_exercise_ids: ["ex-bench"],
  sets: [
    {
      id: "s1",
      exercise_id: "ex-bench",
      weight_lb: 150,
      reps: 10,
      logged_at: "2026-09-10T18:04:00.000Z",
    },
    {
      id: "s2",
      exercise_id: "ex-bench",
      weight_lb: 170,
      reps: 6,
      logged_at: "2026-09-10T18:08:00.000Z",
    },
  ],
};

const currentSession: Session = {
  id: "live",
  session_type_id: "type-legs",
  started_at: "2026-09-17T18:00:00.000Z",
  exercise_ids: ["ex-bench"],
  started_exercise_ids: ["ex-bench"],
  sets: [],
};

describe("getNextAim", () => {
  it("returns null when exercise has no history", () => {
    expect(getNextAim(bench, [], currentSession, [])).toBeNull();
  });

  it("suggests smaller step after failed jump in last session", () => {
    const aim = getNextAim(bench, [priorSession], currentSession, []);
    expect(aim).not.toBeNull();
    expect(aim?.weight_lb).toBe(155);
    expect(aim?.reps).toBe(10);
  });

  it("holds weight when last set today misses target", () => {
    const session = {
      ...currentSession,
      sets: [
        {
          id: "today-1",
          exercise_id: "ex-bench",
          weight_lb: 120,
          reps: 8,
          logged_at: "2026-09-17T18:05:00.000Z",
        },
      ],
    };
    const aim = getNextAim(bench, [priorSession], session, session.sets);
    expect(aim).toEqual({
      reps: 10,
      weight_lb: 120,
      reason: expect.stringContaining("Hold weight"),
    });
  });

  it("holds weight when last session ended below target", () => {
    const missPrior: Session = {
      ...priorSession,
      sets: [
        {
          id: "s1",
          exercise_id: "ex-bench",
          weight_lb: 120,
          reps: 8,
          logged_at: "2026-09-10T18:04:00.000Z",
        },
      ],
    };
    const aim = getNextAim(bench, [missPrior], currentSession, []);
    expect(aim?.weight_lb).toBe(120);
    expect(aim?.reps).toBe(10);
  });

  it("steps up when last session ended on target", () => {
    const cleanPrior: Session = {
      ...priorSession,
      sets: [
        {
          id: "s1",
          exercise_id: "ex-bench",
          weight_lb: 140,
          reps: 10,
          logged_at: "2026-09-10T18:04:00.000Z",
        },
      ],
    };
    const aim = getNextAim(bench, [cleanPrior], currentSession, []);
    expect(aim?.weight_lb).toBe(145);
  });

  it("bumps weight when last set today hits target", () => {
    const session = {
      ...currentSession,
      sets: [
        {
          id: "today-1",
          exercise_id: "ex-bench",
          weight_lb: 120,
          reps: 10,
          logged_at: "2026-09-17T18:05:00.000Z",
        },
      ],
    };
    const aim = getNextAim(bench, [priorSession], session, session.sets);
    expect(aim?.weight_lb).toBe(125);
  });

  it("uses a smaller step when a large jump would overshoot PR", () => {
    const session = {
      ...currentSession,
      sets: [
        {
          id: "today-1",
          exercise_id: "ex-bench",
          weight_lb: 151,
          reps: 10,
          logged_at: "2026-09-17T18:05:00.000Z",
        },
      ],
    };
    const aim = getNextAim(bench, [priorSession], session, session.sets);
    expect(aim?.weight_lb).toBe(153.5);
  });

  it("formats aim line for display", () => {
    expect(formatAimLine({ reps: 10, weight_lb: 90, reason: "test" })).toBe(
      "10 reps at 90 lb",
    );
  });
});
