# Alche-Me — Master Product, UX, Architecture & AI Coding Agent Specification

> **Document type:** Master product requirements + implementation prompt  
> **Project:** Alche-Me (formerly referenced as Chemistry Quest during early prototyping)  
> **Audience:** AI coding agents, senior engineers, game/UI designers, chemistry-content authors, QA  
> **Status:** Build-ready specification; verify source syllabus/manual files before claiming exact curriculum coverage  
> **Primary objective:** Build a polished, scientifically responsible, responsive chemistry-learning adventure with multiple explorable worlds, progressive levels, a virtual 3D lab, a complete periodic table, and a chemistry-aware 3D molecule builder/viewer.

---

## 0. Instructions to the coding agent

You are the lead product engineer, senior game systems designer, UX architect, frontend/backend engineer, 3D interaction engineer, and QA lead for Alche-Me. Work as if delivering a premium, maintainable educational game—not a throwaway demo. Note: Historical references to Chemistry Quest or HomoLumo in discussion logs refer to the initial prototype vertical slice. The official product and package identity is **Alche-Me** (`alche-me`).

### Mandatory working rules

1. **Inspect before changing.** Inspect the existing repository, its `README`, project brief, roadmap, curriculum references, lab manual, package manager, source files, and current Git state. Do not overwrite existing work blindly.
2. **Use the provided references as the source of truth.** Find the user's uploaded engineering chemistry syllabus and lab manual. Extract every prescribed experiment title, procedure, reagent, apparatus, formula, observation table, calculation, safety note, and assessment requirement. Build a traceability matrix linking each source requirement to a screen, domain module, content record, and test. Never invent an experiment and claim it is from the manual.
3. **Preserve existing decisions when sensible.** The known proposed stack is React 18 + TypeScript + Vite + Tailwind CSS + Vitest. Inspect installed versions and current architecture first. Prefer minimal, justified changes over a blind rewrite.
4. **Deliver a working vertical slice before broad expansion.** The first slice must be genuinely interactive and testable. Do not create dozens of non-functional screens or pretend buttons work.
5. **No fake functionality.** No dead buttons, placeholder pages, fabricated results, simulated “cloud save” presented as real cloud persistence, fake sign-in, invented source data, or success toasts before success occurs. If a feature is not implemented, mark it clearly as unavailable/in development and explain why.
6. **Scientific integrity is a release requirement.** Separate measured/reference values, approximations, educational simulations, and computed values. State the method and limitations for computational chemistry results. Add unit tests for chemistry calculations.
7. **Keep costs near zero at the start.** Prefer open-source libraries, local development, free-tier services, and static hosting where suitable. Do not introduce a paid dependency, paid API, or vendor lock-in without explaining why and obtaining approval.
8. **Explain beginner-relevant setup clearly.** The project owner is a beginner. Provide exact commands, paths, environment variable names, setup steps, test commands, and troubleshooting in the README. Never ask the user to paste secret keys into source code or chat.
9. **Use accessible, responsive interaction.** Support mouse, keyboard, touch, reduced motion, readable scientific notation, and lower-performance devices.
10. **Finish the task with evidence.** Run available lint, typecheck, unit tests, and production build. Report commands run and actual outcomes. Do not claim checks passed if they were not run.

### Execution protocol

- First: inspect repository and source references.
- Second: summarize existing architecture and identify gaps.
- Third: propose a small implementation plan based on the actual repository.
- Fourth: implement the vertical slice in coherent increments.
- Fifth: run tests/build and fix issues.
- Sixth: update documentation and provide a final implementation report.
- If a necessary reference file is not available, search the project/library for it, document the gap, and continue with clearly labelled general chemistry content rather than inventing the missing source.

---

## 1. Product vision

Chemistry Quest (now Alche-Me) is an adventure-style learning game that helps learners progress from foundational chemistry to school/competitive-exam chemistry, engineering chemistry, practical laboratory skills, molecular modelling, and selected computational chemistry concepts.

It combines:

- A navigable collection of chemistry worlds.
- Levels, missions, story briefs, challenges, boss assessments, mastery and rewards.
- Structured lessons, worked examples, quizzes, numerical problems and exam simulations.
- A realistic, interactive virtual chemistry laboratory.
- A full 118-element periodic table with searchable element data.
- A chemistry-aware molecule builder and 2D/3D molecular viewer using RDKit-supported workflows.
- Lab notebook, observation tables, calculations, plots, reports and viva questions.
- Progress tracking, optional account/cloud sync, accessibility, and mobile/tablet/desktop support.
- Curated content rather than an in-game generative AI dependency.

### Product principles

1. **Learning before spectacle:** graphics help learners understand chemistry; they must not obscure it.
2. **Interaction over passive watching:** players manipulate apparatus, molecules, data, and models.
3. **Accurate before impressive:** all formulas, units, structures, calculations, and lab steps must be reviewed.
4. **Explain failure:** wrong answers and invalid actions give useful feedback.
5. **Mastery over grinding:** unlocks are earned through understanding and safe procedure, not repetitive clicks.
6. **One coherent product:** navigation, interaction patterns, typography, controls, and saved state remain consistent.
7. **Progressive enhancement:** a 2D/fallback experience remains usable when WebGL, worker support, or high-end hardware is unavailable.
8. **Respect privacy:** collect the minimum data needed; no public profile by default for minors.
9. **Honest simulation:** a virtual experiment models selected principles; it is not equivalent to real laboratory training.
10. **Expandable content:** worlds, lessons, levels, elements, molecules and experiments should be data-driven rather than hard-coded into UI components.

---

## 2. Audience and learning modes

### Audience groups

- **Foundations:** first-time learners, introductory school chemistry.
- **School chemistry:** concepts, equations, reactions, periodic trends, bonding, organic and physical chemistry.
- **JEE/competitive exam preparation:** concept practice, multi-step numericals, timed sections, review of weak areas.
- **Engineering chemistry:** water technology, analytical chemistry, materials, electrochemistry, corrosion, lubricants, spectroscopy and course-specific topics.
- **Laboratory learners:** apparatus identification, procedural sequence, measurements, calculations, safety and reports.
- **Molecular modelling learners:** structures, conformers, geometry, descriptors and selected computational workflows.

### Learning modes

