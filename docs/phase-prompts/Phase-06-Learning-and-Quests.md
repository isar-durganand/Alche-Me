# Phase 06 — Learning, quizzes and quests

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
Create a reliable lesson-to-practice-to-feedback loop with curated educational content.

## Tasks
1. Define a versioned lesson/content schema with learning objectives, explanation, worked example, practice, misconception notes, and sources/review status.
2. Implement lesson sections, progress, quiz question types appropriate to the current slice, immediate feedback and end-of-lesson review.
3. Use deterministic scoring and XP rules; explain answers rather than only showing right/wrong.
4. Support optional Hindi localization without duplicating logic.
5. Add accessibility to diagrams and math/formula content; do not make color the only signal.
6. Add review/retake behavior and store mastery separately from cosmetic rewards.
7. Build one complete reviewed learning module before expanding to more chapters.

## Acceptance criteria
- One full learning module can be started, completed, reviewed and repeated.
- Quiz scoring and rewards are tested.
- Explanations and answer keys are curated and reviewed.
- Content is separated from presentation.
