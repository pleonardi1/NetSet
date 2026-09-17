import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {Array<{ id: string; name: string; target_reps: number; body_part: string; equipment: string }>} */
const manual = JSON.parse(
  readExistingManual(),
);

function readExistingManual() {
  return JSON.stringify([
    { id: "ex-bench", name: "Barbell bench press", target_reps: 10, body_part: "chest", equipment: "barbell" },
    { id: "ex-db-bench", name: "Dumbbell bench press", target_reps: 10, body_part: "chest", equipment: "dumbbell" },
    { id: "ex-incline", name: "Incline bench press", target_reps: 10, body_part: "chest", equipment: "barbell" },
    { id: "ex-incline-db", name: "Incline dumbbell press", target_reps: 10, body_part: "chest", equipment: "dumbbell" },
    { id: "ex-decline-bench", name: "Decline bench press", target_reps: 10, body_part: "chest", equipment: "barbell" },
    { id: "ex-smith-bench", name: "Smith machine bench press", target_reps: 10, body_part: "chest", equipment: "smith" },
    { id: "ex-chest-press", name: "Machine chest press", target_reps: 10, body_part: "chest", equipment: "machine" },
    { id: "ex-fly", name: "Cable fly", target_reps: 12, body_part: "chest", equipment: "cable" },
    { id: "ex-db-fly", name: "Dumbbell fly", target_reps: 12, body_part: "chest", equipment: "dumbbell" },
    { id: "ex-pec-deck", name: "Pec deck machine", target_reps: 12, body_part: "chest", equipment: "machine" },
    { id: "ex-pushup", name: "Push-up", target_reps: 12, body_part: "chest", equipment: "bodyweight" },
    { id: "ex-barbell-row", name: "Barbell row", target_reps: 10, body_part: "back", equipment: "barbell" },
    { id: "ex-db-row", name: "Dumbbell row", target_reps: 10, body_part: "back", equipment: "dumbbell" },
    { id: "ex-cable-row", name: "Seated cable row", target_reps: 10, body_part: "back", equipment: "cable" },
    { id: "ex-lat-pulldown", name: "Lat pulldown", target_reps: 10, body_part: "back", equipment: "cable" },
    { id: "ex-pull-up", name: "Pull-up", target_reps: 8, body_part: "back", equipment: "bodyweight" },
    { id: "ex-deadlift", name: "Conventional deadlift", target_reps: 5, body_part: "back", equipment: "barbell" },
    { id: "ex-rdl", name: "Romanian deadlift", target_reps: 10, body_part: "back", equipment: "barbell" },
    { id: "ex-t-bar-row", name: "T-bar row", target_reps: 10, body_part: "back", equipment: "barbell" },
    { id: "ex-face-pull", name: "Face pull", target_reps: 15, body_part: "back", equipment: "cable" },
    { id: "ex-back-extension", name: "Back extension", target_reps: 12, body_part: "back", equipment: "machine" },
    { id: "ex-squat", name: "Barbell back squat", target_reps: 8, body_part: "legs", equipment: "barbell" },
    { id: "ex-smith-squat", name: "Smith machine squat", target_reps: 10, body_part: "legs", equipment: "smith" },
    { id: "ex-front-squat", name: "Front squat", target_reps: 8, body_part: "legs", equipment: "barbell" },
    { id: "ex-goblet-squat", name: "Goblet squat", target_reps: 12, body_part: "legs", equipment: "dumbbell" },
    { id: "ex-leg-press", name: "Leg press", target_reps: 12, body_part: "legs", equipment: "machine" },
    { id: "ex-hack-squat", name: "Hack squat machine", target_reps: 10, body_part: "legs", equipment: "machine" },
    { id: "ex-lunge", name: "Walking lunge", target_reps: 10, body_part: "legs", equipment: "dumbbell" },
    { id: "ex-split-squat", name: "Bulgarian split squat", target_reps: 10, body_part: "legs", equipment: "dumbbell" },
    { id: "ex-leg-extension", name: "Leg extension", target_reps: 12, body_part: "legs", equipment: "machine" },
    { id: "ex-leg-curl", name: "Lying leg curl", target_reps: 12, body_part: "legs", equipment: "machine" },
    { id: "ex-calf", name: "Standing calf raise", target_reps: 15, body_part: "legs", equipment: "machine" },
    { id: "ex-seated-calf", name: "Seated calf raise", target_reps: 15, body_part: "legs", equipment: "machine" },
    { id: "ex-hip-thrust", name: "Barbell hip thrust", target_reps: 10, body_part: "legs", equipment: "barbell" },
    { id: "ex-ohp", name: "Barbell overhead press", target_reps: 10, body_part: "shoulders", equipment: "barbell" },
    { id: "ex-db-shoulder-press", name: "Dumbbell shoulder press", target_reps: 10, body_part: "shoulders", equipment: "dumbbell" },
    { id: "ex-smith-ohp", name: "Smith machine shoulder press", target_reps: 10, body_part: "shoulders", equipment: "smith" },
    { id: "ex-lateral-raise", name: "Dumbbell lateral raise", target_reps: 12, body_part: "shoulders", equipment: "dumbbell" },
    { id: "ex-cable-lateral", name: "Cable lateral raise", target_reps: 12, body_part: "shoulders", equipment: "cable" },
    { id: "ex-front-raise", name: "Dumbbell front raise", target_reps: 12, body_part: "shoulders", equipment: "dumbbell" },
    { id: "ex-reverse-fly", name: "Reverse dumbbell fly", target_reps: 12, body_part: "shoulders", equipment: "dumbbell" },
    { id: "ex-shrug", name: "Barbell shrug", target_reps: 12, body_part: "shoulders", equipment: "barbell" },
    { id: "ex-barbell-curl", name: "Barbell curl", target_reps: 10, body_part: "arms", equipment: "barbell" },
    { id: "ex-db-curl", name: "Dumbbell curl", target_reps: 10, body_part: "arms", equipment: "dumbbell" },
    { id: "ex-hammer-curl", name: "Hammer curl", target_reps: 10, body_part: "arms", equipment: "dumbbell" },
    { id: "ex-cable-curl", name: "Cable curl", target_reps: 12, body_part: "arms", equipment: "cable" },
    { id: "ex-preacher-curl", name: "Preacher curl machine", target_reps: 10, body_part: "arms", equipment: "machine" },
    { id: "ex-triceps", name: "Triceps pushdown", target_reps: 12, body_part: "arms", equipment: "cable" },
    { id: "ex-skull-crusher", name: "Skull crusher", target_reps: 10, body_part: "arms", equipment: "barbell" },
    { id: "ex-overhead-extension", name: "Overhead triceps extension", target_reps: 12, body_part: "arms", equipment: "dumbbell" },
    { id: "ex-dip", name: "Bench dip", target_reps: 10, body_part: "arms", equipment: "bodyweight" },
    { id: "ex-triceps-machine", name: "Triceps extension machine", target_reps: 12, body_part: "arms", equipment: "machine" },
    { id: "ex-plank", name: "Plank", target_reps: 60, body_part: "core", equipment: "bodyweight" },
    { id: "ex-crunch", name: "Cable crunch", target_reps: 15, body_part: "core", equipment: "cable" },
    { id: "ex-hanging-leg-raise", name: "Hanging leg raise", target_reps: 12, body_part: "core", equipment: "bodyweight" },
    { id: "ex-ab-wheel", name: "Ab wheel rollout", target_reps: 10, body_part: "core", equipment: "other" },
    { id: "ex-pallof-press", name: "Pallof press", target_reps: 12, body_part: "core", equipment: "cable" },
  ]);
}

