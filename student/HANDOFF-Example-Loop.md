# Loop — Handoff

> **How a new AI uses this file.** Open a fresh chat and paste:
>
> *Read `HANDOFF.md` first. Follow the reading order in § 3. Then do the Next session pickup — do not rebuild anything already shipped.*
>
> The new agent should skip the already-built submit form and dashboard, leave Neon alone, and start spec 003 (OpenAI theme + sentiment tagging). That is the point of the handoff: five minutes of reading instead of twenty minutes of re-deriving.

> **Snapshot date:** 2026-08-19 (live URL + translation API landed)
> **Next session pickup:** Spec 003 — add OpenAI theme + sentiment tagging on submit; keep the existing form and dashboard; if the model call fails, save the item as Untagged.

> This is the living state snapshot. A fresh agent (or you, next week) reads it
> first and re-orients in five minutes instead of re-deriving state. **Sections
> 1–3, 6, 11, 12 are contracts — they rarely move. Sections 4, 5, 8 are state —
> updated every wrap.**

---

## 1. What this is (60 seconds)

**Loop** — a feedback board that auto-organizes customer comments by theme and sentiment.

- **Product:** Anyone on a CX / product team pastes a piece of customer feedback. Loop tags it with one theme and one sentiment, then ranks themes on a dashboard so a manager can name the top 3 pain points in under a minute.
- **Stack:** Next.js (App Router) · React · TypeScript · Tailwind · shadcn/ui · look in `DESIGN.md` (this example assumes Harbor) · Vercel · seed JSON in `data/` + localStorage · MyMemory (translation) · OpenAI and Neon come later.
- **Architectural rule (load-bearing):** Feedback records live in `data/feedback.json` (seed) and localStorage (user-created). Field names stay stable when Neon is added later. Do not invent a second store or rename fields.

## 2. Non-negotiable rules

| Rule file | Enforces |
|---|---|
| `.cursor/rules/workshop.mdc` | Stack, seed-JSON-first data, secrets stay in `.env`, server-side API calls, build only what `PRD.md` asks |
| `PRD.md` | Scope contract — P0s, non-goals, fixed 7-theme list, no modal for add-feedback |
| `DESIGN.md` | Look & feel — theme tokens in `app/globals.css`; do not invent a new palette |

## 3. Reading order for a fresh agent

1. This file.
2. `.cursor/rules/workshop.mdc` — the course rails.
3. `PRD.md` — the product contract (especially § 4 must-haves and non-goals).
4. `DESIGN.md` — the chosen look.
5. `specs/README.md` — what has shipped vs. what is next.
6. `data/feedback.json` — the record shape. Do not change field names.

## 4. Current state of the work — *updated each wrap*

- Specs: **2 shipped · 0 building · 2 planned**.
- **001** Feedback submit + list — **shipped.** Form (text + optional customer name) writes to localStorage; 8 seed items load from `data/feedback.json`; empty state copy is in place.
- **002** Theme dashboard — **shipped.** Themes ranked by volume with % negative; counts match the list. No filters yet (that's P1).
- **003** OpenAI theme + sentiment tagging — **planned.** Do not start until the OpenAI key is in `.env`.
- **004** Filters + manual tag override — **planned.** After 003.

- **Also landed (not a numbered spec):** live Vercel URL; MyMemory translation on submit (original + English on the card). Keys/config in `.env`. Server Action only — never the browser.

- **Recent audit (2026-08-19):** `npm test` green. Core loop works on the live URL: add a comment → it appears in the list → dashboard counts update. Translation works on a Spanish sample. AI tagging is still fake — seed items already have `theme` and `sentiment`; new items are saved as Untagged. Do not add Neon. Do not add auth.

## 5. What's active / what's next — *updated each wrap*

- **The long pole:** Spec 003 — real OpenAI tagging on submit, with Untagged fallback if the call fails.
- **Queue after it:** Spec 004 (filter by theme + sentiment; edit a wrong tag). Neon only if the student still has time and wants the board to persist across devices.

## 6. Key file locations

- Rails: `.cursor/rules/workshop.mdc`  ·  Product: `PRD.md`  ·  Look: `DESIGN.md`
- Specs: `specs/`
- Seed data: `data/feedback.json`
- Submit + list: `app/page.tsx`  ·  Dashboard: `app/dashboard/page.tsx`
- Translation: `app/actions/translate.ts` (MyMemory, server-side)
- Tagging (not built yet): will live next to that action, not in a client component

## 7. Architecture notes (don't change without understanding)

- **No modal for add-feedback.** `PRD.md` forbids it — use the inline panel already on the home page.
- **Theme list is fixed:** Pricing · Onboarding · Performance · Bug · Feature Request · Support · Other. Do not let the model invent a new theme.
- **Sentiment is three levels:** positive / neutral / negative. Not a 1–5 score.
- **A missing database must not crash the build.** If `DATABASE_URL` / `POSTGRES_URL` are unset, keep using seed JSON + localStorage.

## 8. Open external actions (only the human can do these)

- [x] GitHub repo + Vercel deploy
- [x] MyMemory config in `.env` (`MYMEMORY_EMAIL`)
- [ ] OpenAI API key in local `.env` **and** the Vercel project (confirm before starting spec 003). Model stays hardcoded as `gpt-4o-mini` — not an env var.
- [ ] Neon (optional — only if they still want shared persistence)

## 9. Things that are easy to get wrong (append-only, one line each)

- Writing new feedback to a JSON file on the server looks fine locally and goes empty on Vercel — use localStorage until Neon exists.
- Calling MyMemory from a client component hits CORS and leaks the habit we need for OpenAI — keep every third-party call in a Server Action.
- When OpenAI is added: only `OPENAI_API_KEY` in `.env`; hardcode model `gpt-4o-mini` in `lib/openai.ts` — do not put the model in env.
- A missing `DATABASE_URL` at build time will take down the first page if anyone adds a database import too early — never throw when the env var is absent.
- Product rules that live only in a page or `useEffect` skip the coverage floor — put them in `lib/`.

## 10. Operating commands

```bash
npm run dev      # start the local app
npm test         # Vitest + lib/ coverage floor
npm run build    # production build (dev stopped first)
npm run lint     # lint
```

## 11. Source-of-truth precedence (when two artifacts disagree)

1. `.cursor/rules/workshop.mdc`
2. `PRD.md`
3. The relevant spec
4. The code
5. **This handoff** — *last*. If it contradicts anything above, the handoff is wrong; fix it to match the higher source.

## 12. The human, in brief

- Business / MBA student, not an engineer. Prefer a short plan, then a small change, then a check that the page still loads.
- Ask before adding pages, libraries, auth, or a database.
- Never commit `.env`. Never put a key in client code.

## 13. Change log

| Date | Change |
|---|---|
| 2026-08-19 | Snapshot after submit + dashboard + live URL + MyMemory. Specs 001 and 002 shipped. Next: spec 003. |
