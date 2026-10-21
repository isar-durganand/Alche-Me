from pathlib import Path
import textwrap

out = Path("/mnt/data/Alche-Me_Worlds_and_Level_Design_Prompt.md")
content = r"""# Alche-Me — World Design, 56-Level Curriculum, and Game-Design Prompt

## Purpose

Use this document as an implementation prompt for Alche-Me, a chemistry-learning adventure game. The player starts with no assumed chemistry knowledge and progresses toward school chemistry, advanced/JEE-style problem solving, practical laboratory reasoning, and engineering chemistry applications.

**Core progression:** absolute beginner → atomic foundations → bonding and reactions → quantitative chemistry → physical/inorganic/organic chemistry → analytical and practical chemistry → engineering chemistry → industrial and sustainable chemistry.

The game must teach, not merely decorate quizzes with game art. Every level needs a clear learning objective, a playable activity, feedback that explains why an answer is correct or incorrect, and a mastery check.

## Copy-paste prompt for the coding agent

You are the lead learning-game designer, chemistry curriculum architect, gameplay systems designer, and senior frontend engineer for **Alche-Me**.

Read `docs/Alche-Me_Master_Specification.md` and the phase prompt for the current implementation before making changes. Inspect the existing repository. Preserve working features and follow the current architecture.

### Product vision

Build Alche-Me as a polished, accessible, responsive, single-player chemistry adventure in which players explore connected worlds. Each world is a themed environment with a story, a world hub, seven levels, optional side quests, collectibles, and a world mastery challenge.

The learning progression must start from absolute beginner knowledge and build toward engineering chemistry. Do not assume the player already understands symbols, equations, units, or laboratory apparatus. Introduce concepts in a sensible order and revisit important ideas through spaced practice.

### Curriculum and scientific integrity

1. Use the eight worlds and 56 core levels defined below as the curriculum blueprint.
2. Treat level names and scope as a structured curriculum specification, not as permission to fabricate scientific facts.
3. Review all explanations, answers, equations, numerical constants, units, experiment procedures, and feedback against reliable sources.
4. Map the engineering chemistry world and practicals against the user's actual syllabus and lab manual when those files are available. Identify mismatches, missing source details, and syllabus-specific variations rather than guessing.
5. Distinguish school-level models from more advanced models. Explain when a model is simplified.
6. Never imply that a decorative 3D molecular render is a quantum-chemically accurate prediction.
7. Do not use in-game generative AI. Use reviewed, curated content.
8. Do not invent lab results and present them as real measurements. In simulations, label readings as simulated.
9. Include safe virtual-lab behavior, protective equipment, waste disposal concepts, and a reminder that a simulation does not replace supervised practical training.

### Required structure for every level

Each level record must include:

- `id`, `worldId`, `order`, `title`, `shortDescription`
- `prerequisiteLevelIds`
- `learningObjectives`
- `keyConcepts`
- `lessonSections`
- `activityType`
- `activityInstructions`
- `questionSetId` or equivalent reviewed assessment reference
- `feedbackRules`
- `masteryThreshold`
- `estimatedMinutes`
- `rewards`
- `unlocks`
- `contentSources`
- `reviewStatus`
- `accessibilityNotes`
- `localizationKeys`

Use a versioned, typed schema. Keep curriculum content separate from React components and gameplay logic.

### Gameplay loop

Each level should follow this rhythm:

1. **Story hook:** a short mystery, mission, or practical problem.
2. **Discover:** introduce one or a few new concepts using a diagram, 3D object, model, or concise explanation.
3. **Try:** let the player manipulate, classify, predict, assemble, measure, calculate, or investigate.
4. **Feedback:** explain the underlying reasoning, including why common mistakes fail.
5. **Challenge:** use a short quiz, puzzle, simulation, or scenario.
6. **Reflect:** show what was learned and what to review.
7. **Reward:** award XP, a badge, an item, or an unlock based on demonstrated mastery—not merely clicking through.

Keep most activities short and varied. Use longer activities for experiments, multi-step calculations, and boss challenges.

### Fun and progression systems

- A friendly lab companion can offer curated hints and explain concepts; it must not rely on generative AI.
- Use a field journal that stores discovered concepts, experiment observations, equations, and mistakes corrected.
- Unlock apparatus, visual themes, world shortcuts, molecule parts, badges, and optional side missions.
- Include puzzle types such as atom sorting, periodic-table navigation, molecule assembly, equation balancing, measurement reading, graph interpretation, evidence matching, and process optimization.
- Boss challenges must require applying previously learned concepts, not just answering a harder multiple-choice question.
- Provide hints and a practice route without shaming or permanently blocking the player.
- Use spaced review of earlier concepts in later worlds.
- Avoid pay-to-win mechanics, energy timers that block learning, and rewards that encourage unsafe experimentation.
- Support keyboard, mouse, touch, reduced motion, clear contrast, text scaling, and accessible alternatives to drag-only interactions.

### Progress and assessment

Use separate measures for:
- lesson completion,
- concept mastery,
- practical skill completion,
- optional exploration,
- cosmetic rewards.

A player must be able to revisit levels and practice without losing earned progress. Allow retrying a mastery challenge. Keep the scoring rules transparent.

### Implementation rules

- Implement in phases, not all at once.
- First make a complete, small vertical slice: world hub → level briefing → lesson → interactive activity → assessment → feedback → saved progress.
- Use sample content only when explicitly labeled as sample.
- Do not mark a world complete until its levels, assessments, assets, tests, and source reviews are genuinely implemented.
- Reuse shared components and activity engines instead of writing 56 bespoke mini-games.
- Use procedural 3D assets where sensible and optimize all imported models.
- Keep local/guest play available. Cloud accounts and synchronization are separate features and must not be faked.
- Run tests and a production build after each phase. Update `docs/Alche-Me_Progress_Tracker.md`.

### Acceptance criteria

The implementation is accepted only when:
- the world map displays all eight worlds with locked/unlocked/completed states;
- prerequisites and unlocks work deterministically;
- each implemented level has objectives, activity, feedback, assessment, and a completion state;
- chemistry content has source/review metadata;
- progress persists using the current persistence layer;
- the first end-to-end vertical slice works on desktop and mobile;
- tests cover progression, scoring, prerequisite logic, and at least one activity of each implemented type;
- no UI control is inert and no feature is claimed to be live when mocked;
- documentation lists what is implemented, mocked, blocked, and planned.

---

# World map and curriculum

## World 1 — The Spark of Discovery
**Theme:** A welcoming discovery campus, a hands-on science garden, and a bright beginner laboratory. This is the player's first contact with chemistry. The tone is curious, friendly, and low-pressure.

**Story:** The campus's Discovery Core has lost its scientific records. The player restores it by learning how to observe matter, classify materials, measure carefully, and think like a scientist.

**World outcome:** The player understands what chemistry studies, recognizes matter and its states, distinguishes observations from explanations, and can use basic laboratory safety and measurement tools.

### Level 1.1 — Welcome, Explorer!
- **Learn:** What chemistry studies; how chemistry connects to everyday life; observation, question, prediction, test, conclusion.
- **Play:** Inspect everyday objects and sort observations into “seen/measured” versus “inferred.”
- **Challenge:** Choose a testable question and identify evidence that could answer it.
- **Mastery:** Distinguish observation from inference in unfamiliar examples.

### Level 1.2 — The Matter Museum
- **Learn:** Matter, mass, volume, physical properties, objects versus materials.
- **Play:** Explore a museum shelf and classify objects by observable properties.
- **Challenge:** Identify which properties could help distinguish two unknown samples.
- **Mastery:** Correctly use matter/property vocabulary and explain a classification.

### Level 1.3 — Three States, One World
- **Learn:** Solid, liquid, gas; shape, volume, particle spacing and movement; simple particle model.
- **Play:** Switch a particle-view simulator between states and compare behavior.
- **Challenge:** Predict what happens when a substance is heated or cooled in a simplified model.
- **Mastery:** Explain state differences using particle arrangement and motion.

### Level 1.4 — The Mystery of Mixing
- **Learn:** Mixtures, pure substances as an introductory category, homogeneous and heterogeneous mixtures, dissolving.
- **Play:** Build mixtures from safe virtual ingredients and inspect whether the mixture appears uniform.
- **Challenge:** Classify new examples and identify what additional evidence may be needed.
- **Mastery:** Distinguish a mixture from a pure substance at the intended introductory level.

### Level 1.5 — The Measurement Workshop
- **Learn:** SI units and common laboratory units; mass, volume, temperature; reading a scale; precision versus accuracy at an introductory level.
- **Play:** Use a virtual balance, measuring cylinder and thermometer; avoid parallax in scale-reading tasks.
- **Challenge:** Choose suitable equipment and units for a measurement task.
- **Mastery:** Record measurements with correct units and reasonable precision.

### Level 1.6 — The Safe Lab Code
- **Learn:** PPE, hazard labels, safe handling principles, clean workspace, reporting spills, waste awareness, never tasting chemicals.
- **Play:** Inspect a virtual lab and identify hazards; choose a safe response to each scenario.
- **Challenge:** Prepare a virtual bench for a low-risk school demonstration.
- **Mastery:** Make safe choices and explain the reason. Do not teach hazardous real-world procedures.

### Level 1.7 — Boss: Restore the Discovery Core
- **Learn:** Review observations, matter, states, mixtures, measurement and safety.
- **Play:** Complete a multi-stage investigation: observe an unknown set of samples, record measurements, classify evidence, and select a safe method for further investigation.
- **Boss rule:** The player must explain choices; random guessing alone should not pass.
- **Unlock:** World 2 and the Field Journal.

---

## World 2 — Atomic Frontier
**Theme:** A vast, explorable particle universe where atoms are represented as interactive scientific models. The environment should make the invisible feel understandable without suggesting atoms literally look like the artistic environment.

**Story:** The player travels into the microscopic world to repair the Element Atlas and understand the building blocks of matter.

**World outcome:** The player understands atomic structure, ions, isotopes at an appropriate level, periodic-table organization, and basic electron arrangements.

### Level 2.1 — Inside the Atom
- **Learn:** Protons, neutrons, electrons; nucleus and electron regions; relative charge and relative mass.
- **Play:** Assemble a simple atom model and inspect each particle's role.
- **Challenge:** Identify which particle change affects charge, element identity, or isotope.
- **Mastery:** Describe the basic structure of an atom and its particles.

### Level 2.2 — Element Identity Lock
- **Learn:** Atomic number, proton count, mass number, neutral atoms.
- **Play:** Repair element cards by matching proton counts and labels.
- **Challenge:** Infer missing particle counts from a valid atomic description.
- **Mastery:** Use atomic number to identify an element and distinguish atomic number from mass number.

### Level 2.3 — Isotope Observatory
- **Learn:** Isotopes have the same proton number but different neutron numbers; introductory notation and uses.
- **Play:** Compare isotope models and sort them by element identity and mass number.
- **Challenge:** Explain why changing neutron count does not create a new element.
- **Mastery:** Identify isotopes and calculate neutron count from valid notation.

### Level 2.4 — Ions and the Charge Reactor
- **Learn:** Cations and anions; electron loss/gain; relationship between protons, electrons and net charge.
- **Play:** Adjust electron counts to stabilize a charge indicator.
- **Challenge:** Predict ion charge and write simple ion symbols.
- **Mastery:** Calculate charge from proton and electron counts.

### Level 2.5 — The Periodic Table Expedition
- **Learn:** Periods, groups, element symbols, metals, nonmetals, metalloids; broad table patterns.
- **Play:** Navigate an interactive table to locate elements and discover patterns.
- **Challenge:** Identify an element from clues and compare nearby elements.
- **Mastery:** Find elements efficiently and interpret table structure.

### Level 2.6 — Electron Shells and Patterns
- **Learn:** Introductory shell/electron arrangements suitable to the course level; valence electrons as a useful pattern; explain that shell diagrams are models.
- **Play:** Place electrons into simplified representations according to the curriculum's chosen rules.
- **Challenge:** Compare selected elements and predict simple ion formation.
- **Mastery:** Connect introductory electron arrangement to broad periodic trends without overgeneralizing.

### Level 2.7 — Boss: The Element Atlas
- **Learn:** Combine atomic structure, isotopes, ions and table navigation.
- **Play:** Restore a damaged atlas by solving particle-count puzzles and locating elements.
- **Boss rule:** At least one task requires explaining how the evidence supports the answer.
- **Unlock:** World 3 and the Atom Builder tool.

---

## World 3 — The Bonding Citadel
**Theme:** A molecular architecture world of bridges, lattices, crystal structures and reaction chambers. Atoms and bonds appear as scientific visualizations, not literal glowing fantasy particles.

**Story:** The citadel's structures are collapsing because its molecular blueprints are scrambled. The player learns how atoms combine and how chemical changes differ from physical changes.

**World outcome:** The player can explain simple bonding, construct basic molecules, interpret formulas, identify common reaction patterns, and balance simple equations.

### Level 3.1 — Why Atoms Combine
- **Learn:** Chemical bonding as interactions involving electrons; introductory stability models and their limitations.
- **Play:** Compare candidate combinations using simple, curriculum-appropriate rules.
- **Challenge:** Explain why a model is useful and where it is simplified.
- **Mastery:** Describe the basic purpose of chemical bonding without treating the octet rule as universal.

### Level 3.2 — Ionic Bridgeworks
- **Learn:** Electron transfer model, ions, ionic compounds, formula units and charge balance.
- **Play:** Build neutral ionic compounds by matching cation and anion charges.
- **Challenge:** Determine a simple compound formula from ion charges.
- **Mastery:** Use charge neutrality to construct formulas for selected ionic compounds.

### Level 3.3 — Covalent Architectures
- **Learn:** Shared electron pairs; single/double/triple bonds at introductory level; molecular versus network structures as appropriate.
- **Play:** Build reviewed simple molecules using atom and bond pieces.
- **Challenge:** Compare two valid structures and identify bond differences.
- **Mastery:** Interpret simple covalent structures and formulas.

### Level 3.4 — Shapes in Three Dimensions
- **Learn:** Basic molecular shape and electron-pair repulsion where appropriate; distinguish 2D drawings from 3D geometry.
- **Play:** Rotate models and predict approximate shapes for a curated set of simple molecules.
- **Challenge:** Match a formula/structure to a valid model and identify misleading depictions.
- **Mastery:** Recognize selected common molecular geometries at the taught level.

### Level 3.5 — Formula and Naming Forge
- **Learn:** Chemical symbols, subscripts, coefficients, common introductory nomenclature rules.
- **Play:** Assemble names and formulas from reviewed cards.
- **Challenge:** Translate between name, formula and a model for a bounded set of compounds.
- **Mastery:** Correctly interpret subscripts and coefficients and name selected compounds.

### Level 3.6 — Reaction Gate
- **Learn:** Reactants/products, conservation of atoms, physical versus chemical change, selected common reaction patterns.
- **Play:** Arrange reactants and products and count atoms on each side.
- **Challenge:** Balance simple equations by changing coefficients only.
- **Mastery:** Balance equations and explain conservation of atoms.

### Level 3.7 — Boss: Rebuild the Citadel
- **Learn:** Bonding, formulas, geometry, naming and equations.
- **Play:** Repair a series of molecular structures, identify compounds, and balance a final reaction.
- **Boss rule:** Formula and atom-count validation must be computed from the internal chemistry model.
- **Unlock:** World 4 and Molecule Studio basic mode.

---

## World 4 — The Quantitative Crucible
**Theme:** An elegant measurement and simulation complex with balances, particle counters, reaction tracks, graphs and data instruments.

**Story:** The Crucible's prediction engine is producing inconsistent results. The player learns to count particles, calculate quantities, use units, interpret energy changes and reason from evidence.

**World outcome:** The player builds quantitative chemistry foundations for school exams, JEE-style problem solving and engineering calculations.

### Level 4.1 — The Mole Bridge
- **Learn:** Mole as amount of substance, Avogadro constant, molar mass and particle counting.
- **Play:** Convert between particle collections, amount in moles and mass using guided instruments.
- **Challenge:** Solve progressively less-scaffolded conversions with units.
- **Mastery:** Choose and apply the correct conversion path.

### Level 4.2 — Equation-to-Quantity Engine
- **Learn:** Stoichiometric coefficients, mole ratios and limiting reagent at an introductory level.
- **Play:** Run a virtual reaction with adjustable reactant quantities and observe which reactant is exhausted first.
- **Challenge:** Solve a multi-step stoichiometry problem with units.
- **Mastery:** Use a balanced equation to relate reactant and product amounts.

### Level 4.3 — Solutions and Concentration Bay
- **Learn:** Solute, solvent, solution, concentration; molarity and dilution where relevant; units and significant figures.
- **Play:** Prepare a target concentration in a virtual volumetric setup.
- **Challenge:** Choose quantities and calculate a dilution result.
- **Mastery:** Calculate and interpret concentration in the taught units.

### Level 4.4 — Gas and Pressure Station
- **Learn:** Gas properties, pressure, temperature, volume, amount; ideal-gas model and its limits; relevant gas laws.
- **Play:** Manipulate a gas simulation and compare variable relationships.
- **Challenge:** Solve a guided gas-law problem with unit checks.
- **Mastery:** Select the correct relationship for a bounded problem and state assumptions.

### Level 4.5 — Energy Landscape
- **Learn:** Exothermic/endothermic changes, system and surroundings, enthalpy at the intended level, energy profile diagrams.
- **Play:** Compare reaction profiles and interpret heat-flow indicators.
- **Challenge:** Infer sign and meaning from a clearly defined energy diagram.
- **Mastery:** Explain energy transfer using the model taught.

### Level 4.6 — Equilibrium and Rate Control
- **Learn:** Reaction rate, collision model, catalysts, reversible reactions and dynamic equilibrium; introduce Le Chatelier's principle only at the relevant course level.
- **Play:** Change concentration, temperature or catalyst settings in safe simulations and record observations.
- **Challenge:** Predict a qualitative change and explain which model supports it.
- **Mastery:** Distinguish rate from equilibrium position and avoid common misconceptions.

### Level 4.7 — Boss: The Precision Trial
- **Learn:** Integrated unit conversions, stoichiometry, concentration, gas laws and energy/rate reasoning.
- **Play:** Complete a multi-stage simulated investigation with measurement uncertainty, calculation checks and evidence-based conclusions.
- **Boss rule:** Unit correctness and reasoning are assessed, not only final numeric answers.
- **Unlock:** World 5 and Advanced Challenge mode.

---

## World 5 — The Realm of Reactions
**Theme:** A large research world with separate but connected districts for physical chemistry, inorganic chemistry and organic chemistry. Keep the world readable; use district hubs rather than overcrowding one screen.

**Story:** A network of research stations needs the player to understand why reactions occur, how chemical systems behave, and how organic structures transform.

**World outcome:** The player develops broader school/advanced chemistry understanding, with selected advanced topics clearly tiered by prerequisites.

### Level 5.1 — Acid, Base and Indicator Garden
- **Learn:** Acid/base models appropriate to the course, pH, indicators, neutralization and safety principles.
- **Play:** Use virtual indicators and pH measurements to classify curated solutions.
- **Challenge:** Interpret a pH value and choose a suitable indicator for a defined task.
- **Mastery:** Explain acid/base behavior using the model taught and interpret pH carefully.

### Level 5.2 — Redox Power Plant
- **Learn:** Oxidation/reduction, electron transfer, oxidation numbers, oxidizing/reducing agents; electrochemical concepts introduced progressively.
- **Play:** Track electron movement in reviewed redox examples.
- **Challenge:** Identify oxidation/reduction changes and balance selected equations at the appropriate level.
- **Mastery:** Justify redox classification using evidence.

### Level 5.3 — Periodic Trend Observatory
- **Learn:** Atomic/ionic radius, ionization energy, electronegativity and other curriculum-selected trends; exceptions and model limitations.
- **Play:** Compare elements and use data visualizations to discover trends.
- **Challenge:** Explain a trend using structure and evidence rather than memorized arrows alone.
- **Mastery:** Interpret selected trends and recognize exceptions when taught.

### Level 5.4 — Organic Structure Workshop
- **Learn:** Carbon bonding, functional groups, structural formulas, isomerism foundations, homologous series and naming at the chosen level.
- **Play:** Assemble structures from validated fragments and classify functional groups.
- **Challenge:** Match a structure to a formula/name and identify a valid isomer pair.
- **Mastery:** Read basic organic structures and classify common functional groups.

### Level 5.5 — Organic Reaction Routes
- **Learn:** Reaction families and mechanisms appropriate to the syllabus; distinguish conditions, reagents, products and selectivity.
- **Play:** Build a reaction pathway from a curated set of steps and predict products for reviewed examples.
- **Challenge:** Choose a plausible route and explain the transformation.
- **Mastery:** Solve syllabus-appropriate reaction mapping without relying only on memorized color cues.

### Level 5.6 — Electrochemistry and Cells
- **Learn:** Electrodes, oxidation/reduction at electrodes, cell notation and potential concepts as appropriate; connect to batteries and corrosion.
- **Play:** Assemble a virtual electrochemical cell and trace electron/ion movement.
- **Challenge:** Interpret a simple cell diagram and predict electrode processes using the taught conventions.
- **Mastery:** Explain how chemical change can produce electrical energy and vice versa.

### Level 5.7 — Boss: The Reaction Nexus
- **Learn:** Integrate acids/bases, redox, periodic trends, organic structures and electrochemistry.
- **Play:** Investigate a fictional research incident using clues, data and several possible chemical explanations.
- **Boss rule:** Require evidence-supported reasoning and allow alternative valid explanations when chemistry permits.
- **Unlock:** World 6 and the advanced reaction notebook.

---

## World 6 — The Analytical Labyrinth
**Theme:** A realistic analytical laboratory with instrument rooms, sample-preparation benches, measurement stations, data plots and a digital lab notebook.

**Story:** The city’s water and material-testing network is returning conflicting reports. The player must learn how scientists measure, calibrate, analyze uncertainty and document reproducible results.

**World outcome:** The player gains analytical chemistry and practical laboratory reasoning that bridges classroom chemistry and engineering laboratory work.

### Level 6.1 — Instruments and Calibration
- **Learn:** Instrument purpose, calibration, blank/sample distinction, resolution, accuracy, precision and sources of error.
- **Play:** Select an appropriate instrument for a defined measurement and calibrate a simulated scale.
- **Challenge:** Diagnose a measurement problem from a data set.
- **Mastery:** Explain why calibration and repeat measurements matter.

### Level 6.2 — Titration Control Room
- **Learn:** Titration purpose, burette/pipette/volumetric flask use, endpoint versus equivalence point, indicator choice and calculation workflow.
- **Play:** Run a guided virtual titration, record readings, repeat trials and calculate an unknown concentration.
- **Challenge:** Identify a poor technique from a simulated observation log.
- **Mastery:** Complete a reviewed titration workflow and calculation with units.
- **Source check:** The exact method, reactions and calculation rules must match the applicable curriculum/manual.

### Level 6.3 — Spectroscopy Signal Vault
- **Learn:** What spectroscopy measures at an introductory level; absorbance/transmittance or other methods only as appropriate; calibration curves and limits.
- **Play:** Read a simulated instrument output and construct/interpret a calibration plot.
- **Challenge:** Estimate an unknown from a valid calibration model and recognize out-of-range results.
- **Mastery:** Interpret instrument data without claiming more precision than the data support.

### Level 6.4 — Chromatography Crossing
- **Learn:** Separation principles, stationary/mobile phases, retention and chromatograms; use only concepts supported by the chosen syllabus.
- **Play:** Separate a virtual mixture and compare chromatogram patterns.
- **Challenge:** Match a sample to evidence and explain limits of identification.
- **Mastery:** Explain separation and interpret a simple chromatogram.

### Level 6.5 — Water Quality Investigation
- **Learn:** Sample collection concepts, pH, hardness, conductivity, dissolved species and relevant water-quality measures.
- **Play:** Analyze simulated samples, compare measurements and identify which test answers the investigation question.
- **Challenge:** Prepare a concise evidence-based report.
- **Mastery:** Distinguish measured results from assumptions and choose relevant tests.
- **Safety:** Clearly label simulated data and avoid implying that game readings certify real drinking-water safety.

### Level 6.6 — Error, Uncertainty and Lab Reports
- **Learn:** Significant figures, repeatability, systematic/random error at the intended level, data tables, graphs, uncertainty language and scientific reporting.
- **Play:** Find inconsistencies in a lab notebook and improve a report.
- **Challenge:** Choose the strongest conclusion supported by a noisy data set.
- **Mastery:** Produce a reproducible, honest report with limitations stated.

### Level 6.7 — Boss: The Evidence Tribunal
- **Learn:** Instrument choice, calibration, titration/spectroscopy/chromatography concepts, data analysis and reporting.
- **Play:** Solve a sample-identity or quality-control mystery using a series of simulated measurements.
- **Boss rule:** The player must cite evidence from the simulated data and acknowledge uncertainty.
- **Unlock:** World 7 and Advanced Virtual Lab.

---

## World 7 — The Engineering Frontier
**Theme:** A sophisticated engineering campus with materials labs, electrochemical stations, corrosion chambers, polymer workshops, fuels/energy displays and industrial process simulators.

**Story:** The campus has been asked to solve a set of materials, energy and process challenges. The player must apply chemistry to practical engineering decisions, compare trade-offs and document results.

**World outcome:** The player connects chemistry to engineering applications and works through practicals mapped to the user's actual engineering chemistry syllabus and laboratory manual.

**Important curriculum rule:** Engineering chemistry varies by institution and course. Treat the topics below as a proposed framework, then map them to the actual supplied syllabus. Reorder, rename, replace or split levels when needed. Do not claim exact syllabus coverage until mapping is complete.

### Level 7.1 — Materials and Crystal Lab
- **Learn:** Material classes, bonding/property relationships, crystal structures or defects only to the required syllabus depth, mechanical/thermal/chemical properties.
- **Play:** Compare material cards and choose materials for a defined application using evidence.
- **Challenge:** Explain a materials choice and its limitations.
- **Mastery:** Link selected material properties to engineering use cases.

### Level 7.2 — Corrosion Defense Station
- **Learn:** Corrosion as an electrochemical process, influencing factors, prevention strategies, coatings/cathodic protection where relevant.
- **Play:** Investigate simulated corrosion under controlled conditions and compare protection methods.
- **Challenge:** Recommend a protection strategy for a defined environment.
- **Mastery:** Explain the mechanism at the taught level and justify a prevention method.

### Level 7.3 — Polymers and Smart Materials
- **Learn:** Monomers/polymers, polymerization types where relevant, structure-property relationships, selected advanced materials and environmental considerations.
- **Play:** Build polymer chains from validated repeating units and compare material properties.
- **Challenge:** Select a polymer/material for a specific application with trade-offs.
- **Mastery:** Connect structure, processing and properties at the required level.

### Level 7.4 — Fuels, Energy and Combustion
- **Learn:** Fuel properties, calorific value, combustion, energy efficiency and relevant alternative energy systems according to the syllabus.
- **Play:** Compare simulated fuel data and energy-system options.
- **Challenge:** Calculate or compare energy values using verified equations and units.
- **Mastery:** Explain a defensible energy choice and its trade-offs.

### Level 7.5 — Water Treatment and Industrial Analysis
- **Learn:** Water treatment, hardness/softening, boiler-water problems, desalination or treatment methods as specified by the course.
- **Play:** Diagnose a simulated process problem from water-quality data and choose a treatment route.
- **Challenge:** Compare treatment options for performance, constraints and waste.
- **Mastery:** Explain the chosen method and recognize operational limitations.

### Level 7.6 — Engineering Chemistry Practical
- **Learn:** One practical selected from the actual laboratory manual, with theory, apparatus, observations, calculations, result, viva practice and safety notes.
- **Play:** Run the full virtual practical with realistic equipment interactions and a lab notebook.
- **Challenge:** Interpret results and troubleshoot a simulated procedural or measurement error.
- **Mastery:** Complete the practical and report with reproducible calculations.
- **Implementation requirement:** Before coding this level, create a source mapping entry containing manual filename/page, exact experiment title, verified method, formula, units, safety notes and reviewer status.

### Level 7.7 — Boss: The Engineering Design Review
- **Learn:** Integrate materials, corrosion, polymers, energy and a manual-mapped practical.
- **Play:** Solve a realistic fictional engineering brief with constraints such as cost, durability, energy, safety and environmental impact.
- **Boss rule:** Multiple solutions may be valid. Score the quality of reasoning, evidence use and recognition of trade-offs.
- **Unlock:** World 8 and the Engineering Portfolio.

---

## World 8 — The Alchemist's Future
**Theme:** A high-tech sustainable industrial region linking research, computational chemistry, process engineering, environmental monitoring and a final capstone lab. It should feel like the culmination of the journey rather than magical pseudo-science.

**Story:** A network of connected industries faces a resource and sustainability challenge. The player combines chemistry knowledge, data interpretation and engineering judgment to design a safer, more efficient system.

**World outcome:** The player applies chemistry across systems, understands model limitations, explores sustainability, and completes a capstone project.

### Level 8.1 — Process Flow Architect
- **Learn:** Process diagrams, inputs/outputs, mass balance at an appropriate level, unit operations versus chemical reactions, process constraints.
- **Play:** Assemble a simple process flow from validated unit-operation blocks.
- **Challenge:** Find a mass-balance inconsistency or missing stream in a simplified diagram.
- **Mastery:** Explain how materials move through a process and identify missing information.

### Level 8.2 — Computational Chemistry Observatory
- **Learn:** Molecular visualization, structural representations, model assumptions, simulation versus experiment, data provenance.
- **Play:** Compare validated molecular structures and inspect geometry or simple descriptors from a documented toolkit.
- **Challenge:** Identify what a visualization can and cannot prove.
- **Mastery:** Interpret a model cautiously and distinguish calculated, looked-up and illustrative values.
- **Scientific limitation:** Do not imply accurate quantum chemistry unless a validated computational engine actually performs it.

### Level 8.3 — Green Chemistry Challenge
- **Learn:** Waste prevention, atom economy or other relevant metrics, safer alternatives, resource efficiency, life-cycle thinking at the intended level.
- **Play:** Compare alternative process cards using transparent metrics and trade-offs.
- **Challenge:** Recommend a route and justify the choice with evidence.
- **Mastery:** Explain why sustainability is multi-factorial rather than a single “green” score.

### Level 8.4 — Industrial Process Optimization
- **Learn:** Yield, selectivity, rate, energy use, separation, safety and economic/environmental constraints appropriate to the course.
- **Play:** Adjust a simplified process simulator and compare outcomes under constraints.
- **Challenge:** Optimize a process while respecting explicit safety and operating limits.
- **Mastery:** Explain the trade-offs and show which metrics improved or worsened.

### Level 8.5 — Environmental Forensics
- **Learn:** Sampling, contaminants, measurement uncertainty, evidence chains, treatment choices and environmental impact.
- **Play:** Analyze a fictional environmental incident using simulated data from several instruments.
- **Challenge:** Form a defensible hypothesis and identify what additional evidence is needed.
- **Mastery:** Distinguish evidence, uncertainty and speculation.

### Level 8.6 — Capstone: Design a Better System
- **Learn:** Integrate the player's strongest concepts from the earlier worlds.
- **Play:** Choose a challenge track—materials durability, water treatment, energy, analytical quality control, or sustainable process design—and create a solution using available tools.
- **Challenge:** Submit a short report containing objectives, assumptions, data, calculations, trade-offs and limitations.
- **Mastery:** Use a transparent rubric for scientific correctness, evidence, reasoning, safety and communication.
- **Accessibility:** Offer a guided route and a more open-ended route.

### Level 8.7 — Final Boss: The Alche-Me Council
- **Learn:** Review and apply knowledge from all eight worlds.
- **Play:** Complete a multi-stage mission with a knowledge puzzle, a data interpretation task, a virtual lab segment and a final design decision.
- **Boss rule:** The final challenge assesses application and reasoning across topics; it should not depend on obscure trivia.
- **Reward:** Alche-Me Master Chemist badge, a completed learning portfolio, and optional advanced mission access.
- **Endgame:** The player can replay worlds, improve mastery, complete additional manual-mapped practicals and attempt timed exam simulations.

---

# Recommended side systems

## Field Journal
Store discoveries, formulas, selected worked examples, experiment records, common mistakes and reviewed source links. The journal should be searchable and should distinguish curriculum facts from player-entered notes.

## Daily quests
Examples: identify five elements, fix two equation balances, review a weak concept, interpret a graph, or complete a short safety scenario. Daily quests must not become a barrier to core learning.

## Mastery map
Show mastered, developing and needs-review concepts. Make the next recommended activity transparent. Do not use a single XP total as a substitute for actual understanding.

## Boss challenge design
Each boss should combine at least three previously taught concepts and include an explanation step. Provide retry, hints and targeted practice. Do not punish a learner permanently for a wrong answer.

## Optional exam mode
After core levels are stable, provide configurable timed practice with reviewed question banks, clear scoring, solution explanations and performance by topic. Do not claim official exam alignment until the question bank has been checked against the relevant syllabus.

# Content and asset production workflow

For every world:
1. Approve the world brief and curriculum map.
2. Review prerequisites and progression order.
3. Create a list of screens, activities, reusable mechanics and required assets.
4. Generate world background concepts separately from production UI.
5. Obtain licensed 3D models or build optimized procedural geometry for interactive objects.
6. Verify every chemistry diagram, structure, formula and label.
7. Implement one level end-to-end.
8. Test with learners or a reviewer; revise difficulty and instructions.
9. Only then expand the remaining levels.

## Asset guidance

- World backgrounds: optimized WebP/AVIF or other supported image formats, with separate desktop/mobile crops where needed.
- Interactive lab equipment: optimized GLB/glTF models or procedural geometry; images alone are not interactive objects.
- Molecules: validated structure data plus runtime 3D rendering; do not use concept art as chemistry data.
- UI: implement real controls with React and accessible semantics; do not use screenshots as the interface.
- Icons: prefer a consistent licensed SVG icon set.
- Store source/license/attribution information in `public/assets/manifests/asset-manifest.csv`.
- Do not add hundreds of unused assets before the corresponding features exist.

# Suggested implementation sequence

1. **Curriculum schema and world map:** create the typed world/level definitions and show all 8 worlds with clear progression states.
2. **Vertical slice:** implement World 1, Level 1.1 end-to-end, including lesson, activity, feedback, assessment, reward and save.
3. **Reusable activity engine:** implement a few reusable activity types (classification, assembly, calculation, graph/data interpretation, simulation and scenario).
4. **World 1 completion:** add all seven levels and the mastery boss with reviewed content.
5. **Worlds 2–4:** add atomic structure, bonding and quantitative foundations in prerequisite order.
6. **Worlds 5–6:** add broader chemistry and analytical-lab reasoning.
7. **World 7:** map engineering content to the actual syllabus/manual before implementing practicals.
8. **World 8:** add systems thinking, sustainability and capstone.
9. **Quality pass:** test mobile/touch, keyboard accessibility, reduced motion, performance, data correctness and save recovery.
10. **Expansion:** add optional leaderboards, timed exam simulations, new mission packs or multiplayer only after costs, privacy, moderation and architecture have been reviewed.

# Final coding-agent report

At the end of each implementation task, report:
- worlds/levels actually implemented;
- curriculum items still planned or blocked;
- content sources and review status;
- files added/changed;
- activities and tests added;
- test/build commands and exact results;
- responsive/accessibility checks performed;
- assets added and license status;
- known limitations and next recommended step.

Never claim all 56 levels are complete merely because level cards appear on a world map. A level is implemented only when its content, activity, feedback, assessment, progression behavior and verification are functional.
"""
out.write_text(content, encoding="utf-8")
print(f"Created: {out}")
print(f"Size: {out.stat().st_size:,} bytes")
