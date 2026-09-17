# Spec 001 — Feedback submit and list

| Field | Value |
|---|---|
| **Status** | `shipped` |
| **Owner** | Workshop example |
| **Started** | 2026-08-16 |
| **Done** | 2026-08-16 |
| **Strategy ref** | `PRD.md` § 4 R1 · build order step 1 |

> A CX specialist pastes feedback, sees it in the list, and it is still
> there after a refresh. The board looks populated on first run.

---

## 1. What ships when this is done

The home page is a feedback board. Eight seed comments load from
`data/feedback.json`. A visitor pastes text (and an optional customer
name) into an inline panel — not a modal — and submits. The new item
appears in the list within two seconds and survives a refresh. An empty
board (seed hidden or cleared) shows "No feedback yet — add your first
item." New items are **Untagged** until a later spec adds AI.

## 2. User stories

- **As a CX specialist**, when I paste a comment and submit, I need it
  on the board within two seconds so I know it was captured.
- **As a CX specialist**, when I refresh the page, I need my new items
  still there so I trust the board is not a demo that wipes itself.
- **As a first-time visitor**, when the list has no items, I need a
  clear empty state so I know what to do next.

## 3. Surfaces

- Routes: `/` (`app/page.tsx`)
- Components: `components/feedback-form.tsx`, `components/feedback-list.tsx`
- Seed: `data/feedback.json` (8–10 records; fields from `PRD.md` § 5)
- Lib: `lib/feedback-store.ts` — merge seed + localStorage
- Actions / API: n/a — client-only this slice
- Env vars: n/a

## 4. Done criteria

- [x] `data/feedback.json` has 8–10 records with `id`, `text`,
      `customer_name` (optional), `theme`, `sentiment`, `created_at`.
      Field names match `PRD.md` § 5.
- [x] Loading `/` shows the seed items on a first visit (no API key required).
- [x] WHEN I submit text (and optional name) THE board SHALL show the
      new item in the list within 2 seconds.
- [x] WHEN I refresh THE board SHALL still show items I submitted
      (localStorage). Seed items still appear.
- [x] IF the merged list is empty THEN THE board SHALL show
      "No feedback yet — add your first item."
- [x] IF submit is pressed with empty text THEN THE form SHALL show an
      inline error and SHALL NOT create a record.
- [x] New items save as theme `Untagged` and a sentiment of `neutral`
      (or equivalent). No OpenAI call.
- [x] Add-feedback is an inline panel or page. No modal.
- [x] No JSON file is written on the server. No database. No OpenAI key required.
- [x] `npm test` succeeds (`lib/` coverage floor).
- [x] `npm run build` succeeds.

## 5. Constraints (must NOT)

- Do not add OpenAI, Neon, or require a filled `.env` key.
- Do not write `data/feedback.json` from the server.
- Do not add a modal for add-feedback (`PRD.md` § 7).
- Do not invent a theme beyond the fixed seven — new items are Untagged.
- Do not add `/dashboard`, filters, or auth.
- Do not use `src/`. Follow `DESIGN.md` and
  `.cursor/rules/workshop.mdc`.

## 6. Out of scope (for this spec)

- Theme dashboard — spec `002-theme-dashboard` (future)
- AI theme + sentiment tagging — spec `003-openai-tagging` (future)
- Filters and manual tag override — spec `004-filters-and-overrides` (future)
- Sign-in — `PRD.md` R6, P2, will not build in the first pass
- Neon — later, same field names

## 7. Dependencies

- **Blocking:** n/a — first slice
- **Nice-to-have:** `DESIGN.md` already copied into the app

## 8. Open questions

| Question | Owner | Blocking? |
|---|---|---|
| n/a — no open questions | — | — |

## 9. Architecture notes

- **One store path.** Seed JSON on disk; user-created records in
  localStorage; merge at render. Field names stay stable when Neon
  replaces localStorage later.
- **No second store.** Do not add `lib/db.ts`, a memory cache, or a
  server JSON write.
- **Tagging is a later writer.** This slice may store `theme` /
  `sentiment` on the record. It must not call a model.

## 10. Domain & quality guardrails

- Stack and secrets: `.cursor/rules/workshop.mdc` — no keys this slice
- Folders: `.cursor/rules/folders.mdc` — `app/`, `components/`, `lib/`, `data/`
- Look: `DESIGN.md` — do not invent a palette
- Copy: empty-state sentence is the one in `PRD.md` § 6

## 11. Test plan

- `npm test` succeeds — `lib/feedback-store` (seed, add, merge, reload, empty) · reject blank text · empty-state copy
- Screen cases: first visit shows seed · blank submit · add an item, refresh, confirm it stays
- `npm run build` succeeds
- Narrow the window to ~390px; form and list still usable

## 12. Change log

| Date | Change |
|---|---|
| 2026-08-16 | Spec created and shipped as the Loop example. |