1. **Adventure mode:** story-driven world/level progression.
2. **Curriculum mode:** browse all topics and follow a structured course.
3. **Practice mode:** untimed questions by topic and difficulty.
4. **Exam mode:** timed tests, question navigator, scoring and review.
5. **Virtual lab mode:** choose an experiment and work through a procedure.
6. **Molecule Studio:** create, inspect and save molecules.
7. **Periodic Table Explorer:** investigate all 118 elements.
8. **Revision mode:** flashcards, mistakes, spaced repetition and mastery review.
9. **Reference mode:** formulas, constants, glossary and curated notes.

Users must be able to reach required course topics directly without being forced to finish the story.

---

## 3. Visual identity and art direction

### Overall look

Premium, restrained, realistic scientific adventure. Use dark graphite/navy surfaces, neutral grey borders, white/off-white text, and limited cyan/blue accents for focus and interactive state. Use semantic colours only where meaningful (e.g. safety warning, success, error, chemical element category). Avoid gratuitous gradients, neon glow, glassmorphism everywhere, generic AI-generated dashboard styling, noisy backgrounds, excessive rounded cards, and visual clutter.

### Design principles

- Strong hierarchy and comfortable spacing.
- Clear typography with excellent readability at common laptop resolutions.
- Scientific content should have high contrast and uncluttered diagrams.
- Keep large 3D viewports visually dominant where they are the task.
- Use subtle shadows only when they improve layering.
- Motion is purposeful, short, and interruptible.
- Provide “reduce motion” and low graphics settings.
- Distinguish game reward colour from scientific data colour.
- Use consistent iconography and labels; never rely on colour alone.
- Avoid tiny controls and dense panels on touch screens.
- Never bake important UI text into generated background art. Render UI text in the application.
- Keep environmental concept art separate from actual interactive 3D models.

### Design tokens (initial values; validate in browser)

```css
:root {
  color-scheme: dark;
  --cq-bg: #101317;
  --cq-surface: #171c22;
  --cq-surface-raised: #202730;
  --cq-border: #303944;
  --cq-text: #f3f5f7;
  --cq-text-muted: #a9b2bd;
  --cq-accent: #56b4e9;
  --cq-accent-strong: #168ac4;
  --cq-success: #55b889;
  --cq-warning: #e7b45a;
  --cq-danger: #e47777;
  --cq-focus: #8bd3ff;
  --cq-radius-sm: 6px;
  --cq-radius-md: 10px;
  --cq-radius-lg: 16px;
  --cq-space-1: 4px;
  --cq-space-2: 8px;
  --cq-space-3: 12px;
  --cq-space-4: 16px;
  --cq-space-6: 24px;
  --cq-space-8: 32px;
}
```

Use CSS variables/design tokens and shared components instead of scattered one-off values.

### Responsive targets

- Small mobile: 320–374 px.
- Mobile: 375–767 px.
- Tablet: 768–1023 px.
- Desktop: 1024–1439 px.
- Large desktop: 1440 px and above.

The interface must not require hover. Use a mobile bottom navigation or compact navigation drawer where appropriate. The 3D viewport should resize cleanly and support touch gestures.

---

## 4. Information architecture and navigation

### Primary navigation

- **Home / Hub**
- **Worlds**
- **Learn**
- **Virtual Lab**
- **Molecule Studio**
- **Periodic Table**
- **Practice & Exams**
- **Progress**
- **Profile / Settings**

On small screens, collapse navigation into a bottom bar or accessible drawer with a clearly visible route back to the active activity.

### Global UI shell

- Top bar: logo, current location/breadcrumb, global search, sync status, help, profile.
- Main content region: page-specific workspace.
- Optional contextual side panel: mission steps, details, filters or notebook.
- Toast/notification region: concise and dismissible; only show confirmed results.
- Global keyboard shortcuts documented in help.
- Modal/dialog convention: focus trap, Escape handling where safe, clear labels and return focus.
- Persistent autosave status: “Saving…”, “Saved”, or actionable failure—never imply saved until confirmed.

---

## 5. Full screen inventory and requirements

Implement these as a coherent route map. Screens can share components, but each route must have a meaningful empty/loading/error/success state where relevant.

### A. Entry and identity

1. **Splash/loading:** brand mark, loading progress when measurable, asset loading state, recoverable failure.
2. **Welcome/onboarding:** explain the game, learning modes, privacy and hardware requirements.
3. **Sign in:** supported authentication method, validation, password visibility, accessible errors.
4. **Create account:** validation, password rules, consent/privacy links.
5. **Password recovery:** request flow and confirmation without revealing whether an account exists.
6. **Guest entry:** clearly explain what is and is not saved; no fake account.
7. **Player setup:** display name, optional avatar, language, education level, learning goals.
8. **Profile:** progress, earned achievements, preferences and account actions.
9. **Settings:** language, sound, graphics quality, controls, reduced motion, contrast, data/export/privacy.
10. **Compatibility screen:** WebGL/browser support, performance recommendation, 2D fallback.

### B. Home and navigation

11. **Main hub:** continue activity, current mission, daily challenge, recent learning, shortcuts to Lab/Periodic Table/Molecule Studio.
12. **Global search:** search topics, lessons, experiments, elements, saved molecules and glossary.
13. **World selection:** world previews, prerequisites, mastery, lock explanation and progress.
14. **World overview:** narrative, subregions, levels, key learning outcomes and available activities.
15. **Level map:** node states (locked/available/in-progress/mastered), prerequisites, completion and revisit.
16. **Mission briefing:** goal, learning outcomes, context, equipment/resources, safety, success criteria and expected duration.
17. **Pause menu:** resume, restart with confirmation, settings, exit/save status.
18. **Mission results:** score breakdown, mastery, mistakes, explanation, rewards and next/retry action.
19. **Retry/remediation:** targeted revision, hint, practice and restart without punitive UX.
20. **World completion:** recap, unlocks, mastery summary and next-world transition.

### C. Learning and assessment

21. **Lesson player:** concept sections, text/diagrams, equations, examples, progress, glossary and checkpoints.
22. **Interactive concept explorer:** manipulable models, annotations, sliders and concept questions.
23. **Worked example:** step-by-step derivation, units, hints and revealable steps.
24. **Question player:** MCQ, multiple-select, numerical answer, matching, ordering, structure drawing or short explanation as supported.
25. **Quiz results:** answer-by-answer review and concept-linked remediation.
26. **Numerical workspace:** equation entry, unit-aware values, calculator and dimensional checking.
27. **JEE/exam simulator:** configurable sections, timer, question palette, marking scheme, review flags, submit confirmation and results.
28. **Exam review:** performance by topic/difficulty, correct solution, time analysis and next practice.
29. **Flashcards/revision:** due items, confidence rating, source concept and spaced-repetition scheduling.
30. **Mistake notebook:** saved mistakes, attempted solution, correct reasoning and retry state.
31. **Formula/reference library:** searchable equations, constants, units and scope/assumptions.
32. **Glossary:** searchable terms, pronunciation if available, formula links and related topics.

