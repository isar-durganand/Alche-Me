# Phase 09 — Engineering chemistry

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
Add engineering chemistry content and practicals through traceable syllabus mapping, not assumptions.

## Tasks
1. Inspect all supplied engineering chemistry syllabus and lab-manual files.
2. Create a mapping table: source file/page, prescribed topic/experiment, prerequisites, app module, calculation/report requirements, status and reviewer.
3. Preserve official terminology while making explanations student-friendly.
4. Implement practicals in small batches, each with a theory section, apparatus, procedure simulation, observations, calculations, result, viva questions and safety notes as appropriate.
5. Verify all formulas, units, constants, endpoint rules, significant figures and expected result ranges against the source.
6. Distinguish simulated observations from real experimental data.
7. Identify missing/ambiguous source material rather than inventing details.

## Acceptance criteria
- Mapping table covers every supplied syllabus item and prescribed experiment.
- Each implemented practical has tests and source traceability.
- Completion claims distinguish implemented, planned and blocked items.
- Lab reports can be reviewed and repeated.
