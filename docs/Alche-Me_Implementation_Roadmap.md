# Alche-Me — Implementation Roadmap

## Execution rule
Complete phases in order unless repository inspection proves a phase is already implemented. If an existing feature is working, audit it, test it, and mark it complete rather than rebuilding it.

| Phase | Focus | Required outcome |
|---|---|---|
| 01 | Repository audit and foundation | Existing app understood, product renamed safely, baseline checks recorded |
| 02 | Design system and responsive shell | Consistent typography, spacing, tokens, navigation, accessible components |
| 03 | Core game UI and progression | Dashboard, world map, level view, quest UI, XP/achievements using mock data |
| 04 | Accounts and persistence | Guest/local play first; optional backend adapter and cloud-sync plan without locking the app to a vendor |
| 05 | Chemistry domain engine | Typed elements, atoms, molecules, equations, units, validation and reviewed content schema |
| 06 | Learning, quizzes and quests | Lessons, question types, mastery tracking, rewards, review flow |
| 07 | Virtual 3D laboratory | One complete, safe, interactive experiment with reproducible state and report |
| 08 | Molecule Studio | 2D/3D molecule building, bond validation, rotate/zoom, formula and basic property display |
| 09 | Engineering chemistry | Syllabus/manual mapping, validated practicals, lab records and calculations |
| 10 | Quality, accessibility and release | Performance, mobile/touch, error states, privacy/security, tests, documentation |
| 11 | Expansion | More worlds/experiments, daily quests, leaderboards, timed exam mode, multiplayer research |

## Phase gates
A phase is complete only when:
- The acceptance criteria in its prompt are met.
- The app starts and production build succeeds.
- Relevant tests pass or any failure is clearly explained.
- The feature is usable at desktop and mobile widths where applicable.
- No secrets are committed; no paid service is introduced silently.
- Documentation and progress tracker are updated.
- The agent lists what is implemented, what is mocked, what remains, and how to verify it.

## Priority principle
A polished, tested vertical slice is more valuable than many disconnected screens. Build one coherent path end-to-end before expanding content volume.