### D. Virtual laboratory

33. **Lab home:** experiment catalogue, categories, prerequisites, completion and equipment preview.
34. **Experiment detail:** objective, theory, apparatus, chemicals, safety, method, calculations and expected outputs.
35. **Lab workspace:** 3D apparatus scene, step panel, inventory/reagent panel, controls, measurements and notebook.
36. **Apparatus detail/placement:** choose, position, rotate, inspect and connect compatible equipment where relevant.
37. **Reagent selection:** labelled identity, concentration, quantity, compatibility, hazard information and permitted actions.
38. **Measurement panel:** instrument reading, unit, precision, calibration status and timestamp/step.
39. **Observation table:** editable rows with validation, units, replicate data and autosave.
40. **Graphing workspace:** choose axes, units, datasets, best-fit options only where scientifically justified, export and interpretation.
41. **Calculation worksheet:** formula, substitutions, units, significant figures, intermediate values and error feedback.
42. **Lab notebook:** objective, theory, procedure, raw readings, observations, calculations, result, uncertainty, conclusion and viva.
43. **Viva/assessment:** conceptual and procedural questions based on the selected experiment.
44. **Experiment report:** generate a printable/downloadable report from saved data; label simulated readings clearly.
45. **Experiment results:** performance, procedural mistakes, calculation checks and next steps.
46. **Lab safety tutorial:** hazards, PPE, disposal and virtual-only limitations.
47. **Lab error recovery:** invalid apparatus/reagent action, impossible measurement, missing step, save failure and reset.

### E. Periodic table

48. **Periodic table overview:** all 118 elements, group/period labels, f-block layout, search, filters and keyboard navigation.
49. **Element detail:** symbol, name, atomic number, standard atomic weight/value status, electron configuration, oxidation states, category and sourced properties.
50. **Periodic trends:** selectable property heatmaps, explanatory legend, comparison and source/method.
51. **Element comparison:** compare two or more elements with consistent units and missing-data states.
52. **Electron configuration explorer:** shells/orbitals and supported configuration explanation.
53. **Element-to-compound links:** related molecules, lessons, experiments and reactions.

### F. Molecule Studio / computational chemistry

54. **Molecule Studio landing:** saved molecules, examples, create/import actions and recent work.
55. **2D structure editor:** atoms, bonds, charges, aromaticity where supported, undo/redo and validity messages.
56. **3D molecule viewer:** rotate, zoom, pan, select atom/bond, reset camera, labels, measurements and render styles.
57. **Molecule inspector:** formula, molecular weight, supported descriptors, atom/bond counts and validity.
58. **Conformer workspace:** generate supported conformers, compare structures and show method/limitations.
59. **Geometry inspector:** distances, angles, dihedrals and coordinate provenance.
60. **Import/export:** supported formats only, clear validation, file size limits and error messages.
61. **Computational job screen:** queued/running/completed/failed states, method, engine/version, logs and cancellation where supported.
62. **Orbital/electron-density viewer:** only show genuine calculation outputs or clearly labelled supplied reference data; never fabricate orbital data.
63. **Molecule collection:** name, tags, source, saved date, duplicate, rename, export and delete confirmation.
64. **Molecule challenge:** task such as construct a given formula/structure with validity and pedagogical feedback.

### G. Progress, rewards and utility

65. **Progress dashboard:** mastery by world/topic, time spent, experiment completion and recommendations.
66. **Achievements:** meaningful learning-based awards; avoid pay-to-win or endless grind.
67. **Daily/weekly quests:** small, curriculum-aligned tasks with accessible deadlines.
68. **Inventory/crafting:** only include if it supports a learning objective; no arbitrary chemistry claims.
69. **Leaderboard:** optional and privacy-safe; avoid exposing real names by default. Defer until privacy/moderation is designed.
70. **Cloud sync:** status, conflict resolution and last successful sync.
71. **Data export/delete:** explain stored data and provide real account-data controls where implemented.
72. **Help/support:** controls, FAQs, known limitations and troubleshooting.
73. **Offline state:** cached content availability and queued-save messaging.
74. **Not found/permission/error screens:** understandable recovery path.
75. **Content unavailable:** explain missing module without breaking navigation.

---

## 6. World and progression architecture

Use worlds as thematic containers; use curriculum tags and prerequisites to avoid locking a learner out of needed study.

### Proposed world taxonomy

These are proposed product groupings, not official syllabus chapter numbering. Map actual chapters to worlds after inspecting course files.

1. **Discovery Academy** — matter, measurement, units, atoms, elements, compounds, formulae, equations and lab safety.
2. **Atomic Frontier** — atomic structure, quantum concepts appropriate to level, periodic table and trends.
3. **Bonding & Molecular Worlds** — ionic/covalent/metallic bonding, Lewis structures, VSEPR, polarity, intermolecular forces, hybridization and molecular geometry.
4. **Reaction Forge** — stoichiometry, reaction types, redox, balancing and reaction reasoning.
5. **Physical Chemistry Realm** — states of matter, thermodynamics, equilibrium, kinetics, solutions, electrochemistry and surface chemistry as required by the curriculum.
6. **Organic Chemistry Expedition** — nomenclature, functional groups, structure, isomerism, mechanisms and reactions at the target course level.
7. **Inorganic Observatory** — periodicity, coordination chemistry, descriptive chemistry and relevant course topics.
8. **Analytical Lab District** — titration, concentration, water analysis, instruments, uncertainty and data analysis.
9. **Engineering Frontier** — water technology, corrosion, materials, lubricants, polymers, electrochemistry and course-specific engineering topics.
10. **Molecular Modelling Universe** — structure editing, conformers, geometry, descriptors and supported computation.
11. **Industrial Systems** — process decisions, materials, water treatment, sustainability, and real-world case studies.
12. **Capstone Laboratory** — integrated tasks and project-based assessments.

### Level data model

Each level should be a content record, not a bespoke component:

```ts
type LevelDefinition = {
  id: string;
  worldId: string;
  title: string;
  summary: string;
  difficulty: "foundation" | "intermediate" | "advanced";
  prerequisites: string[];
  curriculumTags: string[];
  learningObjectives: string[];
  activityIds: string[];
  assessmentId?: string;
  unlockRules: UnlockRule[];
  estimatedMinutes?: number;
  contentVersion: string;
};
```

