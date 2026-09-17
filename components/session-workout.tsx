"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  exerciseHasHistory,
  formatLastSessionSummary,
  getLastSessionSets,
  getSetsForExercise,
} from "@/lib/history";
import { formatAimLine, getNextAim } from "@/lib/next-aim";
import { formatPersonalRecord, getPersonalRecord } from "@/lib/pr";
import { getMergedExercises } from "@/lib/exercises";
import { seedData } from "@/lib/seed-data";
import { ExerciseLibrary } from "@/components/exercise-library";
import {
  addExerciseToSession,
  addSetToSession,
  canUpdateStartedTemplate,
  completeSession,
  getExerciseMap,
  getMergedSessionTypes,
  getMergedSessions,
  getSessionDisplayName,
  getSessionTypeName,
  saveWorkoutTemplate,
  swapExerciseInSession,
  updateWorkoutTemplate,
  upsertStoredSession,
} from "@/lib/store";
import { validateSetInput } from "@/lib/validate-set";
import type { Exercise, Session } from "@/lib/types";

type SessionWorkoutProps = {
  sessionId: string;
};

export function SessionWorkout({ sessionId }: SessionWorkoutProps) {
  const searchParams = useSearchParams();
  const exercises = useMemo(() => getMergedExercises(seedData.exercises), []);
  const exerciseMap = useMemo(() => getExerciseMap(exercises), [exercises]);

  const [session, setSession] = useState<Session | null>(() => {
    const merged = getMergedSessions(seedData.sessions);
    return merged.find((item) => item.id === sessionId) ?? null;
  });
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [libraryMode, setLibraryMode] = useState<"swap" | "add" | null>(null);
  const [done, setDone] = useState(false);

  const sessionTypes = useMemo(
    () => getMergedSessionTypes(seedData.sessionTypes),
    [done],
  );

  const mergedSessions = useMemo(
    () => getMergedSessions(seedData.sessions),
    [session?.sets.length, session?.exercise_ids.join(",")],
  );

  useEffect(() => {
    const indexParam = searchParams.get("exercise");
    if (indexParam) {
      const index = Number.parseInt(indexParam, 10);
      if (!Number.isNaN(index)) {
        setExerciseIndex(index);
      }
    }
  }, [searchParams]);

  const exerciseId = session?.exercise_ids[exerciseIndex];
  const exercise = exerciseId ? exerciseMap.get(exerciseId) : undefined;

  const todaySets = useMemo(
    () =>
      session && exerciseId
        ? session.sets.filter((set) => set.exercise_id === exerciseId)
        : [],
    [session, exerciseId],
  );

  const aim = useMemo(() => {
    if (!session || !exercise) return null;
    const hasHistory = exerciseHasHistory(
      mergedSessions,
      exercise.id,
      session.id,
    );
    if (!hasHistory) return null;
    return getNextAim(exercise, mergedSessions, session, todaySets);
  }, [session, exercise, mergedSessions, todaySets]);

  const lastSessionSets = useMemo(() => {
    if (!session || !exercise) return [];
    return getLastSessionSets(mergedSessions, exercise.id, session.id);
  }, [session, exercise, mergedSessions]);

  const pr = useMemo(() => {
    if (!exercise) return null;
    const allHistorySets = getSetsForExercise(mergedSessions, exercise.id);
    return getPersonalRecord(allHistorySets, exercise.target_reps);
  }, [exercise, mergedSessions]);

  const persist = useCallback((next: Session) => {
    setSession(next);
    upsertStoredSession(next);
  }, []);

  useEffect(() => {
    if (libraryMode) return;
    if (aim) {
      setWeight(String(aim.weight_lb));
      setReps(String(aim.reps));
    } else {
      setWeight("");
      setReps("");
    }
    setError(null);
    setShowWhy(false);
  }, [exerciseId, aim?.weight_lb, aim?.reps, libraryMode]);

  if (!session) {
    return (
      <div className="mx-auto max-w-[430px] px-4 py-12 text-center">
        <p className="text-muted-foreground">Session not found.</p>
        <Link
          href="/"
          className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Back home
        </Link>
      </div>
    );
  }

  if (done || session.completed_at) {
    return (
      <CompleteScreen
        session={session}
        exerciseMap={exerciseMap}
        sessionTypes={sessionTypes}
      />
    );
  }

  if (!exercise || !exerciseId) {
    return (
      <div className="mx-auto max-w-[430px] px-4 py-12 text-center">
        <p className="text-muted-foreground">Exercise not found.</p>
        <Link
          href="/"
          className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Back home
        </Link>
      </div>
    );
  }

  const activeSession = session;
  const sessionTypeName = getSessionDisplayName(session, sessionTypes);

  function handleLogSet() {
    const result = validateSetInput({ weight_lb: weight, reps });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    const next = addSetToSession(activeSession, {
      exercise_id: exercise!.id,
      weight_lb: result.weight_lb,
      reps: result.reps,
    });
    persist(next);
  }

  function handleLibrarySelect(newExerciseId: string) {
    if (libraryMode === "swap") {
      persist(
        swapExerciseInSession(activeSession, exerciseIndex, newExerciseId),
      );
      setLibraryMode(null);
      return;
    }

    if (libraryMode === "add") {
      if (activeSession.exercise_ids.includes(newExerciseId)) {
        const confirmed = window.confirm(
          "Already in this workout — add again?",
        );
        if (!confirmed) return;
      }
      const next = addExerciseToSession(activeSession, newExerciseId);
      persist(next);
      setExerciseIndex(next.exercise_ids.length - 1);
      setLibraryMode(null);
    }
  }

  function handleEnd() {
    persist(completeSession(activeSession));
    setDone(true);
  }

  const isLastExercise =
    exerciseIndex >= activeSession.exercise_ids.length - 1;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[430px] flex-col px-4 pb-8">
      <nav className="flex items-center justify-between py-3">
        <Link href="/" className="text-[17px] text-primary">
          ‹ {sessionTypeName}
        </Link>
        <button
          type="button"
          onClick={handleEnd}
          className="text-[17px] font-medium text-primary"
        >
          Finish workout
        </button>
      </nav>

      {libraryMode ? (
        <ExerciseLibrary
          exercises={exercises}
          title={libraryMode === "swap" ? "Replace exercise" : "Add exercise"}
          subtitle={
            libraryMode === "swap"
              ? `Today only · replacing ${exercise.name}`
              : "Pick from the library to add to this workout."
          }
          actionLabel={libraryMode === "swap" ? "Replace" : "Add"}
          onSelect={handleLibrarySelect}
          onCancel={() => setLibraryMode(null)}
        />
      ) : (
        <>
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[34px] font-bold leading-tight tracking-tight">
                {exercise.name}
              </h1>
              <p className="mt-1 text-[15px] text-muted-foreground">
                Set {todaySets.length + 1} · target {exercise.target_reps} reps
              </p>
            </div>
            <span className="rounded-full bg-card px-3 py-1.5 text-[13px] text-muted-foreground">
              {exerciseIndex + 1} of {session.exercise_ids.length}
            </span>
          </div>

          {aim ? (
            <div className="mb-5 rounded-xl bg-card px-5 py-7 text-center">
              <p className="text-[15px] text-muted-foreground">Next set</p>
              <p className="mt-2 text-[32px] font-bold leading-tight tracking-tight">
                {formatAimLine(aim)}
              </p>
              <button
                type="button"
                onClick={() => setShowWhy((value) => !value)}
                className="mt-3 text-[15px] text-primary"
              >
                Why?
              </button>
              {showWhy && (
                <p className="mt-3 text-left text-[15px] text-foreground">
                  {aim.reason}
                </p>
              )}
            </div>
          ) : (
            <div className="mb-5 rounded-xl bg-accent px-4 py-4 text-[15px] leading-relaxed text-foreground">
              First time on this exercise. NextSet is learning your numbers —
              you&apos;ll get a next-set aim next time.
            </div>
          )}

          <div className="mb-5 rounded-xl bg-card p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 text-[13px] text-muted-foreground">
                  Weight
                </Label>
                <Input
                  inputMode="decimal"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  className="h-auto rounded-[10px] border-0 bg-muted py-3.5 text-center text-[22px] font-semibold"
                />
              </div>
              <div>
                <Label className="mb-1.5 text-[13px] text-muted-foreground">
                  Reps
                </Label>
                <Input
                  inputMode="numeric"
                  value={reps}
                  onChange={(event) => setReps(event.target.value)}
                  className="h-auto rounded-[10px] border-0 bg-muted py-3.5 text-center text-[22px] font-semibold"
                />
              </div>
            </div>
            {error && (
              <p className="mt-3 rounded-[10px] bg-destructive/10 px-3 py-2 text-[15px] text-destructive">
                {error}
              </p>
            )}
            <Button
              className="mt-4 h-[50px] w-full rounded-xl text-[17px] font-semibold"
              onClick={handleLogSet}
            >
              Log set
            </Button>
          </div>

          {todaySets.length > 0 && (
            <section className="mb-5">
              <h2 className="mb-2 px-1 text-[13px] uppercase tracking-wide text-muted-foreground">
                Today
              </h2>
              <div className="overflow-hidden rounded-xl bg-card">
                {todaySets.map((set, index) => (
                  <div
                    key={set.id}
                    className={`px-4 py-3.5 text-[17px] text-chart-2 ${
                      index > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    ✓ {set.weight_lb} lb × {set.reps}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mb-6 flex flex-wrap gap-4 px-1 text-[15px] text-muted-foreground">
            <span>
              Last time{" "}
              <strong className="text-foreground">
                {formatLastSessionSummary(lastSessionSets)}
              </strong>
            </span>
            <span>
              PR{" "}
              <strong className="text-foreground">
                {formatPersonalRecord(pr, exercise.target_reps)}
              </strong>
            </span>
          </div>

          {isLastExercise && (
            <div className="mt-auto mb-3">
              <p className="mb-3 text-center text-[15px] text-muted-foreground">
                Done lifting? Save today&apos;s exercise list as a reusable
                workout — or skip and keep your set history.
              </p>
              <Button
                className="h-[50px] w-full rounded-xl text-[17px] font-semibold"
                onClick={handleEnd}
              >
                Finish workout
              </Button>
            </div>
          )}

          <div
            className={`grid grid-cols-4 gap-1 text-center ${isLastExercise ? "" : "mt-auto"}`}
          >
            <button
              type="button"
              disabled={exerciseIndex === 0}
              onClick={() => setExerciseIndex((value) => value - 1)}
              className="min-h-[44px] text-[15px] text-primary disabled:opacity-40"
            >
              ‹ Prev
            </button>
            <button
              type="button"
              onClick={() => setLibraryMode("add")}
              className="min-h-[44px] text-[15px] text-primary"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setLibraryMode("swap")}
              className="min-h-[44px] text-[15px] text-primary"
            >
              Swap
            </button>
            {isLastExercise ? (
              <button
                type="button"
                onClick={handleEnd}
                className="min-h-[44px] text-[15px] font-semibold text-primary"
              >
                Finish
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setExerciseIndex((value) => value + 1)}
                className="min-h-[44px] text-[15px] text-primary"
              >
                Next ›
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function CompleteScreen({
  session,
  exerciseMap,
  sessionTypes,
}: {
  session: Session;
  exerciseMap: Map<string, Exercise>;
  sessionTypes: ReturnType<typeof getMergedSessionTypes>;
}) {
  const [workoutName, setWorkoutName] = useState("");
  const [saved, setSaved] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const startedType = sessionTypes.find(
    (type) => type.id === session.session_type_id,
  );
  const showUpdate = canUpdateStartedTemplate(session) && startedType;

  const prSet = session.sets.reduce<(typeof session.sets)[0] | null>(
    (best, set) => {
      if (!best || set.weight_lb > best.weight_lb) return set;
      return best;
    },
    null,
  );
  const prExercise = prSet ? exerciseMap.get(prSet.exercise_id)?.name : null;

  function handleSaveWorkout() {
    const result = saveWorkoutTemplate(workoutName, session.exercise_ids);
    if (result) setSaved(true);
  }

  function handleUpdateTemplate() {
    if (!startedType) return;
    updateWorkoutTemplate(
      startedType.id,
      { exercise_ids: session.exercise_ids },
      seedData.sessionTypes,
    );
    setUpdated(true);
  }

  function handleSkip() {
    setSkipped(true);
  }

  const finished = saved || updated || skipped;

  return (
    <div className="mx-auto flex min-h-full max-w-[430px] flex-col px-4 py-12">
      <div className="text-center">
        <div className="mb-3 text-5xl text-primary">✓</div>
        <h1 className="text-[34px] font-bold tracking-tight">
          {getSessionDisplayName(session, sessionTypes)} complete
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {session.exercise_ids.length} exercises · {session.sets.length} sets
          logged
        </p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Your set records are saved either way.
        </p>
      </div>

      {prSet && prExercise && (
        <div className="mt-6 w-full overflow-hidden rounded-xl bg-card text-left">
          <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
            <span>Top set today</span>
            <span className="font-semibold text-chart-2">
              {prSet.weight_lb} lb × {prSet.reps}
            </span>
          </div>
          <div className="px-4 py-3.5 text-muted-foreground">{prExercise}</div>
        </div>
      )}

      {!finished && (
        <div className="mt-8 w-full rounded-xl bg-card p-4 text-left">
          <h2 className="text-[17px] font-semibold">Save this workout?</h2>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Save today&apos;s exercise list as a reusable workout, update the
            template you started from, or skip.
          </p>

          {showUpdate && (
            <Button
              className="mt-4 h-[50px] w-full rounded-xl text-[17px] font-semibold"
              onClick={handleUpdateTemplate}
            >
              Update {startedType?.name}
            </Button>
          )}

          <Label className="mt-4 mb-1.5 block text-[13px] text-muted-foreground">
            Save as new workout
          </Label>
          <Input
            value={workoutName}
            onChange={(event) => setWorkoutName(event.target.value)}
            placeholder="e.g. Upper mix"
            className="h-11 rounded-[10px] border-0 bg-muted text-[17px]"
          />
          <Button
            className="mt-3 h-[50px] w-full rounded-xl text-[17px] font-semibold"
            onClick={handleSaveWorkout}
            disabled={workoutName.trim() === ""}
            variant={showUpdate ? "secondary" : "default"}
          >
            Save as new workout
          </Button>
          <button
            type="button"
            onClick={handleSkip}
            className="mt-3 inline-flex h-[44px] w-full items-center justify-center text-[17px] text-primary"
          >
            Don&apos;t save
          </button>
        </div>
      )}

      {finished && (
        <div className="mt-8 text-center">
          {saved && (
            <p className="text-[15px] text-chart-2">New workout saved.</p>
          )}
          {updated && (
            <p className="text-[15px] text-chart-2">
              {startedType?.name} updated.
            </p>
          )}
          {skipped && (
            <p className="text-[15px] text-muted-foreground">
              Workout not saved. Set history kept.
            </p>
          )}
          <Link
            href="/"
            className="mt-6 inline-flex h-[50px] w-full items-center justify-center rounded-xl bg-primary text-[17px] font-semibold text-primary-foreground"
          >
            Done
          </Link>
        </div>
      )}
    </div>
  );
}
