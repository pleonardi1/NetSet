# Spec 002 — Exercise library and workout templates

| Field | Value |
|---|---|
| **Status** | `shipped` |
| **Owner** | Paul |
| **Started** | 2026-09-17 |
| **Done** | 2026-09-17 |
| **Strategy ref** | `PRD.md` § 4 (R14–R21), § 5 |

> Searchable exercise library (206 seed exercises), add/swap/start-from-library flows, optional save-or-update at end of workout, full saved-template management, and custom exercises — set history always persists. Illustrations deferred per product decision.

---

## 1. What ships when this is done

The user can open **Exercise library** from home or mid-workout, search 200+ exercises by name, body part, or equipment, and add an exercise to today’s session (with a confirm if it is already in the list). From the library with no active workout, tapping **Start** opens a new session immediately with that exercise. During a workout, **Add** and **Swap** open the same searchable picker. At **End**, the user can save today’s final exercise list as a new reusable workout, update the template they started from, or skip — logged sets remain either way. On home, every saved workout (including seeded Push and Legs) can be renamed, deleted, and edited (reorder, add, remove exercises). Users can create **custom exercises** (name, body part, equipment) that appear in search like seed entries.

## 2. User stories

- **As a lifter**, when I know the movement I want (e.g. “smith machine squat”), I need to search the library and add it to today’s workout so I can log sets without hunting through a fixed template.
- **As a lifter**, when I walk in without a plan, I need to start a workout from the library with one exercise and add more as I go so today’s mix matches the gym.
- **As a lifter**, when I finish a session I assembled on the fly, I need to optionally save that exercise list (or update the template I started from) so I can start the same mix next time — while knowing my set records are saved even if I skip.
- **As a lifter**, when a movement is missing from the library, I need to add a custom exercise with body part and equipment so it behaves like any other exercise in search, history, and PR.

## 3. Surfaces

- Routes: `/exercises` · `/session/[id]` (Add/Swap picker, complete screen) · `/` (Library link, template edit)
- Components: `components/exercise-library.tsx` · `components/exercise-browse-screen.tsx` · `components/session-workout.tsx` · `components/home-screen.tsx` · `components/template-editor-screen.tsx`
- Actions / API: `n/a` — client + `lib/` only
- Seed / lib: `data/exercises.json` (206 entries) · `lib/types.ts` · `lib/search-exercises.ts` · `lib/store.ts` · `lib/custom-exercises.ts` · `lib/exercises.ts`
- Env vars: `n/a`

## 4. Done criteria

**Empty / first-visit:** library loads with seeded exercises and filters; no blank screen.

**Bad / blank input:** custom exercise rejects blank name; save-workout rejects blank name when user taps Save; duplicate-add shows confirm, not silent failure.

**Refresh:** saved templates, custom exercises, sessions, and sets survive refresh via localStorage merge with seed.

- [x] Open **Exercise library** from home → searchable list with body-part and equipment metadata visible.
- [x] WHEN the user searches `"smith machine squat"` THE library SHALL surface matching exercises using name and metadata (body part, equipment).
- [x] IF search returns no results THEN THE library SHALL show a short empty message (never a blank list area).
- [x] WHEN the user selects an exercise from the library with **no active session** THE app SHALL start a new session immediately containing that exercise and open the workout screen.
- [x] WHEN the user taps **Add** during an active session THE library picker SHALL append the exercise to today’s `exercise_ids` and navigate to it.
- [x] WHEN the user taps **Swap** during an active session THE library picker SHALL replace only the current exercise slot; logged sets remain tied to their `exercise_id`.
- [x] IF the user adds an exercise already in today’s session THEN THE app SHALL ask “Already in this workout — add again?” with confirm and cancel; cancel SHALL NOT add a duplicate.
- [x] WHEN the user ends a workout THEN logged sets SHALL persist regardless of save choice; the complete screen SHALL offer **Save as new workout**, **Update [started template]** (when session began from a saved type and the list changed), and **Don’t save**.
- [x] WHEN the user saves a new workout with a name THEN it SHALL appear on the home **Start** list after refresh.
- [x] WHEN the user updates the template they started from THEN the saved template’s `exercise_ids` SHALL match today’s final list after refresh.
- [x] WHEN the user edits a saved workout from home (including seeded Push/Legs) THEN they SHALL be able to rename, delete, and change the exercise list (add, remove, reorder).
- [x] WHEN the user creates a custom exercise (name, body part, equipment) THEN it SHALL appear in library search and persist in localStorage after refresh.
- [x] `npm test` succeeds (`lib/` coverage floor)
- [x] `npm run build` succeeds