Use stable IDs. Do not derive IDs from mutable display names.

### Unlocking and mastery

- Define prerequisites explicitly.
- Support direct curriculum browsing even when a story mission is locked.
- Distinguish `not_started`, `available`, `in_progress`, `completed`, and `mastered`.
- Mastery must be based on defined evidence (e.g. assessment threshold plus independent successful application), not just opening a page.
- Retakes should be allowed.
- Store assessment attempts and content versions to interpret historical results.
- Prevent reward farming through repeated trivial interactions.
- Do not penalize a learner for using accessibility tools or an educational hint.

### Mission pattern

Every mission includes: context/story, objectives, prerequisites, equipment/resources, learning sequence, interactions, assessment, success criteria, remediation, completion summary, and content provenance.

---

## 7. Virtual 3D lab: functional specification

### Main workspace

- 3D viewport with orbit, zoom, pan, object selection and camera reset.
- Apparatus tray/catalogue with search and category filters.
- Reagent inventory with concentration, quantity and label.
- Procedure panel with ordered steps and step state.
- Measurement/instrument panel with units and precision.
- Notebook/observation table.
- Calculations and graphing panel.
- Safety reminder and accessible text alternative.
- Clear restart/undo controls and confirmation before discarding data.

### Interaction model

A lab action is a domain command, not a visual animation alone. Example command sequence:

1. `SelectApparatus`
2. `PlaceApparatus`
3. `SelectReagent`
4. `MeasureQuantity`
5. `TransferReagent`
6. `MixOrReact`
7. `WaitOrObserve`
8. `ReadInstrument`
9. `RecordObservation`
10. `CalculateResult`
11. `SubmitConclusion`

Each command should validate:
- Current experiment state.
- Required prerequisites.
- Apparatus compatibility.
- Reagent identity and allowed amount.
- Units and valid ranges.
- Whether the action is allowed in the current step.
- Whether the action produces a measured, simulated or reference value.

Invalid actions return a typed, explanatory result. Do not silently accept invalid chemistry.

### Simulation model

Use experiment-specific simulation adapters, not one generic “pour liquid and change colour” mechanic. For each experiment define:
- Educational model and scope.
- State variables.
- Input actions.
- Outputs/readings.
- Formulae and units.
- Rounding/significant-figure policy.
- Validated expected ranges.
- Error/uncertainty model where appropriate.
- Limitations and source citations.
- Assessment rules and reset behavior.

Do not pretend a simplified model predicts every physical effect. Do not simulate unsafe procedures as real-world instructions without reviewed safety content. Virtual actions do not replace supervised real laboratory training.

### Experiment record schema

```ts
type ExperimentDefinition = {
  id: string;
  title: string;
  curriculumTags: string[];
  sourceReferences: SourceReference[];
  objectives: string[];
  theory: ContentBlock[];
  apparatus: ApparatusDefinition[];
  reagents: ReagentDefinition[];
  safety: SafetyNote[];
  procedure: ProcedureStep[];
  simulationModelId: string;
  observationSchema: ObservationField[];
  calculations: CalculationDefinition[];
  graphDefinitions?: GraphDefinition[];
  vivaQuestionIds: string[];
  assessmentId?: string;
  reportTemplateId: string;
  contentVersion: string;
  reviewedBy?: string;
  reviewStatus: "draft" | "scientific_review" | "approved";
};
```

### Lab notebook/report

Must contain:
- Experiment title and ID.
- Source/curriculum reference.
- Aim/objectives.
- Theory and equations.
- Apparatus and reagents.
- Safety/PPE and disposal guidance.
- Procedure steps completed.
- Raw readings (never overwrite raw data with rounded values).
- Observations and instrument conditions.
- Calculations with formula, substitutions, units and significant figures.
- Graphs and fit method where applicable.
- Result and uncertainty/limitations.
- Conclusion.
- Viva responses.
- Simulation/reference-data disclosure.
- Date, attempt ID and content version.

---

## 8. Required engineering chemistry practicals: source-driven implementation

**Critical:** The exact experiment list must be extracted from the user's actual manual before marking it complete. The list below is a provisional checklist derived from the current project discussion and must be reconciled with the manual. Do not assume the order or wording matches the official document.

Possible practical modules mentioned in the current project context:

1. Water hardness by EDTA.
2. Water alkalinity.
3. Chloride content, total dissolved solids (TDS) and turbidity, if prescribed as separate or combined experiments.
4. Partition coefficient of acetic acid.
5. Molecular shape analysis.
6. Comparison of bond angles in H₂O, H₂S and H₂Se.
7. Geometry optimization of a metal-organic framework (MOF).
8. Molecular modelling/electron-density distribution for ethylene, butane, benzene or the exact manual compounds.
9. Ferrous-ion concentration by potentiometry.
10. Conductometric titration.
11. Viscosity of lubricating oils using the prescribed viscometer.
12. Conformational analysis for the exact molecules in the manual.
13. HOMO/LUMO visualization.
14. Percentage composition of NaOH and NaCl, if this is the prescribed method/title.
15. Engineering chemistry mini-project.

For every item, first verify whether it is actually present and the precise title/requirements in the reference files. If a title above is inaccurate or incomplete, use the source document's version and record the discrepancy in the traceability matrix.

### Required traceability matrix

Create `docs/curriculum/experiment-traceability.md` with columns:

| Source file/page/section | Exact experiment title | Procedure requirements | Apparatus/reagents | Formulae/units | Screen/module | Test IDs | Status |
|---|---|---|---|---|---|---|---|

No experiment can be labelled “implemented” until the source requirements, UI workflow, domain simulation, calculations, safety content, tests and report output are all mapped.

### Scientific validation

- Cross-check equations and units.
- Handle dilution, blank correction, calibration, replicates and endpoint assumptions where relevant.
- Keep raw observations separate from derived values.
- Test edge cases and invalid inputs.
- Label example data as example data.
- Do not hard-code one “correct result” for all plausible readings.
- Include uncertainty and method limitations where appropriate.
- Require chemistry review before publishing each experiment.

---

## 9. Periodic table specification

### Coverage

All 118 recognized elements, arranged by group/period with lanthanide and actinide rows correctly represented. The data layer must support element property provenance, missing values, estimated values and alternative conventions.

### Core features

