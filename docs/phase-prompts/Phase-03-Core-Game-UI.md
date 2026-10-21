# Phase 03 — Core game UI and progression

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
Build a coherent, navigable game shell and the first progression loop using existing data or clearly identified mock data.

## Screens/features
- Dashboard/home
- World selection/map
- World overview
- Level or mission detail
- Lesson launch/learning screen
- Quiz summary/results
- Player profile/progress summary
- Quest/achievement panel
- Settings and help entry points

## Tasks
1. Implement only the screens needed for one complete journey; make navigation real.
2. Define typed models for worlds, levels, quests, rewards and player progress.
3. Clearly label seeded sample content as sample content in development data; do not present mocked functionality as connected or complete.
4. Connect XP/rewards to actual completed actions with deterministic rules and tests.
5. Persist MVP progress locally using the existing persistence mechanism; isolate persistence behind an adapter.
6. Include empty, locked, completed, failed and loading states where relevant.

## Acceptance criteria
- A user can move from dashboard to a world, open a level, complete a small activity and see progress update.
- Navigation and buttons work.
- Progress survives refresh where local persistence is intended.
- Mobile and desktop layouts work.
- No fake leaderboards or fake cloud-sync claims.
