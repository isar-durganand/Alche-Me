# Phase 08 — Molecule Studio

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
Build an interactive molecular construction and visualization feature with clear scientific limits.

## Tasks
1. Define molecule/atom/bond state and validation rules for supported atom types, valence, bond order and charge.
2. Implement a simple 2D builder or equivalent accessible editing mode, plus 3D view with rotate, zoom and reset.
3. Use procedural geometry for atoms and bonds where appropriate; distinguish element colors and bond types without relying on color alone.
4. Display molecular formula and supported structural information; show useful errors for invalid/incomplete structures.
5. Evaluate RDKit or another chemistry toolkit only after checking browser/server compatibility, licensing, bundle size and performance.
6. Clearly separate computed properties, lookup data and illustrative estimates. Do not promise accurate quantum calculations unless a suitable validated engine is actually integrated.
7. Include a few reviewed example molecules with source structure files and provenance.

## Acceptance criteria
- Users can build, edit, rotate and reset a supported molecule.
- Invalid structures produce understandable feedback.
- Formula and displayed connectivity agree with the internal model.
- Performance and accessibility are tested.
