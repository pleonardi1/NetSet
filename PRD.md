# PRD — NextSet

**Author:** Paul  ·  **Date:** 2026-09-17  ·  **Version:** 0.2

> Fill in **sections 1–4** (required). Sections **5–8** make the agent more accurate.
> When you are ready to build, tell Cursor:
> *"Read `PRD.md` and `DESIGN.md`. Follow the workshop rule. Seed from local JSON in `data/`; put new items in localStorage. No database or API keys yet. Do not write a JSON file on the server. Ask me any clarifying questions first, then build the smallest working version of the P0 must-haves in section 4, following the build order."*

---

## 1. Product Summary
- **One-liner:** For lifters who run different exercises on different days, **NextSet** is a workout log that makes it easy to record what you did, see your progress, and get one clear aim for the next set.
- **TL;DR:** **Modular** means you assemble today’s workout from individual exercises — start from a saved session type or swap in whatever you’re doing — without losing context. Each exercise in that mix brings its own last time, PR, and next-set aim, even if you’ve never done this exact combination before. Log weight × reps on one screen. After an exercise has been logged once anywhere, the app projects the next set as a single line — e.g. **“10 reps at 90 lb”** — from today’s sets, that exercise’s history, and a progression calculation. First time on an exercise: no projection; it is learning you. **Success = you log a session that way and take the suggested aim on a later set without second-guessing.**

## 2. Target Customer  *(Lean Product Process: Target Customer)*
- **User:** A solo lifter (the product owner) who trains with free weights and machines, not a coach managing clients.
- **Buyer / decision-maker:** Same person.
- **Top defining attributes:**
  1. Mixes session types (push / pull / legs or similar) instead of the same workout every visit *(behavioral)*.
  2. Wants last session’s numbers and a PR while lifting, not a locked 12-week program *(needs)*.
  3. Does not want to decide load from memory or from a generic “always add weight” rule *(needs)*.
  4. Logs on a phone between sets — one glance, one tap *(behavioral)*.
  5. Fine logging alone the first time an exercise appears; expects a target the second time *(behavioral)*.

## 3. Customer Problems & the Bet  *(Lean Product Process: Underserved Needs → Value)*
1. "I do some exercises one day and different ones another day — other apps assume a fixed routine or treat history as tied to one workout template."
2. "I want to build a workout on the fly from different exercises and still see my past numbers and what to do next for each one."
3. "I need to know what reps and sets I did last time, and what my PR is for that exercise."
4. "If I just hit 8 when it was supposed to be 10, I don’t know whether to stay or keep adding weight — I want one customized aim, not a lecture."

- **Riskiest assumption:** A calculated next-set aim (from history + a progression rule) will be trusted enough to follow on the next set, instead of ignored like a generic tip.
- **The bet (falsifiable):** We believe that fast logging plus last time, a target-rep PR, and one next-set line will make this the log they actually use. **We'll know we're right if** they complete a session with a swap, log every set, and use the suggested weight/reps on at least one later set.

## 4. Product Requirements / Functionality  *(Lean Product Process: MVP Feature Set)*

**Key user stories**
- As a lifter, I want to assemble today’s workout from exercises on the fly (start from a saved type, swap, or add) so today’s mix matches the gym, not a rigid template.
- As a lifter, I want each exercise in today’s mix to show its own past data and next-set projection — as if I’d trained that movement before — even when this exact combo of exercises is new.
- As a lifter, I want to log weight and reps in seconds so tracking is easier than a notes app.
- As a lifter, I want last time and my PR (best weight at this rep target) on the exercise so I can see progress while I lift — even when today’s workout is a different session type than last time.
- As a lifter, I want one next-set aim (“10 reps at 90 lb”) after the app has seen this exercise once so I know what to do next.
- As a lifter, I want a searchable library of exercises (by body part and equipment) with an illustration for each so I can find “smith machine squat” and add it to today’s workout.
- As a lifter, I want to start a workout from the library with no plan and add exercises as I go.
- As a lifter, I want to optionally save today’s exercise list at the end of a workout (or update the template I started from) while knowing my set records are saved either way.
- As a lifter, I want to rename, delete, and edit saved workouts — including Push and Legs — and add custom exercises when something is missing from the library.

**Must-haves for v1**

