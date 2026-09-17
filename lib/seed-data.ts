import exercises from "@/data/exercises.json";
import sessionTypes from "@/data/session-types.json";
import sessions from "@/data/sessions.json";
import type { SeedData } from "./types";

export const seedData: SeedData = {
  exercises: exercises as SeedData["exercises"],
  sessionTypes: sessionTypes as SeedData["sessionTypes"],
  sessions: sessions as SeedData["sessions"],
};