## 5. Constraints (must NOT)

- Do not add a database, API keys, or require a filled `.env`.
- Do not write JSON on the server at runtime.
- Do not invent a new visual style — follow `DESIGN.md`.
- Do not switch stacks (no Vite, no `src/`, no second database).
- Do not break existing P0 logging: last time, PR, next-set aim, and set validation (R2–R10) must keep working.
- Do not use licensed stock photos or video demos.
- Illustrations (R16) deferred — do not block this slice on SVG work.
- Do not scope exercise history by session type — history stays global per `exercise_id` (PRD § 4).

## 6. Out of scope (for this spec)

- Per-exercise illustrations (R16) — future spec, unassigned
- Per-exercise history screen beyond last session — `PRD.md` R13 (P1), future spec
- Rest timers, RPE/RIR, nutrition — `PRD.md` non-goals
- Accounts, sharing, sync across devices — `PRD.md` non-goals
- OpenAI or chat-style coaching — `PRD.md` non-goals
- Importing exercises from external APIs or CSV upload — future, unassigned

## 7. Dependencies

- **Blocking:** Core workout logging (R1–R10) — shipped in app; must remain green
- **Blocking:** `n/a — no env vars or human actions`
- **Nice-to-have:** `n/a`

## 8. Open questions

| Question | Owner | Blocking? |
|---|---|---|
| Exact seed count target for “near-exhaustive” (e.g. 200 vs 400 entries) | Paul | no — ship ≥200 covering all body parts × equipment types; expand seed in follow-up commits within this spec |
| Illustration param schema | Paul | no — deferred to future spec |
| n/a — product decisions locked in PRD R14–R15, R17–R21 | — | — |

## 9. Architecture notes

**Exercise catalog:** Seed in `data/exercises.json` — target hundreds of entries. Fields: `id`, `name`, `target_reps`, `body_part`, `equipment`, `illustration` (pose/movement key for generator). Merge with user custom exercises from localStorage key `nextset:custom-exercises`.

**Search:** `lib/search-exercises.ts` — token match on name plus body part and equipment labels (e.g. query `"smith squat"` matches name and equipment metadata).

**Illustrations:** Deferred. `illustration` field remains optional on `Exercise` for a future slice.

**Session types (workout templates):** Seed in `data/session-types.json`; user-created and edited types in localStorage `nextset:session-types`. Seeded Push/Legs follow the same edit/delete rules as custom templates (overrides stored in localStorage; seed file unchanged on server).

**Sessions:** Unchanged — `nextset:sessions`. `session_type_id` references the template used to start; `exercise_ids` is a snapshot after adds/swaps. End-of-workout save creates a new `SessionType` or updates an existing stored type; it does not retroactively change past sessions.

**Start from library:** `createSession` with a synthetic one-exercise type or ad-hoc session — use a dedicated “Quick start” session type id in localStorage or inline `{ id, name: "Quick workout", exercise_ids: [picked] }` without requiring a pre-saved template.

## 10. Domain & quality guardrails

- Stack and secrets: `.cursor/rules/workshop.mdc`
- Folders: `.cursor/rules/folders.mdc`
- Look: `DESIGN.md` — semantic tokens only in product UI
- Copy: product terms (library, workout, exercise) — no “template engine” or technique names in UI

## 11. Test plan

- `lib/search-exercises.ts` — multi-word query, metadata match, empty query, filter combinations, no results
- `lib/store.ts` — merge session types, save/update/delete template, add exercise to session, duplicate guard helper if extracted
- `lib/custom-exercises.ts` — create, validate blank name, merge with seed, reload
- `lib/exercise-illustration.ts` — deterministic output for same inputs, distinct keys for different exercises (if testable without DOM snapshots)
- Screen cases (manual or component tests if present): library empty search · add from library starts session · end-workout skip still shows sets on refresh · saved workout on home after refresh
- `npm test` and `npm run build` green before `shipped`
- Walk PRD R14–R21 acceptance criteria owned by this slice

## 12. Change log

| Date | Change |
|---|---|
| 2026-09-17 | Spec created from product interview (library size, illustrations, search, save/update templates, full edit, custom exercises). |
| 2026-09-17 | Shipped without illustrations (R16 deferred). 206 seed exercises; library, templates, custom exercises live. |
