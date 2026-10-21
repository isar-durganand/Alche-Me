# Phase 02 — Design system and responsive shell

## Mandatory working rules
- Read `docs/Alche-Me_Master_Specification.md` first and treat it as the source of truth.
- Inspect the current repository and existing vertical slice before editing. Preserve working functionality; do not overwrite the project with a new scaffold.
- The product is named **Alche-Me**. Update user-facing names and metadata safely; do not break the local path merely to rename a folder.
- Use the current stack and conventions already present unless you can justify a necessary change. Prefer React + TypeScript + Vite + Tailwind CSS and existing test tooling if already configured.
- No in-game generative AI. Chemistry explanations and answers must be curated/reviewed.
- English first; make text localization-ready for optional Hindi.
- Single-player first. Do not implement multiplayer in early phases.
- Free/near-zero-cost first. Never introduce a paid service, paid API, or mandatory subscription without documenting the cost and asking for approval.
- Do not fabricate chemistry facts or claim syllabus coverage without checking supplied source material.
- Make responsive, keyboard-accessible and touch-friendly UI. Include loading, empty, error, and success states.
- Keep components modular, typed, reusable and testable. Avoid giant single-file implementations and unnecessary dependencies.
- Run relevant tests and a production build. Report exact commands and outcomes honestly.
- Update `docs/Alche-Me_Progress_Tracker.md` and relevant documentation.
- At the end, report: summary, files changed, commands run, test/build results, known limitations, manual verification steps, and next phase.


## Objective
Create a premium, coherent, science-focused visual foundation without generic gradient-heavy AI styling.

## Tasks
1. Audit current UI and preserve successful visual work.
2. Establish design tokens for color, typography, spacing, radii, borders, elevation, focus states, animation and breakpoints.
3. Use restrained surfaces, clear hierarchy, purposeful contrast, polished typography and subtle motion. Do not rely on gradients as the primary visual identity.
4. Build reusable buttons, cards, tabs, dialogs, tooltips, progress indicators, badges, form controls, toast/alert patterns and skeletons only as needed.
5. Create responsive app shell with navigation appropriate for desktop, tablet and mobile.
6. Support reduced motion, keyboard focus, touch targets, semantic landmarks and sufficient contrast.
7. Add design reference files to `docs/design-references/` only if supplied or created. Do not invent file paths for missing designs.

## Acceptance criteria
- Shared tokens/components are used by at least two real screens.
- Layout is usable at narrow mobile, tablet and desktop widths.
- Interactive controls have focus/hover/pressed/disabled states.
- No broken asset references or decorative controls that do nothing.
- Tests/build pass and tracker is updated.
