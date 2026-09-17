# Apple (iOS-inspired)

Calm, native, and glanceable. White and soft gray surfaces, system blue for action, SF-style typography, generous rounding, almost no shadow. Should feel like a first-party Apple utility — Health, Fitness, or Reminders — not a generic SaaS dashboard.

`DESIGN.md` is the only look. To change it later, edit hex values here and in `app/globals.css` `:root` (for example `--primary`). Do not add a second design file.

## Apply (once)

After shadcn init, paste the token values from `themes/harbor.css` into the `:root { ... }` block in `app/globals.css`. Keep imports, `@theme`, and the base layer.

Tell Cursor: *Follow `DESIGN.md`. Use theme tokens only (`bg-primary`, `text-muted-foreground`, `bg-muted`). Do not hardcode colors.*

## Colors (iOS light mode)
- **Background (page):** `#F2F2F7` — grouped table gray
- **Surface / cards:** `#FFFFFF`
- **Text (primary):** `#1C1C1E`
- **Text (secondary / meta):** `#8E8E93`
- **Separator / border:** `#C6C6C8` at 50% opacity, or `#E5E5EA`
- **Tint / links / primary action:** `#007AFF` — system blue
- **Tint pressed:** `#0051D5`
- **On tint:** `#FFFFFF`
- **Success (PR, completed set):** `#34C759`
- **Destructive / error:** `#FF3B30`

## Type
- **Font stack:** `-apple-system`, `BlinkMacSystemFont`, `"SF Pro Text"`, `"SF Pro Display"`, `system-ui`, `sans-serif`
- **Large title (screen):** 34px, weight 700, tight tracking — e.g. exercise name
- **Title 2 (section):** 22px, weight 600
- **Body:** 17px, weight 400, line-height 1.35 — iOS default body size
- **Callout / aim hero:** 28–32px, weight 700, centered — the next-set line is the largest text on screen
- **Footnote / meta:** 13px, `#8E8E93`, uppercase labels sparingly (prefer sentence case)

## Shape and space
- **Radius:** 12px on cards and grouped rows; 10px on buttons and inputs; full pill (`9999px`) for small badges only
- **Shadow:** none on cards — use white surface on gray background + hairline separator instead
- **Page padding:** 16px horizontal on phone; 24px on wider screens
- **Section gap:** 24px between grouped blocks
- **Touch target:** minimum 44px height for buttons and tappable rows
- **Max content width:** 430px centered on desktop (phone-first); optional wider history views up to 720px

## Components
- **Nav:** large title pattern — screen title scrolls under a minimal top bar; back chevron + session name; no heavy chrome
- **Grouped list:** white rounded rectangle (`bg-card`) on gray page (`bg-muted` or custom grouped bg); rows separated by inset hairlines, not card-per-row shadows
- **Primary button:** filled system blue, white label, full width on phone, 50px height, semibold 17px
- **Secondary button:** gray fill `#E5E5EA` or plain text link in system blue — no outlined “SaaS” buttons unless destructive
- **Aim hero block:** white grouped card, centered callout number, optional `ⓘ` as a small blue text button — not a badge
- **Inputs (weight / reps):** large numeric fields, 17px+, light gray fill `#F2F2F7`, no heavy borders; blue focus ring
- **Set rows:** checkmark or green tint when logged; monospace optional for `120 × 10` alignment

## NextSet-specific
- **Hierarchy on the lift screen:** 1) next-set aim (largest), 2) log fields + Log set, 3) today’s sets, 4) last time + PR as secondary meta
- **Modular / calm:** one exercise per screen between sets; prev/next as simple chevrons, not tabs
- **Learning state:** soft yellow `#FFF9E6` banner with `#1C1C1E` text — not alarming red
- **Haptics:** optional later; design for thumb reach — primary action in lower half on phone

## Do
- System font, system blue, grouped lists, whitespace, big numbers for the aim
- Sentence case labels (“Last time”, not “LAST TIME”)
- Subtle separators instead of boxes inside boxes
- Prefill log fields from the aim — feels native, not form-heavy

## Don’t
- Inter, Geist, or “startup SaaS” Harbor blue (`#2563EB`)
- Drop shadows, gradients, glass blur, or neon
- Dark mode in v1 (light only until asked)
- Modals for logging a set
- More than one accent besides system blue (green/red only for success/error states)
