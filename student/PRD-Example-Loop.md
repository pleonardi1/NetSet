# PRD — Loop

**Author:** Workshop example  ·  **Date:** 2026-08-16  ·  **Version:** 1.0

> **Worked example — read this to see what "good" looks like, or use it as your backup project.**
> This is a complete PRD written against the workshop template. If you don't have your own idea, copy this into your project as `PRD.md` (look stays `DESIGN.md` / Harbor), and tell Cursor:
> *"Read `PRD.md` and `DESIGN.md`. Follow the workshop rule. Seed from local JSON in `data/`; put new items in localStorage. No database or API keys yet. Do not write a JSON file on the server. Ask me any clarifying questions first, then build the smallest working version of the P0 must-haves in section 4, following the build order."*

---

## 1. Product Summary
- **One-liner:** For product and CX teams who drown in scattered customer feedback, **Loop** is a simple feedback board that auto-organizes every comment by theme and sentiment so the team can see what to fix first.
- **TL;DR:** Anyone on the team pastes a piece of customer feedback into a form. Loop uses an AI model to tag each submission with a **theme** (e.g., Pricing, Onboarding, Bug) and a **sentiment** (positive / neutral / negative). A dashboard ranks themes by volume and flags the most negative areas. **Success = a CX manager can identify the top 3 pain points in under a minute without reading every comment.**

## 2. Target Customer  *(Lean Product Process: Target Customer)*
- **User:** A customer-experience specialist or product manager at a small SaaS company who receives feedback from many channels.
- **Buyer / decision-maker:** Head of Product or VP of Customer Experience who owns the feedback process.
- **Top defining attributes:**
  1. Works at a 20–200-person SaaS company *(firmographic)*.
  2. Receives ~20–200 pieces of feedback per week across email, calls, and surveys *(behavioral)*.
  3. Today uses a spreadsheet or shared inbox; has no dedicated tool *(behavioral)*.
  4. Cares about prioritization and evidence, not vanity metrics *(psychographic / needs)*.
  5. Not technical — wants something that "just works" *(needs)*.

## 3. Customer Problems & the Bet  *(Lean Product Process: Underserved Needs → Value)*
1. "Feedback comes in from five places and I paste it into a spreadsheet I never look at again."
2. "By the time I've read everything, I've forgotten what the big themes were."
3. "My exec asks 'what are customers complaining about?' and I don't have a fast, honest answer."

- **Riskiest assumption:** CX managers will trust AI-generated theme/sentiment tags enough to act on them, instead of insisting on reading every comment themselves.
- **The bet (falsifiable):** We believe that auto-tagging feedback by theme and sentiment will let a busy CX manager find the top pain points fast. **We'll know we're right if** a test user names the top 3 themes in **under 60 seconds** and agrees the tags are mostly right (**≥ 8 of 10** items correctly tagged).

## 4. Product Requirements / Functionality  *(Lean Product Process: MVP Feature Set)*

**Key user stories**
- As a CX specialist, I want to paste a piece of feedback and submit it so that it's captured in one place.
- As a CX specialist, I want each submission auto-tagged with a theme and sentiment so that I don't categorize by hand.
- As a product manager, I want a dashboard of themes ranked by volume and sentiment so that I can decide what to fix first.

**Must-haves for v1**

| ID | Requirement | Priority | Acceptance criterion (observable / measurable) |
|----|-------------|----------|------------------------------------------------|
| R1 | Submit feedback via a form (text + optional customer name) | P0 | A submitted item appears in the list within 2s and is still there after a page refresh. |
| R2 | Auto-tag each submission with one theme + one sentiment using AI | P0 | For 10 sample items, ≥ 8 get a theme a human agrees with; every item has a sentiment. |
| R3 | Dashboard: themes ranked by count, with % negative | P0 | Top themes are sorted by volume; the numbers match the underlying items. |
| R4 | Filter the feedback list by theme and sentiment | P1 | Selecting "Pricing" + "Negative" shows only matching items. |
| R5 | Edit / override a tag when the AI is wrong | P1 | Changing an item's theme updates the dashboard counts immediately. |
| R6 | Simple sign-in so only my team sees the board | P2 | A signed-out visitor cannot see any feedback. |

**Build order:** 1) `data/feedback.json` + submit/list (new items in localStorage) →  2) dashboard from that data →  3) AI tagging on submit →  4) filters, overrides. Do not add a database or OpenAI in the first build.

**Explicitly NOT in v1 (non-goals):**
- No automatic import from email / Zendesk / surveys — paste or manual entry only.
- No multiple workspaces, teams, or user roles.
- No trend-over-time charts.
- No native mobile app (responsive web is fine).

**Do NOT change / keep working:** *(empty — this is the first build.)*

## 5. Data Model
- **Feedback** — seed in `data/feedback.json` (8–10 pre-tagged samples). New items go in localStorage until Neon. Do not write the JSON file on the server. Fields: `id`, `text`, `customer_name` (optional), `source` (optional), `theme`, `sentiment`, `created_at`. Relates to: none in v1. Same field names become the Neon table later.
- **Theme set (fixed in code for v1):** Pricing · Onboarding · Performance · Bug · Feature Request · Support · Other.
- **Example record:** `{ "id": "1", "text": "I got lost during signup and never finished.", "customer_name": "Ava", "theme": "Onboarding", "sentiment": "negative", "created_at": "2026-08-01T12:00:00Z" }`

## 6. Guidance on User Experience
- **Main user flow:** 1) open the board → 2) click **Add feedback** → 3) paste text and submit → 4) the item appears, already tagged → 5) open the **Dashboard** → 6) click a theme to see its items.
- **Error / empty states:** An empty board shows "No feedback yet — add your first item." If AI tagging fails, save the item as **Untagged** and let the user tag it manually — never lose a submission.
- **Visual aesthetic:** Follow `DESIGN.md` (this example assumes Harbor).

## 7. Guidance on Tech Stack / Components
- **Stack:** Next.js + React + Tailwind CSS + shadcn/ui; seed from `data/feedback.json`, new items in localStorage; deploy on **Vercel**. Add OpenAI only when tagging is in scope; add Neon only when shared persistence is in scope.
- **Must-use:** When keys exist, keep only `OPENAI_API_KEY` (and later `DATABASE_URL`) in `.env` — never in client-side code, never committed to GitHub. Hardcode the OpenAI model as `gpt-4o-mini` in `lib/openai.ts` — do not put the model in `.env`.
- **Must-avoid (product-specific):** No paid third-party feedback APIs. No modal dialog for adding feedback — use a simple inline panel or a dedicated page.

## 8. Other Info & Open Questions
- **Constraints:** Build within workshop time; keep the theme list short and fixed for v1.
- **Products I admire (references):** Canny, Linear's triage view, a clean Notion database.
- **Open questions:**
  - `[ASSUMPTION]` A fixed 7-theme list is enough for v1 — validate with one real user's feedback.
  - `[UNCERTAIN]` Should sentiment be 3 levels (pos/neutral/neg) or a 1–5 score? Start with 3 levels.