- Search by name, symbol and atomic number.
- Keyboard-accessible grid navigation.
- Category filters and block filters.
- Group and period labels.
- Element detail panel or page.
- Selectable property heatmaps with legend and units.
- Side-by-side comparison.
- Electron configuration display and explanation.
- Links to relevant lessons, molecules, reactions and lab activities.
- Responsive layout with a usable mobile alternative.
- Source, date/version and confidence/value-status fields for properties.

### Element schema

```ts
type ElementRecord = {
  atomicNumber: number;
  symbol: string;
  name: string;
  category?: string;
  group?: number;
  period: number;
  block?: "s" | "p" | "d" | "f";
  atomicWeight?: { value: number | string; status: "standard" | "interval" | "mass_number" | "unknown" };
  electronConfiguration?: string;
  oxidationStates?: number[];
  properties: Record<string, PropertyValue>;
  sourceReferences: SourceReference[];
  dataVersion: string;
};

type PropertyValue = {
  value?: number | string;
  unit?: string;
  status: "measured" | "standard" | "estimated" | "calculated" | "not_applicable" | "unknown";
  sourceId?: string;
  note?: string;
};
```

Do not fabricate property values. A missing property is better than a made-up value. Verify licensing and attribution for the data source.

---

## 10. Molecule Studio: RDKit + 3D renderer

### Architecture boundary

RDKit is a chemistry toolkit, not a complete game engine or a general quantum chemistry package. Use RDKit for supported chemical graph/structure operations, sanitization, canonicalization, substructure work, 2D depictions, descriptors and supported conformer workflows. Use a dedicated 3D renderer for visual interaction. Use a separate, explicit computation adapter for advanced calculations when supported.

### Core functionality

- Create a molecule by placing atoms and adding/removing bonds.
- Support element selection, bond order, charge, isotope and aromaticity only where validated.
- Undo/redo and clear/reset.
- Validate/sanitize structures with understandable error messages.
- Display formula and supported molecular descriptors.
- Render a 2D depiction and a 3D view.
- Rotate, zoom, pan, select atoms/bonds and display labels.
- Rendering modes: ball-and-stick, stick, wireframe and space-filling.
- Show atom indices, bond labels, selected distances/angles/dihedrals where available.
- Generate supported 3D conformers and show whether a geometry is generated, optimized, imported or supplied as reference.
- Compare conformers; explain that a generated conformer is not necessarily the global minimum.
- Import/export only supported formats and validate file size/content.
- Save, rename, duplicate, tag, search and delete user molecules.
- Provide examples for H₂O, CO₂, NH₃, CH₄, ethanol, benzene, ethylene and butane, after validating each.
- Include a challenge mode linked to lessons.

### Molecular data provenance

For each structure/result, store:
- Source or user-created status.
- Canonical representation when supported.
- Atom/bond graph and stereochemistry.
- Toolkit/version.
- Conformer-generation method.
- Force field and parameters if used.
- Optimization status and convergence details.
- Coordinates and units.
- Descriptor calculation method.
- Import file metadata if applicable.

### Advanced computation policy

- Do not display HOMO/LUMO or electron-density isosurfaces unless backed by actual supported calculation outputs or explicitly labelled reference files.
- Do not claim geometry optimization occurred if only a renderer was used.
- If computation is unsupported in the current environment, show a clear capability notice and offer valid alternatives (e.g. view supplied reference data or export to a supported external workflow).
- Put expensive computations in a Web Worker or server job where appropriate, with cancellation/timeouts and limits.
- Never execute arbitrary user-supplied code or unsafe file content.

---

## 11. Chemistry content architecture

Content should be structured and versioned independently of presentation.

### Suggested content types

- `WorldDefinition`
- `LevelDefinition`
- `MissionDefinition`
- `LessonDefinition`
- `ContentBlock`
- `QuestionDefinition`
- `AssessmentDefinition`
- `ExperimentDefinition`
- `ProcedureStep`
- `ApparatusDefinition`
- `ReagentDefinition`
- `CalculationDefinition`
- `GraphDefinition`
- `ElementRecord`
- `MoleculeExample`
- `SourceReference`
- `SafetyNote`
- `AchievementDefinition`

### Content requirements

- Every lesson declares prerequisites, learning objectives, curriculum tags, estimated time and content version.
- Every equation uses proper subscripts/superscripts and accessible text alternatives.
- Every numerical example includes units and assumptions.
- Every content block may cite its source and review state.
- Every quiz item includes the correct answer, rationale, distractor feedback and tags.
- Every experiment includes safety information and a reviewed procedure.
- Separate English/Hindi strings from content logic. Do not machine-translate scientific instructions without review.
- Build a curriculum coverage report so missing topics and experiments are visible.

---

## 12. Technical architecture

### Architecture goals

- Modular monolith initially; avoid premature microservices.
- Clear boundaries between UI, domain logic, content, persistence and rendering.
- Type-safe interfaces and runtime validation for external/persisted data.
- Testable chemistry calculations independent of React.
- Keep 3D systems isolated so they can be replaced without rewriting curriculum logic.
- Start local-first where possible; add cloud sync only with actual authentication and persistence.
- No secret keys in client bundles.
- No requirement for an AI API for core learning.

### Proposed frontend stack

Keep the existing stack if already configured and healthy:

- React 18
- TypeScript with strict mode
- Vite
- Tailwind CSS plus CSS variables/design tokens
- React Router (or existing router)
- Vitest + Testing Library
- Playwright for end-to-end tests when practical
- Three.js / React Three Fiber for 3D scenes, if compatible with repository
- RDKit.js/WebAssembly or another supported RDKit distribution after verifying licensing, API, bundle size and browser compatibility
- A maintained charting library for lab graphs
- Zod (or equivalent) for runtime validation if useful

Do not upgrade every dependency automatically. Check compatibility and pin appropriate versions.

### Backend and persistence

Choose after repository inspection. Initial options:
- Local-first persistence with IndexedDB for guest progress and saved molecules.
- Optional Firebase/Supabase or another suitable free-tier backend for auth and sync, only after cost, limits, security rules, and export options are reviewed.
- Server-side functions for sensitive operations and long-running jobs if required.

Do not store passwords yourself. Use a trusted authentication provider. Do not put privileged service-role credentials in the frontend.

### Domain modules

