"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExerciseLibrary } from "@/components/exercise-library";
import { getMergedExercises } from "@/lib/exercises";
import { seedData } from "@/lib/seed-data";
import {
  deleteWorkoutTemplate,
  getMergedSessionTypes,
  updateWorkoutTemplate,
} from "@/lib/store";

type TemplateEditorScreenProps = {
  templateId: string;
};

export function TemplateEditorScreen({ templateId }: TemplateEditorScreenProps) {
  const router = useRouter();
  const exercises = useMemo(() => getMergedExercises(seedData.exercises), []);
  const initialType = useMemo(
    () =>
      getMergedSessionTypes(seedData.sessionTypes).find(
        (type) => type.id === templateId,
      ),
    [templateId],
  );

  const [name, setName] = useState(initialType?.name ?? "");
  const [exerciseIds, setExerciseIds] = useState<string[]>(
    initialType?.exercise_ids ?? [],
  );
  const [showLibrary, setShowLibrary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exerciseMap = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.id, exercise])),
    [exercises],
  );

  if (!initialType) {
    return (
      <div className="mx-auto max-w-[430px] px-4 py-12 text-center">
        <p className="text-muted-foreground">Workout not found.</p>
        <Link href="/" className="mt-4 inline-block text-[17px] text-primary">
          Back home
        </Link>
      </div>
    );
  }

  function moveExercise(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= exerciseIds.length) return;
    const next = [...exerciseIds];
    [next[index], next[target]] = [next[target], next[index]];
    setExerciseIds(next);
  }

  function removeExercise(index: number) {
    setExerciseIds(exerciseIds.filter((_, i) => i !== index));
  }

  function handleSave() {
    if (name.trim() === "") {
      setError("Workout name is required.");
      return;
    }
    if (exerciseIds.length === 0) {
      setError("Add at least one exercise.");
      return;
    }
    updateWorkoutTemplate(
      templateId,
      { name: name.trim(), exercise_ids: exerciseIds },
      seedData.sessionTypes,
    );
    router.push("/");
  }

  function handleDelete() {
    const typeName = initialType?.name ?? "this workout";
    if (!window.confirm(`Delete "${typeName}"? This cannot be undone.`)) {
      return;
    }
    deleteWorkoutTemplate(templateId);
    router.push("/");
  }

  if (showLibrary) {
    return (
      <div className="mx-auto min-h-full w-full max-w-[430px] px-4 pb-8 pt-6">
        <ExerciseLibrary
          exercises={exercises}
          title="Add to workout"
          subtitle={`Adding to ${name || initialType.name}`}
          actionLabel="Add"
          onSelect={(exerciseId) => {
            setExerciseIds([...exerciseIds, exerciseId]);
            setShowLibrary(false);
          }}
          onCancel={() => setShowLibrary(false)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-full w-full max-w-[430px] px-4 pb-8 pt-6">
      <nav className="mb-4">
        <Link href="/" className="text-[17px] text-primary">
          ‹ Workouts
        </Link>
      </nav>

      <h1 className="text-[28px] font-bold tracking-tight">Edit workout</h1>

      <Label className="mt-4 mb-1.5 block text-[13px] text-muted-foreground">
        Name
      </Label>
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="h-11 rounded-[10px] border-0 bg-muted text-[17px]"
      />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[13px] uppercase tracking-wide text-muted-foreground">
          Exercises
        </h2>
        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          className="text-[15px] text-primary"
        >
          Add exercise
        </button>
      </div>

      <div className="mt-2 overflow-hidden rounded-xl bg-card">
        {exerciseIds.length === 0 ? (
          <p className="px-4 py-6 text-[15px] text-muted-foreground">
            No exercises yet. Add from the library.
          </p>
        ) : (
          exerciseIds.map((exerciseId, index) => (
            <div
              key={`${exerciseId}-${index}`}
              className={`flex items-center gap-2 px-4 py-3 ${
                index > 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-[17px]">
                  {exerciseMap.get(exerciseId)?.name ?? exerciseId}
                </div>
              </div>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveExercise(index, -1)}
                className="text-[15px] text-primary disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === exerciseIds.length - 1}
                onClick={() => moveExercise(index, 1)}
                className="text-[15px] text-primary disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeExercise(index)}
                className="text-[15px] text-destructive"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {error && (
        <p className="mt-3 text-[15px] text-destructive">{error}</p>
      )}

      <Button
        className="mt-6 h-[50px] w-full rounded-xl text-[17px] font-semibold"
        onClick={handleSave}
      >
        Save changes
      </Button>
      <button
        type="button"
        onClick={handleDelete}
        className="mt-3 min-h-[44px] w-full text-[17px] text-destructive"
      >
        Delete workout
      </button>
    </div>
  );
}
