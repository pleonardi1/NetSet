# Cursor pack

Copied into the app during bootstrap (`README.md` at the repo root). Do not copy this folder by hand unless bootstrap failed.

| File | The agent will always |
|------|------------------------|
| `rules/workshop.mdc` | Course stack, Harbor in `DESIGN.md`, seed JSON + localStorage, secrets in `.env`, OpenAI model `gpt-4o-mini` hardcoded, product rules in `lib/`, `npm test` then build |
| `rules/folders.mdc` | Where new files go. No `src/`. |
| `skills/spec-writing/` | One spec per slice (uses `specs/_template.md` already in the app) |
| `skills/session-handoff/` | Update `HANDOFF.md` at wrap |
| `skills/pre-build-review/` | Optional second opinion on a PRD or spec before the next build |
| `skills/product-interview/` | Product or feature interview — writes `PRD.md` or a spec; does not build |
| `skills/writing-tests/` | After a slice works: tests for `lib/` + the screen cases that slice owns; `npm test` then build |