- `chemistry-core`: units, formula helpers, supported calculations, validation and shared domain types.
- `curriculum`: worlds, levels, lessons, prerequisites, objectives and content validation.
- `progression`: unlock rules, mastery, achievements and reward policy.
- `assessment`: question types, scoring, feedback and exam rules.
- `lab-simulation`: experiment state machines, command validation and experiment adapters.
- `molecular`: structure types, RDKit adapter, format import/export, descriptors and provenance.
- `periodic-table`: element records, filtering, comparison and property metadata.
- `persistence`: repositories, migrations, save state and sync conflict handling.
- `analytics-privacy`: minimal, opt-in learning metrics and privacy-safe event handling.
- `ui`: design system and reusable components.
- `world-renderer`: environment loading and world interaction.
- `lab-renderer`: apparatus models and lab scene interaction.
- `molecule-renderer`: molecular 3D viewport.

### Dependency rule

UI components may call domain use cases; domain modules must not import React or UI components. Rendering modules must not own chemistry truth. The chemistry domain owns validated state and computed values; the renderer visualizes it.

---

## 13. Suggested repository structure

Adapt to the existing repo instead of blindly creating duplicates.

```text
chemistry-quest/
├─ public/
│  ├─ assets/
│  │  ├─ icons/
│  │  ├─ textures/
│  │  ├─ models/
│  │  ├─ environments/
│  │  └─ audio/
│  └─ manifest.webmanifest
├─ src/
│  ├─ app/
│  │  ├─ router/
│  │  ├─ providers/
│  │  ├─ layout/
│  │  └─ app-config.ts
│  ├─ components/
│  │  ├─ ui/
│  │  ├─ navigation/
│  │  ├─ feedback/
│  │  └─ scientific/
│  ├─ features/
│  │  ├─ onboarding/
│  │  ├─ hub/
│  │  ├─ worlds/
│  │  ├─ lessons/
│  │  ├─ assessments/
│  │  ├─ virtual-lab/
│  │  ├─ periodic-table/
│  │  ├─ molecule-studio/
│  │  ├─ notebook/
│  │  ├─ progress/
│  │  └─ settings/
│  ├─ domain/
│  │  ├─ chemistry-core/
│  │  ├─ curriculum/
│  │  ├─ progression/
│  │  ├─ assessment/
│  │  ├─ experiments/
│  │  ├─ molecular/
│  │  └─ periodic-table/
│  ├─ content/
│  │  ├─ worlds/
│  │  ├─ lessons/
│  │  ├─ questions/
│  │  ├─ experiments/
│  │  ├─ elements/
│  │  └─ molecules/
│  ├─ infrastructure/
│  │  ├─ persistence/
│  │  ├─ auth/
│  │  ├─ sync/
│  │  ├─ rdkit/
│  │  ├─ rendering/
│  │  └─ telemetry/
│  ├─ workers/
│  ├─ styles/
│  ├─ test/
│  └─ main.tsx
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
├─ docs/
│  ├─ architecture/
│  ├─ design/
│  ├─ curriculum/
│  ├─ experiments/
│  ├─ assets/
│  └─ decisions/
├─ scripts/
├─ .env.example
├─ README.md
├─ CONTRIBUTING.md
└─ package.json
```

Use feature folders and avoid excessive abstraction. If the current project already has a different sensible structure, document and preserve it.

---

## 14. Domain interfaces and state

### Core domain types

```ts
type ContentId = string;
type UserId = string;

type ActivityStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed"
  | "mastered";

type SourceReference = {
  id: string;
  title: string;
  location?: string; // page, section, URL or source-file locator
  publisher?: string;
  accessedAt?: string;
  license?: string;
};

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "equation"; latex: string; accessibleText: string }
  | { type: "image"; assetId: string; alt: string; caption?: string }
  | { type: "diagram"; diagramId: string; alt: string }
  | { type: "worked-example"; exampleId: string }
  | { type: "interactive"; interactionId: string }
  | { type: "warning"; title: string; text: string };

type ProgressRecord = {
  userId?: UserId;
  contentId: ContentId;
  status: ActivityStatus;
  bestScore?: number;
  masteryEvidence: string[];
  attempts: number;
  lastAttemptAt?: string;
  contentVersion: string;
  updatedAt: string;
};
```

### State management

- Use a small, documented state solution appropriate to existing code.
- Keep transient UI state local where possible.
- Keep domain state serializable.
- Never store Three.js objects, WebGL resources or functions inside persisted progress.
- Persist versioned DTOs, not arbitrary component state.
- Validate and migrate stored data.
- Handle storage quota and corrupted saves gracefully.
- Define sync conflict rules before enabling multi-device sync.

### Lab state machine

Use explicit states such as:
`not_started → briefing → in_progress → awaiting_calculation → assessment → completed`
with defined recovery/retry paths. State transitions must be tested. Do not let arbitrary UI clicks jump to `completed`.

### Error model

Use typed domain errors such as:
- `InvalidStructureError`
- `InvalidUnitError`
- `PrerequisiteNotMetError`
- `InvalidProcedureStepError`
- `ApparatusIncompatibleError`
- `CalculationOutOfRangeError`
- `PersistenceUnavailableError`
- `ComputationUnsupportedError`

Translate errors into learner-friendly UI messages while preserving developer diagnostics in logs.

---

## 15. Persistence, accounts and sync

### Local-first baseline

- Save guest progress and settings locally where browser storage permits.
- Save notebook entries and molecules with stable IDs and timestamps.
- Use schema versions and migration functions.
- Make export/backup possible.
- Communicate when data is local-only.
- Never display “Synced” when only local save succeeded.

### Cloud sync phase

Only implement when a real backend is configured:
- Authenticated users and secure rules.
- Per-user data isolation.
- Server-side validation for sensitive writes.
- Explicit sync status and retry.
- Conflict resolution (last-write-wins only if justified; otherwise version-based merge or user choice).
- Logout and account deletion behavior.
- Minimal data collection.
- No public leaderboards by default.
- Avoid storing unnecessary personal data.

### Example entity model

- `users`
- `profiles`
- `progress_records`
- `assessment_attempts`
- `lab_sessions`
- `notebook_entries`
- `saved_molecules`
- `user_settings`
- `sync_metadata`

Use a repository interface so persistence can be swapped without rewriting UI or domain modules.

---

## 16. Graphics, 3D assets and audio plan

### Asset categories

1. World environment concept art and environment meshes.
2. Lab benches, shelves, floors, lights and background props.
3. Glassware: beakers, flasks, graduated cylinders, burettes, pipettes, volumetric flasks, funnels, test tubes and condensers as required.
4. Instruments: balance, pH meter, conductivity meter, potentiometer, viscometer, turbidity meter and other manual-specific equipment.
5. Reagent containers, labels and safe generic liquids.
6. Molecular atom/bond primitives and molecular example files.
7. Periodic-table element icons or category illustrations where useful.
8. UI icons, achievement badges and maps.
9. Character portraits and mission illustrations if narrative needs them.
10. Sound effects: selection, correct/incorrect feedback, apparatus interaction, ambience and accessibility-safe cues.

