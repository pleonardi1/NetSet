export type BodyPart =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "smith"
  | "bodyweight"
  | "other";

export type IllustrationKey =
  | "squat"
  | "hinge"
  | "lunge"
  | "leg-press"
  | "leg-curl"
  | "leg-extension"
  | "calf-raise"
  | "bench"
  | "incline-press"
  | "fly"
  | "pushdown"
  | "row"
  | "pulldown"
  | "pull-up"
  | "ohp"
  | "lateral-raise"
  | "curl"
  | "extension"
  | "crunch"
  | "plank";

export type Exercise = {
  id: string;
  name: string;
  target_reps: number;
  body_part: BodyPart;
  equipment: Equipment;
  illustration?: IllustrationKey;
};

export type SessionType = {
  id: string;
  name: string;
  exercise_ids: string[];
};

export type WorkoutSet = {
  id: string;
  exercise_id: string;
  weight_lb: number;
  reps: number;
  logged_at: string;
};

export type Session = {
  id: string;
  session_type_id: string;
  started_at: string;
  exercise_ids: string[];
  /** Snapshot of the template exercise list when the session started. */
  started_exercise_ids: string[];
  sets: WorkoutSet[];
  completed_at?: string;
  /** Display name for AI-assembled or ad-hoc sessions. */
  label?: string;
};

export type AssembledWorkout = {
  title: string;
  exercise_ids: string[];
  note: string;
};

export type AssembleWorkoutResult =
  | { ok: true; workout: AssembledWorkout }
  | { ok: false; message: string };

export type NextAim = {
  reps: number;
  weight_lb: number;
  reason: string;
};

export type SeedData = {
  exercises: Exercise[];
  sessionTypes: SessionType[];
  sessions: Session[];
};

export type SetInput = {
  weight_lb: string | number;
  reps: string | number;
};

export type ValidationResult =
  | { ok: true; weight_lb: number; reps: number }
  | { ok: false; message: string };
