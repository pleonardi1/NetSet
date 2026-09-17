"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  formatBodyPart,
  formatEquipment,
  searchExercises,
} from "@/lib/search-exercises";
import type { BodyPart, Equipment, Exercise } from "@/lib/types";

const bodyParts: Array<BodyPart | "all"> = [
  "all",
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
];

const equipmentTypes: Array<Equipment | "all"> = [
  "all",
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "smith",
  "bodyweight",
  "other",
];

type ExerciseLibraryProps = {
  exercises: Exercise[];
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onSelect: (exerciseId: string) => void;
  onCancel?: () => void;
};

export function ExerciseLibrary({
  exercises,
  title,
  subtitle,
  actionLabel = "Add",
  onSelect,
  onCancel,
}: ExerciseLibraryProps) {
  const [query, setQuery] = useState("");
  const [bodyPart, setBodyPart] = useState<BodyPart | "all">("all");
  const [equipment, setEquipment] = useState<Equipment | "all">("all");

  const results = useMemo(
    () => searchExercises(exercises, query, { body_part: bodyPart, equipment }),
    [exercises, query, bodyPart, equipment],
  );

  return (
    <div className="flex min-h-full flex-col gap-4">
      <div>
        <h2 className="text-[22px] font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-[15px] text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='Search e.g. "smith machine squat"'
        className="h-11 rounded-[10px] border-0 bg-muted px-3 text-[17px]"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {bodyParts.map((part) => (
          <FilterChip
            key={part}
            active={bodyPart === part}
            label={part === "all" ? "All" : formatBodyPart(part)}
            onClick={() => setBodyPart(part)}
          />
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {equipmentTypes.map((type) => (
          <FilterChip
            key={type}
            active={equipment === type}
            label={type === "all" ? "All gear" : formatEquipment(type)}
            onClick={() => setEquipment(type)}
          />
        ))}
      </div>

      <p className="px-1 text-[13px] text-muted-foreground">
        {results.length} exercise{results.length === 1 ? "" : "s"}
      </p>

      <div className="flex-1 overflow-hidden rounded-xl bg-card">
        {results.length === 0 ? (
          <p className="px-4 py-8 text-center text-[15px] text-muted-foreground">
            No exercises match that search.
          </p>
        ) : (
          results.map((exercise, index) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => onSelect(exercise.id)}
              className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left min-h-[56px] ${
                index > 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-[17px] font-medium text-foreground">
                  {exercise.name}
                </div>
                <div className="text-[13px] text-muted-foreground">
                  {formatBodyPart(exercise.body_part)} ·{" "}
                  {formatEquipment(exercise.equipment)} · {exercise.target_reps}{" "}
                  rep target
                </div>
              </div>
              <span className="shrink-0 text-[15px] text-primary">
                {actionLabel}
              </span>
            </button>
          ))
        )}
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[44px] text-[17px] text-primary"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-card text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