### Asset production rules

- Create an asset manifest with ID, purpose, format, dimensions/poly budget, texture resolution, source, license, attribution, owner, status and target screen.
- Prefer procedural/simple geometry for common apparatus if it improves accuracy and keeps the bundle small.
- Use consistent scale and coordinate conventions.
- Keep labels and UI out of background image assets.
- Use glTF/GLB where appropriate for 3D assets.
- Compress textures/models and lazy-load environments.
- Use real scientific reference images only with suitable rights and attribution.
- Generated imagery is concept art, not a source of scientific truth.
- Do not represent an illustration as an actual interactive model.
- Ensure model shapes do not obscure apparatus graduations or measurements.

### Performance budgets (initial targets; profile and adjust)

- Initial application shell should load without downloading every world/model.
- Split large routes and lazy-load 3D dependencies.
- Avoid rendering hidden 3D canvases.
- Dispose geometries, materials, textures, event listeners and workers.
- Cap device pixel ratio for low-end hardware.
- Offer low/medium/high graphics settings.
- Pause or reduce animation when tab is hidden.
- Provide a 2D fallback and clear unsupported-device message.
- Measure route bundle sizes and scene performance; do not promise a frame rate without testing.

---

## 17. Accessibility and usability requirements

Target WCAG 2.2 AA where practical.

- Semantic landmarks and heading order.
- Full keyboard navigation and visible focus.
- No hover-only interaction.
- Accessible labels for controls, canvas alternatives and scientific diagrams.
- Contrast that remains readable in dark mode.
- Respect reduced-motion preference.
- Touch targets appropriate for mobile.
- Do not communicate correctness only through colour or sound.
- Provide text equivalents for audio and visual-only feedback.
- Make equations accessible through readable text descriptions.
- Do not auto-submit exams unexpectedly.
- Warn before destructive reset/delete.
- Keep timers configurable for practice mode; exam timers must be explicit.
- Ensure screen readers receive concise updates for key state changes, not every animation frame.

---

## 18. Security, privacy and safety

- Never commit `.env` files or secrets.
- Include `.env.example` with dummy values only.
- Validate file uploads and impose size/type limits.
- Treat imported molecular files and persisted JSON as untrusted.
- Avoid unsafe HTML injection; sanitize any rich content.
- Use secure backend access rules and least privilege.
- Do not store plaintext passwords.
- Do not expose user emails or real names on leaderboards.
- Provide privacy and data-retention explanations.
- If children/minors may use the product, design privacy defaults conservatively and review applicable legal obligations before public release.
- Lab safety instructions must be reviewed, contextual and aligned with the source course.
- Make clear that virtual laboratory tasks do not replace real-world supervision or institutional safety training.
- Do not encourage real-world mixing or handling of hazardous chemicals without appropriate reviewed safety guidance.

---

## 19. Testing and quality strategy

### Unit tests

- Chemistry calculations, units, rounding and significant figures.
- Formula/structure validation and supported descriptors.
- Unlock rules and mastery thresholds.
- Assessment scoring and partial credit.
- Experiment state transitions and action validation.
- Lab observation/calculation outputs.
- Periodic-table data completeness and ordering.
- Persistence serialization, migration and corruption recovery.
- Content schema validation and reference integrity.

### Integration tests

- Start a mission → complete lesson → take quiz → record mastery.
- Start an experiment → perform valid steps → record readings → calculate → submit → generate report.
- Create a molecule → validate → render → save → reload → export.
- Search/select an element → view details → compare properties.
- Local save → reload app → recover progress.
- Auth/sync tests only when a real backend exists.

### End-to-end tests

- Onboarding and guest flow.
- Main hub navigation.
- World/level locking and unlocking.
- Keyboard-only basic navigation.
- Mobile responsive navigation.
- Lab reset/cancel and error recovery.
- Molecule Studio fallback when RDKit/WebGL is unavailable.
- Offline/error states.
- Production build smoke test.

### Quality gates

Before declaring a milestone done:
- Typecheck passes.
- Lint passes if configured.
- Relevant unit/integration tests pass.
- Production build succeeds.
- No obvious console errors in core flows.
- No broken navigation/dead buttons in implemented screens.
- Responsive check at mobile/tablet/desktop widths.
- Scientific calculations have test vectors reviewed against trusted references.
- All new assets have provenance/licensing metadata.
- README reflects actual implementation.

---

## 20. Phased roadmap

### Phase 0 — Repository and reference audit

Deliver:
- Repository inventory.
- Existing feature/architecture report.
- Source-file inventory for syllabus/manual.
- Exact experiment extraction.
- `docs/curriculum/experiment-traceability.md`.
- Architecture decision records for major choices.
- Risks and implementation plan.

Acceptance:
- No destructive changes before inspection.
- Actual dependencies and scripts are documented.
- Source claims are traceable.

### Phase 1 — Design system and application shell

Deliver:
- Responsive app shell, navigation, design tokens and reusable components.
- Loading, empty, error and offline states.
- Home hub, world selection and level map using real structured sample content.
- Settings and compatibility check.
- Routes and keyboard/touch interactions.

Acceptance:
- Responsive at all target widths.
- No dead navigation.
- No fake data presented as real user progress.

### Phase 2 — First learning vertical slice

Deliver:
- One complete introductory world segment.
- A lesson with explanations and worked example.
- Multiple question types supported by the data model.
- Scoring, explanations, mastery and saved progress.
- Mission briefing/results/remediation.

Acceptance:
- A learner can complete the full loop from hub to result.
- Progress survives reload using the actual persistence adapter.
- Unit and end-to-end tests cover the loop.

### Phase 3 — Periodic Table

Deliver:
- Complete 118-element dataset with source/provenance.
- Search, category filters, details and property comparison.
- Responsive grid and keyboard navigation.

Acceptance:
- Exactly 118 unique atomic numbers, correct symbols and ordering.
- Missing/estimated values handled honestly.
- Data validation test passes.

### Phase 4 — Molecule Studio

Deliver:
- RDKit integration spike with documented browser/build constraints.
- 2D editor or validated structure input, molecule validation, 3D conformer generation where supported.
- 3D viewport with camera controls and rendering modes.
- Inspector, save/load and supported export.

