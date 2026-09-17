"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getMergedExercises } from "@/lib/exercises";
import {
  createSession,
  getLastSessionLabel,
  getMergedSessionTypes,
  getMergedSessions,
  upsertStoredSession,
} from "@/lib/store";
import { WorkoutAssembler } from "@/components/workout-assembler";
import { seedData } from "@/lib/seed-data";
import type { SessionType } from "@/lib/types";

export function HomeScreen() {
  const router = useRouter();
  const exercises = useMemo(() => getMergedExercises(seedData.exercises), []);
  const exerciseMap = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.id, exercise])),
    [exercises],
  );
  const mergedSessions = useMemo(
    () => getMergedSessions(seedData.sessions),
    [],
  );
  const sessionTypes = useMemo(
    () => getMergedSessionTypes(seedData.sessionTypes),
    [],
  );

  function startSession(sessionType: SessionType) {
    const session = createSession(sessionType);
    upsertStoredSession(session);
    router.push(`/session/${session.id}`);
  }

  function exerciseSummary(exerciseIds: string[]) {
    const names = exerciseIds
      .slice(0, 3)
      .map((id) => exerciseMap.get(id)?.name ?? id);
    const extra =
      exerciseIds.length > 3 ? ` · +${exerciseIds.length - 3} more` : "";
    return `${names.join(" · ")}${extra}`;
  }

  const seedTypeIds = new Set(seedData.sessionTypes.map((type) => type.id));

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[430px] flex-col px-4 pb-8 pt-6">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[34px] font-bold leading-tight tracking-tight text-foreground">
            Workouts
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Start a saved workout or pick from the library
          </p>
        </div>
        <Link
          href="/exercises"
          className="shrink-0 rounded-full bg-card px-3 py-2 text-[15px] text-primary"
        >
          Library
        </Link>
      </header>

      <WorkoutAssembler />

      <section className="mb-6">
        <h2 className="mb-2 px-4 text-[13px] uppercase tracking-wide text-muted-foreground">
          Start
        </h2>
        <div className="overflow-hidden rounded-xl bg-card">
          {sessionTypes.map((sessionType, index) => (
            <div
              key={sessionType.id}
              className={`flex items-center ${
                index > 0 ? "border-t border-border" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => startSession(sessionType)}
                className="flex min-h-[44px] flex-1 items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <div>
                  <div className="text-[17px] font-normal text-foreground">
                    {sessionType.name}
                    {!seedTypeIds.has(sessionType.id) && (
                      <span className="ml-2 text-[13px] text-muted-foreground">
                        Saved
                      </span>
                    )}
                  </div>
                  <div className="text-[15px] text-muted-foreground">
                    {exerciseSummary(sessionType.exercise_ids)}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getLastSessionLabel(mergedSessions, sessionType.id) && (
                    <span className="text-[13px]">
                      {getLastSessionLabel(mergedSessions, sessionType.id)}
                    </span>
                  )}
                  <ChevronRight className="size-5" />
                </div>
              </button>
              <Link
                href={`/workouts/${sessionType.id}/edit`}
                className="shrink-0 px-3 py-3.5 text-[15px] text-primary"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 px-4 text-[13px] uppercase tracking-wide text-muted-foreground">
          Recent
        </h2>
        <div className="overflow-hidden rounded-xl bg-card">
          {mergedSessions
            .slice()
            .reverse()
            .slice(0, 4)
            .map((session, index) => {
              const type = sessionTypes.find(
                (item) => item.id === session.session_type_id,
              );
              return (
                <div
                  key={session.id}
                  className={`flex items-center justify-between px-4 py-3.5 ${
                    index > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <span className="text-[17px]">{type?.name ?? "Workout"}</span>
                  <span className="text-[15px] text-muted-foreground">
                    {new Date(session.started_at).toLocaleDateString(undefined, {
                      weekday: "short",
                    })}
                  </span>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
