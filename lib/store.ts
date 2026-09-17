import { mergeSessions } from "./history";
import type { Exercise, Session, SessionType, WorkoutSet } from "./types";

export const STORAGE_KEY = "nextset:sessions";
export const SESSION_TYPES_KEY = "nextset:session-types";
export const DELETED_SESSION_TYPES_KEY = "nextset:deleted-session-types";
export const QUICK_START_TYPE_ID = "type-quick-start";
export const AI_ASSEMBLED_TYPE_ID = "type-ai-assembled";

export function loadStoredSessionTypes(): SessionType[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SESSION_TYPES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SessionType[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredSessionTypes(sessionTypes: SessionType[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_TYPES_KEY, JSON.stringify(sessionTypes));
}

export function loadDeletedSessionTypeIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DELETED_SESSION_TYPES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDeletedSessionTypeIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DELETED_SESSION_TYPES_KEY, JSON.stringify(ids));
}

export function mergeSessionTypes(
  seedTypes: SessionType[],
  storedTypes: SessionType[],
): SessionType[] {
  const byId = new Map<string, SessionType>();
  for (const type of seedTypes) {
    byId.set(type.id, type);
  }
  for (const type of storedTypes) {
    byId.set(type.id, type);
  }
  return [...byId.values()];
}

export function getMergedSessionTypes(
  seedTypes: SessionType[],
  storedTypes: SessionType[] = loadStoredSessionTypes(),
  deletedIds: string[] = loadDeletedSessionTypeIds(),
): SessionType[] {
  const deleted = new Set(deletedIds);
  return mergeSessionTypes(seedTypes, storedTypes).filter(
    (type) => !deleted.has(type.id),
  );
}

export function saveWorkoutTemplate(
  name: string,
  exerciseIds: string[],
): SessionType | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const sessionType: SessionType = {
    id: `type-${crypto.randomUUID()}`,
    name: trimmed,
    exercise_ids: [...exerciseIds],
  };
  const stored = loadStoredSessionTypes();
  saveStoredSessionTypes([...stored, sessionType]);
  return sessionType;
}

export function updateWorkoutTemplate(
  id: string,
  updates: Partial<Pick<SessionType, "name" | "exercise_ids">>,
  seedTypes: SessionType[],
): SessionType | null {
  const merged = getMergedSessionTypes(seedTypes);
  const existing = merged.find((type) => type.id === id);
  if (!existing) return null;

  const next: SessionType = {
    ...existing,
    ...updates,
    name: updates.name?.trim() || existing.name,
    exercise_ids: updates.exercise_ids
      ? [...updates.exercise_ids]
      : existing.exercise_ids,
  };

  const stored = loadStoredSessionTypes().filter((type) => type.id !== id);
  saveStoredSessionTypes([...stored, next]);
  return next;
}

export function deleteWorkoutTemplate(id: string): void {
  const stored = loadStoredSessionTypes();
  const filtered = stored.filter((type) => type.id !== id);
  if (filtered.length !== stored.length) {
    saveStoredSessionTypes(filtered);
    return;
  }
  const deleted = loadDeletedSessionTypeIds();
  if (!deleted.includes(id)) {
    saveDeletedSessionTypeIds([...deleted, id]);
  }
}

export function sessionExerciseListChanged(session: Session): boolean {
  if (session.started_exercise_ids.length !== session.exercise_ids.length) {
    return true;
  }
  return session.started_exercise_ids.some(
    (id, index) => id !== session.exercise_ids[index],
  );
}

export function canUpdateStartedTemplate(session: Session): boolean {
  return (
    session.session_type_id !== QUICK_START_TYPE_ID &&
    sessionExerciseListChanged(session)
  );
}

