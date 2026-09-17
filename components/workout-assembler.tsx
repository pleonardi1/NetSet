"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { assembleWorkoutAction } from "@/app/actions/assemble-workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadCustomExercises } from "@/lib/custom-exercises";
import { getMergedExercises } from "@/lib/exercises";
import { seedData } from "@/lib/seed-data";
import { createAssembledSession, upsertStoredSession } from "@/lib/store";
import type { AssembledWorkout } from "@/lib/types";

export function WorkoutAssembler() {
  const router = useRouter();
  const exercises = useMemo(() => getMergedExercises(seedData.exercises), []);
  const exerciseMap = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.id, exercise])),
    [exercises],
  );

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<AssembledWorkout | null>(null);

  async function handleBuild() {
    setLoading(true);
    setError(null);
    setProposal(null);
    const result = await assembleWorkoutAction(
      prompt,
      loadCustomExercises(),
    );
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setProposal(result.workout);
  }

  function handleStart() {
    if (!proposal) return;
    const session = createAssembledSession(
      proposal.title,
      proposal.exercise_ids,
    );
    upsertStoredSession(session);
    router.push(`/session/${session.id}`);
  }

  return (
    <section className="mb-6">
      <h2 className="mb-2 px-4 text-[13px] uppercase tracking-wide text-muted-foreground">
        Build with AI
      </h2>
      <div className="rounded-xl bg-card p-4">
        <p className="text-[15px] text-muted-foreground">
          Describe today&apos;s workout — equipment, time, body parts — and
          NextSet picks exercises from your library.
        </p>
        <Input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder='e.g. "45 min, cables and dumbbells, back and biceps"'
          className="mt-3 h-11 rounded-[10px] border-0 bg-muted px-3 text-[17px]"
          disabled={loading}
        />
        {error && (
          <p className="mt-3 text-[15px] text-destructive">{error}</p>
        )}
        {!proposal ? (
          <Button
            className="mt-3 h-[44px] w-full rounded-xl text-[17px] font-semibold"
            onClick={handleBuild}
            disabled={loading || prompt.trim().length < 3}
          >
            {loading ? "Building…" : "Build workout"}
          </Button>
        ) : (
          <div className="mt-4">
            <h3 className="text-[20px] font-semibold">{proposal.title}</h3>
            {proposal.note && (
              <p className="mt-1 text-[15px] text-muted-foreground">
                {proposal.note}
              </p>
            )}
            <ul className="mt-3 overflow-hidden rounded-xl bg-muted">
              {proposal.exercise_ids.map((exerciseId, index) => (
                <li
                  key={exerciseId}
                  className={`px-4 py-3 text-[17px] ${
                    index > 0 ? "border-t border-border" : ""
                  }`}
                >
                  {exerciseMap.get(exerciseId)?.name ?? exerciseId}
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 h-[50px] w-full rounded-xl text-[17px] font-semibold"
              onClick={handleStart}
            >
              Start this workout
            </Button>
            <button
              type="button"
              onClick={() => {
                setProposal(null);
                setError(null);
              }}
              className="mt-2 min-h-[44px] w-full text-[17px] text-primary"
            >
              Try another description
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
