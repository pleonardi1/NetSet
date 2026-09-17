# Spec 003 — Natural language workout assembly

| Field | Value |
|---|---|
| **Status** | `shipped` |
| **Owner** | Paul |
| **Started** | 2026-09-17 |
| **Done** | 2026-09-17 |
| **Strategy ref** | `PRD.md` § 4 (R22) |

> Describe a workout in plain English; OpenAI picks exercises from the library; preview and start. Next-set aim stays rule-based.

---

## 1. What ships when this is done

On home, **Build with AI** accepts a short description (equipment, time, body parts). The app calls OpenAI server-side, returns only exercise ids from the merged library, shows a preview list with title and note, then **Start this workout** opens a session. Set logging, PR, and next-set aim unchanged.

## 2. User stories

- **As a lifter**, when I walk in without a plan, I want to describe what I feel like doing so the app assembles a workout from the library without me searching exercise by exercise.
- **As a lifter**, when I see the suggested list, I want to review it before starting so I can swap or add once the session is open.

## 3. Surfaces

- Routes: `/` (Build with AI section)
- Components: `components/workout-assembler.tsx`
- Actions: `app/actions/assemble-workout.ts`
- Lib: `lib/openai.ts` · `lib/assemble-workout.ts` · `lib/store.ts` (`createAssembledSession`, `getSessionDisplayName`)
- Env: `OPENAI_API_KEY` (optional `OPENAI_BASE_URL` for campus gateway in `lib/openai.ts` only)

## 4. Done criteria

- [x] Home shows Build with AI input and button
- [x] WHEN user submits a valid description THE server SHALL return only catalog exercise ids
- [x] IF OpenAI key is missing THEN THE UI SHALL show a clear error without crashing
- [x] IF prompt is too short THEN THE UI SHALL reject before calling the API
- [x] WHEN user taps Start this workout THE session SHALL open with the proposed exercise list
- [x] Next-set aim still comes from `lib/` rules, not the model
- [x] `npm test` and `npm run build` succeed

## 5. Constraints (must NOT)

- Do not let the model invent weights, reps, or exercises outside the catalog
- Do not call OpenAI from client components
- Do not replace next-set aim calculation with LLM output
- Do not add `OPENAI_MODEL` env var — hardcode `gpt-4o-mini`

## 6. Out of scope

- Editing the proposal before start (swap/add after session opens)
- Saving AI assemblies as templates automatically
- Voice input

## 7. Dependencies

- **Blocking:** spec 002 (`shipped`) — exercise library
- **Blocking:** `OPENAI_API_KEY` in `.env` for live assembly

## 8. Open questions

| Question | Owner | Blocking? |
|---|---|---|
| n/a | — | — |

## 9. Architecture notes

- Client sends prompt + custom exercises from localStorage; server merges with seed catalog
- Model returns JSON; `lib/assemble-workout.ts` validates ids against allowlist
- Session uses `label` for display name; `session_type_id` = `type-ai-assembled`

## 10. Domain & quality guardrails

- `.cursor/rules/workshop.mdc` — OpenAI server-only, model hardcoded
- `DESIGN.md` — semantic tokens

## 11. Test plan

- `lib/assemble-workout.test.ts` — prompt validation, parse, allowlist
- `lib/store.test.ts` — assembled session label
- No live OpenAI calls in tests

## 12. Change log

| Date | Change |
|---|---|
| 2026-09-17 | Spec created and shipped. |