Acceptance:
- Core example molecules are validated.
- Invalid structures produce understandable errors.
- Renderer does not claim to perform chemistry calculations.
- Fallback exists if WebAssembly/WebGL is unavailable.

### Phase 5 — One complete virtual experiment

Recommended first candidate: **water hardness by EDTA**, but verify the actual course manual and choose the best first experiment based on source requirements and simulation feasibility.

Deliver:
- Experiment briefing, apparatus, reagents, safety and procedure.
- Experiment-specific state machine and validated calculations.
- Measurement/observation table, notebook and report.
- Viva/assessment and result/remediation screen.

Acceptance:
- Every step maps to the manual.
- Valid and invalid action paths are tested.
- Calculation test cases include boundary/invalid inputs.
- Report distinguishes raw readings, derived values and simulated/reference data.

### Phase 6 — Remaining prescribed experiments

Deliver:
- All experiments found in the actual manual, not just the provisional list.
- Shared apparatus components and experiment-specific simulation adapters.
- Source traceability and science review per experiment.

Acceptance:
- No experiment marked complete without traceability, implementation, tests and review.
- Coverage report shows implemented/in-progress/not-started.

### Phase 7 — Worlds, engineering chemistry and exam preparation

Deliver:
- Curriculum taxonomy mapped to the provided course and target exam.
- Remaining worlds/levels, JEE practice and exam simulator.
- Engineering case studies and capstone project.

Acceptance:
- Curriculum is searchable and can be studied out of story order.
- Progress/mastery remains coherent across modes.

### Phase 8 — Cloud sync and optional social features

Deliver only after core learning and local persistence are reliable:
- Real authentication, secure sync, conflict handling and account-data controls.
- Optional privacy-safe achievements/leaderboards after moderation and privacy review.

Acceptance:
- Security rules tested.
- No secrets in client.
- Sync status reflects real backend outcomes.

### Phase 9 — Polish and release readiness

Deliver:
- Performance tuning, accessibility audit, asset optimization, error recovery, documentation and release checklist.

Acceptance:
- All core flows pass tests.
- Known limitations are documented.
- No unsupported science claims.
- Production build and deployment process are reproducible.

---

## 21. First task for the coding agent

**Do not attempt to implement the entire game in one unreviewed change.**

1. Inspect the repository and read the existing project brief and roadmap.
2. Locate and inspect the engineering chemistry syllabus and lab manual. If a file is referenced but not accessible, search the project and library, then report that exact gap.
3. Summarize current state: stack, routes, screens, data, tests, build status, missing features and risks.
4. Create or update:
   - `docs/architecture/system-overview.md`
   - `docs/architecture/decisions/`
   - `docs/curriculum/experiment-traceability.md`
   - `docs/design/screen-inventory.md`
   - `docs/assets/asset-manifest.md`
   - `docs/roadmap.md`
5. Implement or refine the design system and shell without breaking existing work.
6. Build the first end-to-end vertical slice: hub → world → level/mission briefing → lesson → quiz → result → persisted progress.
7. Add meaningful tests and run all available checks.
8. Report exactly what is implemented, what is not, which source files were inspected, which commands were run, test/build outcomes, and the next smallest task.

If the repository already has a functioning part of this vertical slice, improve and test it rather than recreating it.

---

## 22. Definition of done for the first vertical slice

The slice is done only when:

- [ ] The app starts using documented commands.
- [ ] Main hub and navigation are responsive.
- [ ] One world and its levels are data-driven.
- [ ] Mission briefing shows objectives and prerequisites.
- [ ] One lesson contains real explanatory content.
- [ ] Quiz accepts and validates answers.
- [ ] Results explain mistakes and suggest remediation.
- [ ] Unlock/mastery logic is implemented in the domain layer.
- [ ] Progress is saved through a real local persistence adapter.
- [ ] Reload restores the saved state.
- [ ] Loading, empty, failure and retry states are present.
- [ ] Unit tests cover progression and assessment.
- [ ] An end-to-end test covers the learner journey where tooling permits.
- [ ] Typecheck and production build pass.
- [ ] README documents setup, commands, architecture and limitations.
- [ ] No dead controls or false claims about unimplemented features remain.

---

## 23. Definition of done for the full product

- [ ] Every screen in the screen inventory is implemented or explicitly deferred with a reason.
- [ ] All worlds, levels and curriculum mappings are data-driven.
- [ ] Every required experiment from the source manual has a traceability entry and reviewed implementation.
- [ ] The lab supports meaningful interactions, measurements, calculations, notebook and reports.
- [ ] Periodic table contains all 118 elements with validated records and provenance.
- [ ] Molecule Studio uses RDKit only for supported chemistry workflows and a dedicated renderer for 3D interaction.
- [ ] Computational chemistry outputs are genuine or explicitly labelled reference/simulation data.
- [ ] Persistence, migration, export and any cloud sync work as documented.
- [ ] Accessibility and responsive checks have been completed.
- [ ] Performance has been profiled on target devices.
- [ ] Tests, build and scientific calculation checks pass.
- [ ] Licensing and attribution are documented for datasets, libraries, models, textures, images and audio.
- [ ] Known limitations and future work are documented.

---

## 24. Required final report from the coding agent

At the end of each milestone, provide:

1. **Summary:** what changed and why.
2. **Implemented screens/features:** exact routes and capabilities.
3. **Architecture:** modules added/changed and important decisions.
4. **Reference coverage:** files/pages inspected and requirements mapped.
5. **Files changed:** concise list.
6. **Commands executed:** actual commands.
7. **Tests/build:** passed, failed, skipped and why.
8. **Scientific validation:** calculations/experiments validated and remaining review needs.
9. **Limitations:** anything mocked, unavailable, approximate or deferred.
10. **Run instructions:** exact steps for the beginner owner.
11. **Next step:** the smallest high-value task to continue.

Never report “complete” merely because a screen renders. Completion means the interaction works, state persists as claimed, the domain logic is validated, and the relevant tests pass.

---

## 25. Product north star

**Alche-Me should make chemistry feel like a world the learner can investigate, not a list of facts to memorize.** Every beautiful environment must support a learning objective; every interactive apparatus must behave according to an explicit model; every molecule must have a valid, traceable representation; every experiment must connect source requirements to measurements, calculations and explanations.

Build a small piece exceptionally well, preserve scientific truth, and expand the same architecture until the complete curriculum and laboratory manual are covered.
