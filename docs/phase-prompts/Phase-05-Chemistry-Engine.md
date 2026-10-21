# Phase 05 — Chemistry domain engine

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
Build typed, testable chemistry data and validation foundations before creating large volumes of content.

## Tasks
1. Define typed structures for elements, isotopes if required, atoms, bonds, molecules, chemical equations, quantities, units, experiments and content provenance.
2. Include validated data for all 118 periodic-table elements, sourced from reliable licensed references. Store data in structured files, not hand-built images.
3. Record source, units, uncertainty/significant figures where relevant, and review status for scientific data.
4. Implement periodic-table search/filter and element detail views.
5. Add safe equation parsing/balancing only if scope and validation are clear; never silently accept incorrect chemistry.
6. Add unit conversion/calculation utilities with explicit units and tests.
7. Keep chemical-domain logic separate from UI components.
8. Document limitations; visual molecular geometry is not proof of quantum-chemical accuracy.

## Acceptance criteria
- All 118 element records are present and schema-validated.
- Search and element details work.
- Representative chemical calculations have unit tests and edge-case tests.
- Data provenance and license notes are included.
- No unreviewed generated chemistry data is presented as authoritative.