export function loadStoredSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Session[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredSessions(sessions: Session[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getMergedSessions(
  seedSessions: Session[],
  storedSessions: Session[] = loadStoredSessions(),
): Session[] {
  return mergeSessions(seedSessions, storedSessions);
}

export function createSession(
  sessionType: SessionType,
  startedAt = new Date().toISOString(),
): Session {
  const exercise_ids = [...sessionType.exercise_ids];
  return {
    id: `session-${crypto.randomUUID()}`,
    session_type_id: sessionType.id,
    started_at: startedAt,
    exercise_ids,
    started_exercise_ids: [...exercise_ids],
    sets: [],
  };
}

export function createQuickStartSession(exerciseId: string): Session {
  return createSession({
    id: QUICK_START_TYPE_ID,
    name: "Quick workout",
    exercise_ids: [exerciseId],
  });
}

export function createAssembledSession(
  label: string,
  exerciseIds: string[],
): Session {
  return {
    ...createSession({
      id: AI_ASSEMBLED_TYPE_ID,
      name: label,
      exercise_ids: exerciseIds,
    }),
    label,
  };
}

export function getSessionDisplayName(
  session: Session,
  sessionTypes: SessionType[],
): string {
  if (session.label?.trim()) return session.label.trim();
  return getSessionTypeName(sessionTypes, session.session_type_id);
}

export function addSetToSession(
  session: Session,
  set: Omit<WorkoutSet, "id" | "logged_at"> & { id?: string; logged_at?: string },
): Session {
  const newSet: WorkoutSet = {
    id: set.id ?? `set-${crypto.randomUUID()}`,
    exercise_id: set.exercise_id,
    weight_lb: set.weight_lb,
    reps: set.reps,
    logged_at: set.logged_at ?? new Date().toISOString(),
  };
  return { ...session, sets: [...session.sets, newSet] };
}

export function swapExerciseInSession(
  session: Session,
  index: number,
  newExerciseId: string,
): Session {
  const exercise_ids = [...session.exercise_ids];
  exercise_ids[index] = newExerciseId;
  return { ...session, exercise_ids };
}

export function addExerciseToSession(
  session: Session,
  exerciseId: string,
): Session {
  return {
    ...session,
    exercise_ids: [...session.exercise_ids, exerciseId],
  };
}

export function removeExerciseFromSession(
  session: Session,
  index: number,
): Session {
  if (index < 0 || index >= session.exercise_ids.length) return session;
  const exercise_ids = session.exercise_ids.filter((_, i) => i !== index);
  return { ...session, exercise_ids };
}

export function moveExerciseInSession(
  session: Session,
  fromIndex: number,
  toIndex: number,
): Session {
  if (
    fromIndex < 0 ||
    fromIndex >= session.exercise_ids.length ||
    toIndex < 0 ||
    toIndex >= session.exercise_ids.length ||
    fromIndex === toIndex
  ) {
    return session;
  }
  const exercise_ids = [...session.exercise_ids];
  const [moved] = exercise_ids.splice(fromIndex, 1);
  exercise_ids.splice(toIndex, 0, moved);
  return { ...session, exercise_ids };
}

export function completeSession(session: Session): Session {
  return { ...session, completed_at: new Date().toISOString() };
}

export function upsertStoredSession(session: Session): Session[] {
  const stored = loadStoredSessions();
  const index = stored.findIndex((item) => item.id === session.id);
  const next =
    index === -1
      ? [...stored, session]
      : stored.map((item, i) => (i === index ? session : item));
  saveStoredSessions(next);
  return next;
}

export function getSessionTypeName(
  sessionTypes: SessionType[],
  sessionTypeId: string,
): string {
  return sessionTypes.find((type) => type.id === sessionTypeId)?.name ?? "Workout";
}

export function getExerciseMap(exercises: Exercise[]): Map<string, Exercise> {
  return new Map(exercises.map((exercise) => [exercise.id, exercise]));
}

export function getLastSessionLabel(
  sessions: Session[],
  sessionTypeId: string,
): string | null {
  const matches = sessions
    .filter((session) => session.session_type_id === sessionTypeId)
    .sort(
      (a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
    );
  const last = matches[0];
  if (!last) return null;
  return new Date(last.started_at).toLocaleDateString(undefined, {
    weekday: "short",
  });
}
