# Alche-Me Project Kit — Read This First

## Product identity
- Official product name: **Alche-Me**
- Repository/package slug: `alche-me`
- Existing local folder may remain `Chemistry Quest` temporarily to avoid breaking paths. Rename it only after closing terminals/editors and updating any scripts or shortcuts that depend on the old path.
- Replace product-facing “Chemistry Quest” labels with “Alche-Me”; retain historical references only where needed in migration notes.

## How to use the files
1. Keep `Alche-Me_Master_Specification.md` as the source of truth.
2. Read `Alche-Me_Implementation_Roadmap.md` and `Alche-Me_Asset_Manifest.md`.
3. Give your coding agent the master spec and **only the current phase prompt** (plus any source code/syllabus/manual files relevant to that phase).
4. Ask the agent to inspect the existing repo before changing anything. Do not start from a blank scaffold if a working vertical slice already exists.
5. After each phase, run the app, tests, and production build; review the changes; commit or back up the working state before beginning the next phase.
6. Update `Alche-Me_Progress_Tracker.md` with evidence: changed files, commands run, test/build results, and known limitations.

## Important project constraints
- Build incrementally; never attempt all features in one giant code-generation pass.
- No in-game generative AI. Use curated, reviewed chemistry content.
- English first, with optional Hindi localization architecture.
- Single-player first; multiplayer is a later expansion.
- Free/near-zero-cost first. Do not add paid services without explaining the cost and getting approval.
- Verify engineering experiments against the actual supplied syllabus and lab manual. Do not claim complete syllabus coverage without a mapping table.
- Prefer optimized assets, procedural geometry, and reusable models over huge downloads.
- Preserve accessible keyboard/touch interactions and support desktop, tablet, and mobile.