const equipmentLabels = {
  barbell: "Barbell",
  dumbbell: "Dumbbell",
  cable: "Cable",
  machine: "Machine",
  smith: "Smith machine",
  bodyweight: "Bodyweight",
  other: "",
};

const expansions = [
  { body_part: "chest", equipment: "barbell", target_reps: 10, names: ["Close-grip bench press", "Wide-grip bench press", "Floor press", "Pin press", "Spoto press", "Paused bench press"] },
  { body_part: "chest", equipment: "dumbbell", target_reps: 10, names: ["Neutral-grip dumbbell press", "Single-arm dumbbell press", "Crush press", "Svend press"] },
  { body_part: "chest", equipment: "cable", target_reps: 12, names: ["Low cable fly", "High cable fly", "Single-arm cable fly", "Cable crossover"] },
  { body_part: "chest", equipment: "machine", target_reps: 10, names: ["Hammer strength chest press", "Incline machine press", "Decline machine press"] },
  { body_part: "chest", equipment: "smith", target_reps: 10, names: ["Smith incline press", "Smith decline press"] },
  { body_part: "chest", equipment: "bodyweight", target_reps: 12, names: ["Incline push-up", "Decline push-up", "Diamond push-up", "Archer push-up"] },
  { body_part: "back", equipment: "barbell", target_reps: 10, names: ["Pendlay row", "Yates row", "Snatch-grip deadlift", "Sumo deadlift", "Rack pull", "Good morning"] },
  { body_part: "back", equipment: "dumbbell", target_reps: 10, names: ["Chest-supported row", "Kroc row", "Renegade row", "Seal row"] },
  { body_part: "back", equipment: "cable", target_reps: 10, names: ["Straight-arm pulldown", "Single-arm cable row", "Wide-grip pulldown", "Close-grip pulldown", "Kneeling lat pulldown"] },
  { body_part: "back", equipment: "machine", target_reps: 10, names: ["Assisted pull-up", "Hammer strength row", "Iso-lateral row", "Lat pullover machine"] },
  { body_part: "back", equipment: "bodyweight", target_reps: 8, names: ["Chin-up", "Neutral-grip pull-up", "Inverted row", "Australian pull-up"] },
  { body_part: "back", equipment: "smith", target_reps: 10, names: ["Smith bent-over row", "Smith rack pull"] },
  { body_part: "legs", equipment: "barbell", target_reps: 8, names: ["Box squat", "Pause squat", "Zercher squat", "Jefferson squat", "Stiff-leg deadlift"] },
  { body_part: "legs", equipment: "dumbbell", target_reps: 10, names: ["Step-up", "Reverse lunge", "Curtsy lunge", "Romanian dumbbell deadlift", "Single-leg RDL"] },
  { body_part: "legs", equipment: "machine", target_reps: 12, names: ["Seated leg curl", "Standing leg curl", "Hip abduction machine", "Hip adduction machine", "Glute kickback machine", "Donkey calf raise machine"] },
  { body_part: "legs", equipment: "cable", target_reps: 12, names: ["Cable pull-through", "Cable kickback", "Cable step-up"] },
  { body_part: "legs", equipment: "smith", target_reps: 10, names: ["Smith lunge", "Smith split squat", "Smith calf raise"] },
  { body_part: "legs", equipment: "bodyweight", target_reps: 15, names: ["Bodyweight squat", "Jump squat", "Nordic curl", "Sissy squat"] },
  { body_part: "shoulders", equipment: "barbell", target_reps: 10, names: ["Push press", "Behind-the-neck press", "Upright row", "Landmine press"] },
  { body_part: "shoulders", equipment: "dumbbell", target_reps: 12, names: ["Arnold press", "Incline lateral raise", "Bent-over rear delt raise", "Y-raise", "W-raise"] },
  { body_part: "shoulders", equipment: "cable", target_reps: 12, names: ["Cable front raise", "Cable rear delt fly", "Face pull (rope)", "Cable upright row"] },
  { body_part: "shoulders", equipment: "machine", target_reps: 10, names: ["Machine shoulder press", "Reverse pec deck", "Lateral raise machine"] },
  { body_part: "shoulders", equipment: "smith", target_reps: 10, names: ["Smith upright row", "Smith push press"] },
  { body_part: "arms", equipment: "barbell", target_reps: 10, names: ["Drag curl", "Reverse curl", "Close-grip bench press (triceps)", "JM press"] },
  { body_part: "arms", equipment: "dumbbell", target_reps: 10, names: ["Incline dumbbell curl", "Concentration curl", "Cross-body hammer curl", "Kickback", "Tate press"] },
  { body_part: "arms", equipment: "cable", target_reps: 12, names: ["Rope pushdown", "Overhead rope extension", "Single-arm pushdown", "Bayesian curl"] },
  { body_part: "arms", equipment: "machine", target_reps: 12, names: ["Assisted dip machine", "Bicep curl machine", "Triceps dip machine"] },
  { body_part: "arms", equipment: "bodyweight", target_reps: 10, names: ["Parallel bar dip", "Close-grip push-up"] },
  { body_part: "core", equipment: "bodyweight", target_reps: 15, names: ["Dead bug", "Bird dog", "Mountain climber", "V-up", "Bicycle crunch"] },
  { body_part: "core", equipment: "cable", target_reps: 15, names: ["Wood chop", "Anti-rotation hold", "Kneeling cable crunch"] },
  { body_part: "core", equipment: "machine", target_reps: 15, names: ["Torso rotation machine", "Ab crunch machine"] },
  { body_part: "core", equipment: "other", target_reps: 12, names: ["Decline sit-up", "Medicine ball slam", "Farmer carry"] },
  { body_part: "chest", equipment: "other", target_reps: 10, names: ["Resistance band press", "Resistance band fly"] },
  { body_part: "back", equipment: "other", target_reps: 10, names: ["Resistance band row", "Resistance band pulldown"] },
  { body_part: "legs", equipment: "other", target_reps: 12, names: ["Kettlebell swing", "Kettlebell goblet squat", "Sled push", "Sled drag"] },
  { body_part: "shoulders", equipment: "bodyweight", target_reps: 12, names: ["Pike push-up", "Handstand push-up"] },
  { body_part: "arms", equipment: "smith", target_reps: 10, names: ["Smith close-grip bench", "Smith curl"] },
  { body_part: "legs", equipment: "barbell", target_reps: 10, names: ["Barbell lunge", "Barbell step-up", "Barbell glute bridge"] },
  { body_part: "back", equipment: "cable", target_reps: 12, names: ["Cable shrug", "Cable deadlift"] },
  { body_part: "chest", equipment: "dumbbell", target_reps: 12, names: ["Dumbbell pullover", "Dumbbell squeeze press"] },
  { body_part: "shoulders", equipment: "dumbbell", target_reps: 10, names: ["Dumbbell upright row", "Dumbbell shrug"] },
  { body_part: "arms", equipment: "cable", target_reps: 12, names: ["Cable hammer curl", "Cable reverse curl"] },
  { body_part: "core", equipment: "bodyweight", target_reps: 20, names: ["Side plank", "Hollow hold", "Superman hold"] },
];

const byId = new Map(manual.map((exercise) => [exercise.id, exercise]));
const byName = new Set(manual.map((exercise) => exercise.name.toLowerCase()));

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

for (const group of expansions) {
  for (const name of group.names) {
    const key = name.toLowerCase();
    if (byName.has(key)) continue;
    const label = equipmentLabels[group.equipment];
    const fullName =
      label && !name.toLowerCase().includes(label.toLowerCase())
        ? `${label} ${name.charAt(0).toLowerCase()}${name.slice(1)}`
        : name;
    const id = `ex-${slug(fullName)}`;
    if (byId.has(id)) continue;
    const exercise = {
      id,
      name: fullName,
      target_reps: group.target_reps,
      body_part: group.body_part,
      equipment: group.equipment,
    };
    byId.set(id, exercise);
    byName.add(fullName.toLowerCase());
  }
}

const exercises = [...byId.values()].sort((a, b) =>
  a.body_part.localeCompare(b.body_part) ||
  a.equipment.localeCompare(b.equipment) ||
  a.name.localeCompare(b.name),
);

const output = join(__dirname, "../data/exercises.json");
writeFileSync(output, `${JSON.stringify(exercises, null, 2)}\n`);
console.log(`Wrote ${exercises.length} exercises to ${output}`);
