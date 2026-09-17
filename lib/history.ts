import type { Session, WorkoutSet } from "./types";

export function normalizeSession(session: Session): Session {
  return {
    ...session,
    started_exercise_ids:
      session.started_exercise_ids ?? [...session.exercise_ids],
  };
}

export function mergeSessions(
  seedSessions: Session[],
  storedSessions: Session[],
): Session[] {
  const byId = new Map<string, Session>();
  for (const session of seedSessions) {
    byId.set(session.id, normalizeSession(session));
  }
  for (const session of storedSessions) {
    byId.set(session.id, normalizeSession(session));
  }
  return [...byId.values()].sort(
    (a, b) =>
      new Date(a.started_at).getTime() - new Date(b.started_at).getTime(),
  );
}

export function getSetsForExercise(
  sessions: Session[],
  exerciseId: string,
  excludeSessionId?: string,
): WorkoutSet[] {
  const sets: WorkoutSet[] = [];
  for (const session of sessions) {
    if (session.id === excludeSessionId) continue;
    for (const set of session.sets) {
      if (set.exercise_id === exerciseId) {
        sets.push(set);
      }
    }
  }
  return sets.sort(
    (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime(),
  );
}

export function exerciseHasHistory(
  sessions: Session[],
  exerciseId: string,
  excludeSessionId?: string,
): boolean {
  return getSetsForExercise(sessions, exerciseId, excludeSessionId).length > 0;
}

export function getLastSessionSets(
  sessions: Session[],
  exerciseId: string,
  excludeSessionId?: string,
): WorkoutSet[] {
  const prior = sessions
    .filter((session) => session.id !== excludeSessionId)
    .filter((session) =>
      session.sets.some((set) => set.exercise_id === exerciseId),
    )
    .sort(
      (a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
    );

  const lastSession = prior[0];
  if (!lastSession) return [];

  return lastSession.sets
    .filter((set) => set.exercise_id === exerciseId)
    .sort(
      (a, b) =>
        new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime(),
    );
}

export function formatLastSessionSummary(sets: WorkoutSet[]): string {
  if (sets.length === 0) return "No previous session yet";
  return sets.map((set) => `${set.weight_lb}×${set.reps}`).join(" · ");
}