| ID | Requirement | Priority | Acceptance criterion (observable / measurable) |
|----|-------------|----------|------------------------------------------------|
| R1 | Seeded session types you can start (at least Push and Legs, each with ≥3 exercises and a rep target per exercise) | P0 | First visit shows named session types (not a blank page). Starting one opens that exercise list. |
| R2 | Log a set: exercise, weight (lb), reps | P0 | Submit a valid set → it appears on that exercise within 2s and is still there after refresh. |
| R3 | Reject blank or invalid log (missing weight or reps, or non-positive numbers) | P0 | Submit with weight or reps blank / ≤0 → inline message; no new set is created. |
| R4 | Swap an exercise on this session only | P0 | Replace bench with an exercise from the searchable library → the session shows the new name; logged sets stay on the exercise they belong to. |
| R5 | Last time for this exercise (most recent prior session: each set’s weight × reps) | P0 | On an exercise with seed/history, last session’s sets are visible before you log today. Exercise with no history: “No previous session yet.” **Cross-workout:** bench logged on Monday’s Push still shows as last time when bench appears in Wednesday’s different session type. |
| R6 | PR = heaviest weight logged for this exercise where reps ≥ today’s target reps | P0 | After a heavier qualifying set is saved, the PR line updates (e.g. “PR: 150 lb × 10”). No qualifying set: “No PR at this rep target yet.” |
| R7 | First time this exercise has any logged sets in history: no next-set aim | P0 | Copy states it is building knowledge; recommendations start the next time you do this exercise. No invented weight. |
| R8 | Second-or-later time on this exercise: next-set aim as **“{reps} reps at {weight} lb”** | P0 | After at least one prior session exists, a single aim line is visible for the upcoming set. Logging a different number still saves (override). |
| R9 | Suggestion uses today + history + a progression calculation (not a chatbot) | P0 | Hit the rep target → next aim holds or nudges load up a small step. Miss the target (e.g. 8 instead of 10) → same weight, target reps again. Last session missed a jump (owned 150×10, then 170×6) → next aim is a smaller step, not a repeat of 170. |
| R10 | New sessions and sets persist in the browser | P0 | Refresh after logging → the same session, sets, last time, and PR remain. |

| R11 | Optional info control on the aim that shows one-line why | P1 | Closed by default. Open → one short reason from the same calculation; no “best practice” lecture on the main screen. |
| R12 | Create or rename a session type | P1 | Superseded by R19–R20 for save/edit; still satisfied when user saves a new workout with a name. |
| R13 | Per-exercise history beyond last session (recent dates + top set) | P1 | Open history for an exercise → at least the last 3 sessions that included it. |
| R14 | Near-exhaustive searchable exercise library (hundreds of entries) | P0 | Library lists seeded exercises across chest, back, legs, shoulders, arms, core × barbell, dumbbell, cable, machine, smith, bodyweight, other. Search `"smith machine squat"` returns relevant matches. |
| R15 | Search matches name and metadata (body part, equipment) | P0 | Query can match words in the name or equipment/body-part labels, not name alone. |
| R16 | Unique programmatic illustration per exercise | P1 | Each library row shows a distinct SVG thumbnail generated from exercise attributes. **Deferred** — spec 002 shipped without illustrations. |
| R17 | Add or swap from library during a session; confirm duplicate add | P0 | **Add** appends; **Swap** replaces current slot only. If exercise is already in today’s list, confirm before adding again. |
| R18 | Start a workout from the library with no active session | P0 | Select exercise on `/exercises` with no in-progress session → new session opens immediately with that exercise. |
| R19 | End workout: optional save as new template or update started template; sets always saved | P0 | Complete screen offers save new name, update template started from (when list changed), or skip. All logged sets persist regardless. |
| R20 | Full edit of saved workouts on home (including seeded Push/Legs) | P0 | Rename, delete, reorder, add, and remove exercises in any saved workout template. |
| R21 | Custom exercises (name, body part, equipment) | P0 | User-created exercise appears in library search, persists after refresh, gets generated illustration, participates in history/PR/aim like seed exercises. |
| R22 | Natural language workout assembly from library | P1 | Describe workout on home → OpenAI returns exercise ids from catalog only → preview → start session. Next-set aim stays rule-based. |

*(P0 = must ship for v1 · P1 = should · P2 = nice-to-have.)*

**Modular workouts.** A session is an assembly of exercises for today — not a fixed program. Saved session types are shortcuts to start that assembly; swap/add changes today’s list only. History and projections attach to each **exercise**, not to the combo. You never need to have run this exact set of four exercises together before: bench shows bench’s last time and aim whether it sat in Push, Legs, or a one-off mix.

**Exercise history is global, not per session type.** Last time, PR, and next-set aim follow `exercise_id` across all workouts. Session types do not scope history. Lookup: most recent *session* (any type) that logged sets for this exercise.

**Build order:** 1) Core logging slice (R1–R11) — shipped → 2) spec `002-exercise-library-and-workout-templates`: expand `data/exercises.json`, search, illustrations, library routes, add/swap/start-from-library (R14–R18, R21) → 3) end-of-workout save/update and template editor on home (R19–R20). Do not add a database, OpenAI, or a third-party API.

