"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExerciseLibrary } from "@/components/exercise-library";
import { addCustomExercise } from "@/lib/custom-exercises";
import { getMergedExercises } from "@/lib/exercises";
import { formatBodyPart, formatEquipment } from "@/lib/search-exercises";
import { seedData } from "@/lib/seed-data";
import {
  addExerciseToSession,
  createQuickStartSession,
  getMergedSessions,
  upsertStoredSession,
} from "@/lib/store";
import type { BodyPart, Equipment } from "@/lib/types";

const bodyParts: BodyPart[] = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
];

const equipmentOptions: Equipment[] = [
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "smith",
  "bodyweight",
  "other",
];

export function ExerciseBrowseScreen() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customBodyPart, setCustomBodyPart] = useState<BodyPart>("chest");
  const [customEquipment, setCustomEquipment] = useState<Equipment>("barbell");
  const [customError, setCustomError] = useState<string | null>(null);

  const exercises = useMemo(
    () => getMergedExercises(seedData.exercises),
    [refreshKey],
  );

  function startWithExercise(exerciseId: string) {
    const merged = getMergedSessions(seedData.sessions);
    const active = merged.find((session) => !session.completed_at);
    if (active) {
      if (active.exercise_ids.includes(exerciseId)) {
        const confirmed = window.confirm(
          "Already in this workout — add again?",
        );
        if (!confirmed) return;
      }
      const next = addExerciseToSession(active, exerciseId);
      upsertStoredSession(next);
      router.push(
        `/session/${active.id}?exercise=${next.exercise_ids.length - 1}`,
      );
      return;
    }
    const session = createQuickStartSession(exerciseId);
    upsertStoredSession(session);
    router.push(`/session/${session.id}`);
  }

  function handleAddCustom() {
    const result = addCustomExercise({
      name: customName,
      body_part: customBodyPart,
      equipment: customEquipment,
    });
    if (!result.ok) {
      setCustomError(result.message);
      return;
    }
    setCustomError(null);
    setCustomName("");
    setShowCustomForm(false);
    setRefreshKey((value) => value + 1);
    startWithExercise(result.exercise.id);
  }

  return (
    <div className="mx-auto min-h-full w-full max-w-[430px] px-4 pb-8 pt-6">
      <nav className="mb-4 flex items-center justify-between">
        <Link href="/" className="text-[17px] text-primary">
          ‹ Workouts
        </Link>
        <button
          type="button"
          onClick={() => setShowCustomForm((value) => !value)}
          className="text-[17px] text-primary"
        >
          {showCustomForm ? "Cancel" : "Custom"}
        </button>
      </nav>

      {showCustomForm && (
        <div className="mb-4 rounded-xl bg-card p-4">
          <h3 className="text-[17px] font-semibold">Add custom exercise</h3>
          <Label className="mt-3 mb-1.5 block text-[13px] text-muted-foreground">
            Name
          </Label>
          <Input
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            placeholder="e.g. Landmine rotation"
            className="h-11 rounded-[10px] border-0 bg-muted text-[17px]"
          />
          <Label className="mt-3 mb-1.5 block text-[13px] text-muted-foreground">
            Body part
          </Label>
          <select
            value={customBodyPart}
            onChange={(event) =>
              setCustomBodyPart(event.target.value as BodyPart)
            }
            className="h-11 w-full rounded-[10px] border-0 bg-muted px-3 text-[17px]"
          >
            {bodyParts.map((part) => (
              <option key={part} value={part}>
                {formatBodyPart(part)}
              </option>
            ))}
          </select>
          <Label className="mt-3 mb-1.5 block text-[13px] text-muted-foreground">
            Equipment
          </Label>
          <select
            value={customEquipment}
            onChange={(event) =>
              setCustomEquipment(event.target.value as Equipment)
            }
            className="h-11 w-full rounded-[10px] border-0 bg-muted px-3 text-[17px]"
          >
            {equipmentOptions.map((option) => (
              <option key={option} value={option}>
                {formatEquipment(option)}
              </option>
            ))}
          </select>
          {customError && (
            <p className="mt-3 text-[15px] text-destructive">{customError}</p>
          )}
          <Button
            className="mt-4 h-[44px] w-full rounded-xl"
            onClick={handleAddCustom}
          >
            Add and start workout
          </Button>
        </div>
      )}

      <ExerciseLibrary
        exercises={exercises}
        title="Exercise library"
        subtitle="Search by name, body part, or equipment. Tap to start a workout."
        actionLabel="Start"
        onSelect={startWithExercise}
      />
    </div>
  );
}
