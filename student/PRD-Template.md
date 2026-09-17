# PRD — [Your Product Name]

**Author:** [name]  ·  **Date:** [YYYY-MM-DD]  ·  **Version:** 0.1

> **How to fill this file**
> - Fill in **sections 1–4** (required). Sections **5–8** are optional but make the agent far more accurate.
> - Keep it to about **one page**. Use bullets and tables, not paragraphs — agents parse structure better than prose.
> - **Be specific and measurable.** Replace vague words ("nice", "intuitive", "fast") with numbers and observable behavior.
> - **Every requirement gets an acceptance criterion** you can click or type and see — not "it works" or "no console errors."
> - **At least one P0 covers an unexpected case:** empty / first-visit state, blank or bad input, or refresh (the item you just added is still there).
> - Mark anything you're guessing with **`[ASSUMPTION]`** — don't invent facts or numbers.
> - When you are ready to build, tell Cursor:
>   *"Read `PRD.md` and `DESIGN.md`. Follow the workshop rule. Seed from local JSON in `data/`; put new items in localStorage. No database or API keys yet. Do not write a JSON file on the server. Ask me any clarifying questions first, then build the smallest working version of the P0 must-haves in section 4, following the build order."*
>
> *Sections map to the **Lean Product Process**: target customer → underserved needs → value → MVP feature set.*

---

## 1. Product Summary
*What is it, who is it for, and what does it help them do?*

- **One-liner:** For _[target customer]_ who _[need]_, **[product]** is a _[category]_ that _[key benefit]_.
- **TL;DR (2–4 sentences):** What we're building, for whom, and what counts as success.

## 2. Target Customer  *(Lean Product Process: Target Customer)*
*Describe the person. Separate the **buyer / relationship owner** from the **user** if they differ.*

- **User:**
- **Buyer / decision-maker (if different):**
- **Top 3–5 defining attributes** (demographic, psychographic, behavioral, needs):
  1.
  2.
  3.

## 3. Customer Problems & the Bet  *(Lean Product Process: Underserved Needs → Value)*
*List the top problems, ideally as a real quote in the customer's own words.*

1. "…"
2. "…"
3. "…"

- **Riskiest assumption** (if this is wrong, the idea fails):
  > …
- **The bet (falsifiable):** We believe _[building this]_ will cause _[outcome]_ for _[user]_. **We'll know we're right if _[observable signal / number]_.**

## 4. Product Requirements / Functionality  *(Lean Product Process: MVP Feature Set)*

**Key user stories** — *As a [user], I want [action] so that [outcome].*
- As a …, I want … so that …
- As a …, I want … so that …

**Must-haves for v1** — number them, set a priority, and give each a checkable acceptance criterion (a click-and-see result, not "it works"):

| ID | Requirement | Priority | Acceptance criterion (observable / measurable) |
|----|-------------|----------|------------------------------------------------|
| R1 |  | P0 | e.g., "Submit a new item → it appears in the list within 2s and is still there after refresh." |
| R2 |  | P0 | e.g., "Submit with the main field blank → an inline message; no new item is created." |
| R3 |  | P1 | e.g., "With no items yet, the list shows a short empty-state message — never a blank page." |

*(P0 = must ship for v1 · P1 = should · P2 = nice-to-have.)*

**Build order** (agents do best in sequence): 1) seed JSON in `data/` + localStorage for new items →  2) core action →  3) UI →  4) extras. Do not add a database, third-party APIs, or OpenAI unless a requirement above needs them.

**Explicitly NOT in v1 (non-goals):**
- …
- …

**Do NOT change / keep working** (fill in only when iterating on an existing build):
- …

## 5. Data Model *(optional)*
*What objects/records must the app store, with key fields and how they relate? These names are the JSON now and the Neon table later — keep them stable.*

**Persistence (every project, until Neon):** seed samples in `data/[object].json` · new items in localStorage · do not write a JSON file on the server (that breaks on Vercel) · same field names when Neon is added later.

- **[Object]** — fields: … · seed in `data/[object].json` · relates to: …
- **[Object]** — fields: … · seed in `data/[object].json` · relates to: …

## 6. Guidance on User Experience *(optional)*
- **Main user flow** (4–7 steps, first visit → core value): 1 → 2 → 3 …
- **Error / empty states:** *e.g., "show an inline message with a retry button; never a blank screen."*
- **Visual aesthetic:** Follow `DESIGN.md` (the look you copied into the app). Do not name a palette here.

## 7. Guidance on Tech Stack / Components *(optional)*
*Pick the product. The project rule already locks the stack, secrets, and scope. Add only don'ts that are about **this** product.*

- **Course default:** Next.js + React + Tailwind + shadcn/ui, deploy on Vercel. Seed from local JSON in `data/`; new items in localStorage. When OpenAI is in the PRD: only `OPENAI_API_KEY` in `.env`; hardcode model `gpt-4o-mini` in code.
- **My preferences / must-use:**
- **Must-avoid** (product-specific): *e.g., "no modals for the main action," "no paid third-party APIs."*

## 8. Other Info & Open Questions *(optional)*
- **Constraints / deadlines:**
- **Products I admire (as references):**
- **Open questions to resolve:** *(mark guesses with `[ASSUMPTION]`)*