**Explicitly NOT in v1 (non-goals):**
- No accounts, sharing, or anyone else’s workouts.
- No rest timers, video demos, licensed photo libraries, RPE/RIR as required fields, body-comp, or nutrition. (Programmatic SVG illustrations per exercise are in scope — R16.)
- No generated 12-week program and no locked routine you cannot swap.
- No chat-style coach. OpenAI may assemble workouts from the library (R22) but must not set loads or replace next-set aim — those stay in `lib/` rules.
- No native mobile app (responsive web is enough).

**Do NOT change / keep working:** Set logging, last time, PR, next-set aim, and global exercise history (R2–R10). Swap/add on a live session still changes today’s list only until the user explicitly saves or updates a template at end (R19).

## 5. Data Model
**Persistence:** seed in `data/*.json` · new items in localStorage · do not write JSON on the server · same field names if Neon is added later.

- **Exercise** — `data/exercises.json` (seed, hundreds of entries) + localStorage `nextset:custom-exercises` (user-created). Fields: `id`, `name`, `target_reps` (integer), `body_part` (`chest` \| `back` \| `legs` \| `shoulders` \| `arms` \| `core`), `equipment` (`barbell` \| `dumbbell` \| `cable` \| `machine` \| `smith` \| `bodyweight` \| `other`), `illustration` (pose key for parametric SVG generator). Relates to: session types, sets, library search.
- **Session type** — `data/session-types.json` (seed) + localStorage `nextset:session-types` (user saves and edits, including overrides to seeded Push/Legs). Fields: `id`, `name`, `exercise_ids` (ordered). Relates to: exercises. Live session changes do not rewrite a saved type until end-of-workout save/update (R19).
- **Session** — `data/sessions.json` (seed 2–3 past sessions so last time / PR / second-visit suggestions work on first run). New sessions in localStorage. Fields: `id`, `session_type_id`, `started_at`, `exercise_ids` (snapshot after swaps). Relates to: sets.
- **Set** — stored on the session as `sets[]`. Fields: `id`, `exercise_id`, `weight_lb` (number), `reps` (integer), `logged_at`. Relates to: exercise, session. History queries filter by `exercise_id` only — not by `session_type_id`.
- **Derived (not stored):** `last_session_sets` (sets for this `exercise_id` from the most recent prior session, regardless of session type), `pr_weight_lb` + `pr_reps`, `e1rm_lb` (Epley: `weight_lb * (1 + reps / 30)` from best sets — used only inside the suggestion), `next_aim` `{ reps, weight_lb, reason }`.
- **Example set:** `{ "id": "s1", "exercise_id": "ex-bench", "weight_lb": 150, "reps": 10, "logged_at": "2026-09-10T18:04:00Z" }`

## 6. Guidance on User Experience
- **Main user flow:** 1) open app → session types or **Exercise library** → 2) start Push, a saved workout, or pick an exercise from the library (instant session) → 3) optional add/swap from library → 4) on the current exercise: illustration, last time, PR, aim line (or learning copy) → 5) log set → 6) next exercise → 7) end → optional save as new workout or update started template → done.
- **Error / empty states:** No session types file/empty merge → still show a short empty message and a way to start once seed exists. Invalid log → inline error, stay on the form. First-time exercise → learning copy, log fields empty (no fake aim).
- **Glanceability:** Aim is the large line (`10 reps at 90 lb`). Last time and PR are secondary. Why is behind an info control (P1).
- **Visual aesthetic:** Follow `DESIGN.md`. Do not name a palette here.

## 7. Guidance on Tech Stack / Components
- **Stack:** Next.js + React + Tailwind + shadcn/ui. Seed JSON + localStorage. Deploy on Vercel.
- **Must-use:** Product rules in `lib/` (validate set, merge seed + localStorage, PR, last session, next-aim calculation). Pages render; they do not own the math.
- **Must-avoid:** No OpenAI. No modal as the only way to log a set — log inline on the exercise. No hardcoded hex in product UI.

## 8. Other Info & Open Questions
- **Products I admire (as references):** Strong / Hevy for one-screen logging and last-time prefills; Fitbod for history-based load — without generating the whole workout.
- **Open questions:**
  - `[ASSUMPTION]` Weight unit is lb only in v1.
  - `[ASSUMPTION]` Small load step is 5 lb (2.5 lb if that would overshoot the PR).
  - `[RESOLVED]` End-of-workout save can create a new template or update the one started from (R19). Full template edit on home including Push/Legs (R20).
  - `[ASSUMPTION]` Illustrations are programmatic SVG in `lib/`, not imported artwork.
  - `[ASSUMPTION]` PR uses reps ≥ target (a set of 11 at 155 counts as a 10-rep-target PR).
