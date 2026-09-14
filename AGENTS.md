# AGENTS.md

## What this is

Static educational site (Digital Systems course, Indonesian university). Plain HTML/CSS/JS — no build tools, no bundler, no npm, no tests, no linter.

## How to run

Open `index.html` in a browser or serve locally:
```
python3 -m http.server 8000
```
CDN dependencies (Font Awesome, KaTeX) require a network connection.

## Architecture

Client-side SPA. No router library — navigation is handled by `js/navigation.js`:

- `js/curriculum-data.js` — syllabus data structure (`CURRICULUM_DATA` array). Only `week1` has `status: "active"`; all others are `"upcoming"`.
- `js/navigation.js` — sidebar rendering, routing (`loadRoute`), theme toggle, search. Calls `Week1Controller.init()` for active weeks.
- `js/week1.js` — Week 1 interactive module (conversion calculator, visualizer, quiz). 1600+ lines.
- `css/style.css` — global design system (CSS custom properties, dark/light theme via `data-theme`).
- `css/week1.css` — Week 1–specific styles.

## Adding a new week

1. Create `js/weekN.js` exporting a `WeekNController` object with an `init(container, submenuId)` method (follow `Week1Controller` pattern in `week1.js`).
2. Create `css/weekN.css` for week-specific styles.
3. Add `<link>` and `<script>` tags in `index.html`.
4. In `curriculum-data.js`, change the week's `status` from `"upcoming"` to `"active"`.
5. In `navigation.js:126-128`, add an `else if` branch for your week calling `WeekNController.init()`.

## Conventions

- UI text is in **Bahasa Indonesia**. Keep all user-facing strings in Indonesian.
- Theme is `dark` by default. Toggle stored in `localStorage` under key `sisdig_theme`.
- All JS is global-scope (no modules/bundler). Prefix week controllers with `WeekNController`.
- CSS uses custom properties defined in `:root` / `[data-theme="dark"]` / `[data-theme="light"]`. Prefer using those over hardcoded colors.
