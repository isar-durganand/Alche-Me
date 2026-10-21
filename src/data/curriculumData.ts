/**
 * Alche-Me — Master Curriculum & 8 Scientific Worlds
 * 56-Level Curriculum conforming to:
 * - level & worlds description.md (World Design & 56-Level Curriculum)
 * - docs/Alche-Me_Master_Specification.md (Section 6 & Section 9)
 * - MRIIRS Engineering Chemistry Syllabus (4.5CH101C00H)
 */

import { WorldSchema, LevelSchema } from '../domain/types/curriculum';

export type CurriculumWorld = WorldSchema;
export type CurriculumLevel = LevelSchema;

export const CURRICULUM_WORLDS: WorldSchema[] = [
  // =========================================================================
  // WORLD 1 — THE SPARK OF DISCOVERY
  // =========================================================================
  {
    id: 'world-1-discovery',
    num: 1,
    title: 'The Spark of Discovery',
    theme: 'Welcoming discovery campus, hands-on science garden, beginner laboratory',
    story: 'The campus Discovery Core has lost its scientific records. The player restores it by learning how to observe matter, classify materials, measure carefully, and think like a scientist.',
    worldOutcome: 'Understands what chemistry studies, recognizes matter and its states, distinguishes observations from explanations, and uses basic laboratory safety and measurement tools.',
    thumbnail: '/assets/worlds/world-1.png',
    levels: [
      {
        id: 'lvl-1-1',
        worldId: 'world-1-discovery',
        order: 1,
        title: 'Welcome, Explorer! (Observation vs Inference)',
        shortDescription: 'Inspect everyday laboratory phenomena and master the fundamental scientific distinction between direct observations and explanatory inferences.',
        difficulty: 'beginner',
        prerequisiteLevelIds: [],
        learningObjectives: [
          'Distinguish between a direct physical observation (seen or measured) and an explanatory inference (hypothesis or deduction).',
          'Identify observable properties of matter (color, state, temperature, mass) without making unsubstantiated assumptions about chemical purity.',
          'Formulate a testable scientific question grounded in physical empirical evidence.'
        ],
        keyConcepts: [
          'Direct Observation',
          'Inference & Hypothesis',
          'Empirical Evidence',
          'Scientific Method',
          'Verifiable Measurement'
        ],
        lessonSections: [
          {
            id: 'sec-1-1-1',
            title: '1. What Chemistry Investigates',
            content: 'Chemistry is the scientific study of matter—anything that occupies space and has mass—and the transformations it undergoes when conditions change or substances combine. Before writing equations or using advanced instruments, every chemist must begin with accurate observation.',
            keyTakeaways: [
              'Matter is anything that has mass and occupies physical volume.',
              'Chemical investigations always begin with observable phenomena.',
              'Observations form the empirical foundation upon which all scientific theories are constructed.'
            ]
          },
          {
            id: 'sec-1-1-2',
            title: '2. Direct Observation vs. Explanatory Inference',
            content: 'A Direct Observation is objective information obtained directly through the senses or verified laboratory instruments (e.g., "The liquid turns violet", "The balance displays 14.850 g").\n\nAn Inference is a logical deduction, interpretation, or explanation of what caused that observation (e.g., "A chemical reaction formed iodine", "The powder is table salt"). An inference may be correct, but it requires experimental verification.',
            keyTakeaways: [
              'Direct Observation: Directly seen, heard, felt, or measured with calibrated tools.',
              'Inference: A deduction or explanation of *why* an observation occurred.',
              'Never confuse an inference with physical evidence; treating assumptions as facts leads to laboratory errors.'
            ]
          },
          {
            id: 'sec-1-1-3',
            title: '3. Formulating Testable Hypotheses',
            content: 'A testable question can be verified or falsified by conducting an experiment and recording measurable data. Non-testable questions depend on personal preference, opinions, or unmeasurable claims.',
            keyTakeaways: [
              'Testable: "Does increasing water temperature increase the mass of copper sulfate that dissolves in 100 mL?"',
              'Non-testable: "Is copper sulfate prettier than potassium permanganate?"'
            ]
          }
        ],
        activityType: 'observation_classification',
        activityInstructions: 'Drag or click each laboratory evidence card into either "Direct Observation" or "Explanatory Inference". Inspect the reasoning provided for each scenario.',
        activityConfig: {
          type: 'observation_classification',
          instruction: 'Classify each statement from the 4 laboratory investigation stations.',
          categories: [
            {
              id: 'direct_observation',
              label: 'Direct Observation',
              description: 'Directly seen, heard, or measured by calibrated instruments without assumptions.',
              color: 'teal'
            },
            {
              id: 'inference',
              label: 'Explanatory Inference',
              description: 'A deduction, explanation, hypothesis, or assumption about causes or identity.',
              color: 'amber'
            }
          ],
          items: [
            {
              id: 'item-1',
              text: 'The glass beaker contains blue liquid with dense gas bubbles rising to the surface.',
              category: 'direct_observation',
              explanation: 'Direct Observation: The color (blue) and visual action (bubbles rising) are directly witnessed with the eyes without inferring the chemical identity of the gas.',
              hint: 'Ask yourself: Can you see this with your eyes right now?'
            },
            {
              id: 'item-2',
              text: 'A spontaneous single displacement reaction is producing hydrogen gas in the beaker.',
              category: 'inference',
              explanation: 'Explanatory Inference: Identifying the bubbles specifically as "hydrogen gas" from a "single displacement reaction" is an explanation that requires analytical testing (e.g., a pop test).',
              hint: 'Do bubbles automatically prove hydrogen gas, or could it be boiling or another gas?'
            },
            {
              id: 'item-3',
              text: 'The calibrated digital balance display stabilizes at exactly 14.850 grams.',
              category: 'direct_observation',
              explanation: 'Direct Observation: The digital readout of an analytical instrument is an objective numerical measurement.',
              hint: 'Numbers read directly from an instrument display are measurements.'
            },
            {
              id: 'item-4',
              text: 'The white powder on the balance pan is reagent-grade sodium chloride.',
              category: 'inference',
              explanation: 'Explanatory Inference: Many white chemical powders look identical (e.g., sugar, starch, sodium bicarbonate). Claiming it is sodium chloride without chemical analysis is an inference.',
              hint: 'Can you prove chemical formula by white color alone?'
            },
            {
              id: 'item-5',
              text: 'The digital thermocouple probe submerged in the solution displays 85.0 °C.',
              category: 'direct_observation',
              explanation: 'Direct Observation: Temperature read from a calibrated thermocouple is an objective instrument observation.',
              hint: 'The readout directly displays the temperature.'
            },
            {
              id: 'item-6',
              text: 'The solution is near boiling because it was heated over a flame for 3 minutes.',
              category: 'inference',
              explanation: 'Explanatory Inference: Assuming boiling point and historical heating duration without knowing atmospheric pressure or boiling point is an explanatory deduction.',
              hint: 'This explains *why* the temperature was reached, which is an inference.'
            },
            {
              id: 'item-7',
              text: 'The metallic coupon shows distinct green and reddish-brown patches on its surface.',
              category: 'direct_observation',
              explanation: 'Direct Observation: The visual surface coloration (green and reddish-brown) is directly observed.',
              hint: 'Colors and surface patterns are visual observations.'
            },
            {
              id: 'item-8',
              text: 'The metal coupon corroded due to airborne chloride ions from coastal sea spray.',
              category: 'inference',
              explanation: 'Explanatory Inference: Attributing the corrosion specifically to coastal sea spray chlorides is an environmental hypothesis that requires chemical assay verification.',
              hint: 'Attributing the source of damage is a hypothesis.'
            }
          ]
        },
        assessment: {
          id: 'assess-1-1',
          title: 'Mastery Assessment: Empirical Observations & Deductive Rigor',
          instructions: 'Answer all 4 questions correctly to demonstrate scientific observation mastery.',
          questions: [
            {
              id: 'q-1-1-1',
              question: 'A student heats clear liquid in a test tube. Which of the following is a DIRECT OBSERVATION rather than an inference?',
              options: [
                {
                  text: 'The liquid is boiling because water boils at 100 °C.',
                  isCorrect: false,
                  rationale: 'Assuming the liquid is water and explaining boiling behavior is an inference.'
                },
                {
                  text: 'The liquid volume decreased and white vapour emerged from the tube mouth.',
                  isCorrect: true,
                  rationale: 'Volume decrease and white vapour are directly visible physical occurrences.'
                },
                {
                  text: 'The liquid molecules gained kinetic energy and broke hydrogen bonds.',
                  isCorrect: false,
                  rationale: 'Molecular kinetic energy and bond breaking are submicroscopic theoretical models, not direct visual observations.'
                },
                {
                  text: 'A physical phase change occurred from liquid to gas.',
                  isCorrect: false,
                  rationale: 'Classifying the process as a physical phase change is a theoretical classification.'
                }
              ],
              explanation: 'Direct observations must be confined to observable sensory or measured data (volume drop, visible vapour) without theoretical interpretations.'
            },
            {
              id: 'q-1-1-2',
              question: 'Why is it considered a serious scientific mistake to record "0.5 g of sodium chloride formed" instead of "0.5 g of white crystalline solid was collected"?',
              options: [
                {
                  text: 'Analytical balances can only measure in milligrams, not grams.',
                  isCorrect: false,
                  rationale: 'Balances can display in grams; that is not the issue.'
                },
                {
                  text: 'White crystals might be an unreacted starting reagent, a side-product, or an impure mixture rather than pure sodium chloride.',
                  isCorrect: true,
                  rationale: 'Color and solid state do not confirm chemical purity or identity without analytical verification.'
                },
                {
                  text: 'Sodium chloride can only exist in liquid solution form.',
                  isCorrect: false,
                  rationale: 'Sodium chloride exists as a solid ionic crystal at standard conditions.'
                },
                {
                  text: 'Chemical names must always be written in Latin in notebooks.',
                  isCorrect: false,
                  rationale: 'There is no requirement to write names in Latin.'
                }
              ],
              explanation: 'Until spectroscopic, melting-point, or chemical confirmation is complete, the substance should be documented by its physical description to prevent confirmation bias.'
            },
            {
              id: 'q-1-1-3',
              question: 'Which of the following represents a scientifically TESTABLE question?',
              options: [
                {
                  text: 'Is iron a more respectable metal than copper?',
                  isCorrect: false,
                  rationale: '"Respectable" is an opinion and cannot be measured.'
                },
                {
                  text: 'Does an iron nail gain mass when submerged in 5% NaCl solution for 7 days compared to dry air?',
                  isCorrect: true,
                  rationale: 'This question defines measurable variables (mass, immersion, time, concentration) that can be verified experimentally.'
                },
                {
                  text: 'Why does nature prefer crystalline structures over amorphous states?',
                  isCorrect: false,
                  rationale: 'Attributing preference or intent to nature is philosophical rather than directly testable.'
                },
                {
                  text: 'Will copper become obsolete in future electrical engineering?',
                  isCorrect: false,
                  rationale: 'Future technological obsolescence is an economic prediction, not a laboratory chemistry question.'
                }
              ],
              explanation: 'A testable question specifies an independent variable (immersion condition) and a measurable dependent variable (mass change over 7 days).'
            },
            {
              id: 'q-1-1-4',
              question: 'A scientist notices that adding zinc granules to dilute hydrochloric acid causes the container to feel warm. What is the correct scientific synthesis?',
              options: [
                {
                  text: 'Observation: Container temperature rose; Inference: The reaction released thermal energy (exothermic).',
                  isCorrect: true,
                  rationale: 'The sensory/measured temperature increase is the observation; explaining it as exothermic reaction energy is the valid inference.'
                },
                {
                  text: 'Observation: Exothermic reaction; Inference: Container got warm.',
                  isCorrect: false,
                  rationale: 'This reverses observation and inference.'
                },
                {
                  text: 'Both the warmth and the exothermic nature are direct observations.',
                  isCorrect: false,
                  rationale: 'The term "exothermic" is a thermodynamic classification, not a sensory observation.'
                },
                {
                  text: 'Neither is valid because zinc cannot react with hydrochloric acid.',
                  isCorrect: false,
                  rationale: 'Zinc readily reacts with hydrochloric acid to form zinc chloride and hydrogen gas.'
                }
              ],
              explanation: 'Observation is what is physically detected (warmth / temperature rise); inference is the theoretical thermodynamic deduction (exothermic reaction).'
            }
          ]
        },
        scoringRules: {
          activityWeight: 0.5,
          assessmentWeight: 0.5,
          masteryThreshold: 80,
          passingThreshold: 60
        },
        masteryThreshold: 80,
        estimatedMinutes: 6,
        rewards: {
          xp: 100,
          badgeId: 'badge-curious-observer',
          badgeTitle: 'Curious Observer',
          unlockedToolId: 'field-journal',
          unlockedToolTitle: 'Scholar Field Journal'
        },
        unlocks: ['lvl-1-2'],
        contentSources: [
          {
            id: 'openstax-chem-ch1',
            title: 'Chemistry 2e: Chapter 1 (Essential Ideas)',
            publisherOrInstitution: 'OpenStax / Rice University',
            editionOrStandard: '2nd Edition (2020)',
            verifiedBy: 'Alche-Me Curriculum Review Board',
            verifiedDate: '2026-03-15'
          },
          {
            id: 'iupac-gold-book',
            title: 'Compendium of Chemical Terminology',
            publisherOrInstitution: 'IUPAC',
            editionOrStandard: 'Version 2.3.3',
            verifiedBy: 'Lead Chemistry Architect',
            verifiedDate: '2026-03-10'
          }
        ],
        reviewStatus: 'reviewed',
        implementationStatus: 'fully_implemented',
        accessibilityNotes: 'All cards are fully keyboard-navigable with tab index and click-toggle fallback for screen-reader and touch users.',
        localizationKeys: {
          title: 'level_1_1_title',
          summary: 'level_1_1_summary'
        }
      },
      {
        id: 'lvl-1-2',
        worldId: 'world-1-discovery',
        order: 2,
        title: 'The Matter Museum (Physical Properties & Classification)',
        shortDescription: 'Explore the museum vault and classify objects by mass, volume, density, and physical properties vs chemical materials.',
        difficulty: 'beginner',
        prerequisiteLevelIds: ['lvl-1-1'],
        learningObjectives: [
          'Define matter as anything possessing mass and occupying volume.',
          'Differentiate between physical properties (color, melting point, density) and chemical properties.',
          'Distinguish objects from the materials of which they are composed.'
        ],
        keyConcepts: ['Mass', 'Volume', 'Density', 'Physical Properties', 'Materials'],
        lessonSections: [],
        activityType: 'observation_classification',
        activityInstructions: 'Categorize museum samples by observable physical properties and calculate relative density.',
        assessment: { id: 'assess-1-2', title: 'Matter Museum Check', instructions: '', questions: [] },
        scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 },
        masteryThreshold: 80,
        estimatedMinutes: 6,
        rewards: { xp: 100, badgeId: 'badge-materials-scout', badgeTitle: 'Materials Scout' },
        unlocks: ['lvl-1-3'],
        contentSources: [{ id: 'ncert-chem-9', title: 'Matter in Our Surroundings', publisherOrInstitution: 'NCERT' }],
        reviewStatus: 'draft',
        implementationStatus: 'planned',
        accessibilityNotes: 'Screen reader accessible.',
        localizationKeys: {}
      },
      {
        id: 'lvl-1-3',
        worldId: 'world-1-discovery',
        order: 3,
        title: 'Three States, One World (Particulate Model)',
        shortDescription: 'Investigate solids, liquids, and gases using a particle-view simulator showing spacing, kinetic energy, and intermolecular forces.',
        difficulty: 'beginner',
        prerequisiteLevelIds: ['lvl-1-2'],
        learningObjectives: [
          'Describe the three common states of matter using the particle kinetic model.',
          'Explain why gases are compressible while solids and liquids possess fixed volumes.',
          'Predict thermal phase transitions (melting, vaporization, condensation, freezing).'
        ],
        keyConcepts: ['Solid', 'Liquid', 'Gas', 'Particle Spacing', 'Kinetic Energy'],
        lessonSections: [],
        activityType: 'simulation',
        activityInstructions: 'Adjust temperature and pressure sliders to watch phase transitions in real time.',
        assessment: { id: 'assess-1-3', title: 'Particulate Model Assessment', instructions: '', questions: [] },
        scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 },
        masteryThreshold: 80,
        estimatedMinutes: 7,
        rewards: { xp: 120 },
        unlocks: ['lvl-1-4'],
        contentSources: [{ id: 'openstax-chem-ch10', title: 'States of Matter', publisherOrInstitution: 'OpenStax' }],
        reviewStatus: 'draft',
        implementationStatus: 'planned',
        accessibilityNotes: 'Slider controls with numerical inputs for accessibility.',
        localizationKeys: {}
      },
      {
        id: 'lvl-1-4',
        worldId: 'world-1-discovery',
        order: 4,
        title: 'The Mystery of Mixing (Homogeneous vs Heterogeneous)',
        shortDescription: 'Mix virtual laboratory reagents to distinguish pure substances, solutions, suspensions, and colloids.',
        difficulty: 'beginner',
        prerequisiteLevelIds: ['lvl-1-3'],
        learningObjectives: [
          'Distinguish pure substances (elements, compounds) from mixtures.',
          'Differentiate homogeneous mixtures (solutions) from heterogeneous mixtures.',
          'Identify Tyndall effect scattering in colloidal dispersions.'
        ],
        keyConcepts: ['Pure Substance', 'Mixture', 'Homogeneous', 'Heterogeneous', 'Tyndall Effect'],
        lessonSections: [],
        activityType: 'observation_classification',
        activityInstructions: 'Mix substances and test light beam scattering to classify mixtures.',
        assessment: { id: 'assess-1-4', title: 'Mixture Classification Check', instructions: '', questions: [] },
        scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 },
        masteryThreshold: 80,
        estimatedMinutes: 6,
        rewards: { xp: 120 },
        unlocks: ['lvl-1-5'],
        contentSources: [{ id: 'openstax-chem-ch1', title: 'Classification of Matter', publisherOrInstitution: 'OpenStax' }],
        reviewStatus: 'draft',
        implementationStatus: 'planned',
        accessibilityNotes: 'High-contrast indicators for beam scattering.',
        localizationKeys: {}
      },
      {
        id: 'lvl-1-5',
        worldId: 'world-1-discovery',
        order: 5,
        title: 'The Measurement Workshop (SI Units & Meniscus Reading)',
        shortDescription: 'Master volumetric pipettes, burettes, analytical balances, and correct meniscus scale reading without parallax error.',
        difficulty: 'beginner',
        prerequisiteLevelIds: ['lvl-1-4'],
        learningObjectives: [
          'Identify standard SI units for mass (kg/g), volume (L/mL), temperature (K/°C), and pressure (Pa/kPa).',
          'Read liquid volume accurately at the bottom of the concave meniscus.',
          'Distinguish precision (reproducibility) from accuracy (closeness to true value).'
        ],
        keyConcepts: ['SI Units', 'Meniscus', 'Parallax Error', 'Accuracy', 'Precision'],
        lessonSections: [],
        activityType: 'data_analysis',
        activityInstructions: 'Align the virtual eye level with the calibration mark on a burette and pipette.',
        assessment: { id: 'assess-1-5', title: 'Volumetric Precision Check', instructions: '', questions: [] },
        scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 },
        masteryThreshold: 80,
        estimatedMinutes: 8,
        rewards: { xp: 130 },
        unlocks: ['lvl-1-6'],
        contentSources: [{ id: 'mriirs-lab-manual', title: 'Volumetric Apparatus Calibration', publisherOrInstitution: 'MRIIRS' }],
        reviewStatus: 'draft',
        implementationStatus: 'planned',
        accessibilityNotes: 'Arrow keys control eye height with precise readout.',
        localizationKeys: {}
      },
      {
        id: 'lvl-1-6',
        worldId: 'world-1-discovery',
        order: 6,
        title: 'The Safe Lab Code (GHS Pictograms & Acid Dilution)',
        shortDescription: 'Learn personal protective equipment (PPE), GHS hazard pictograms, and the exothermic acid dilution golden rule.',
        difficulty: 'beginner',
        prerequisiteLevelIds: ['lvl-1-5'],
        learningObjectives: [
          'Recognize mandatory PPE: splash goggles, lab coat, nitrile gloves, closed footwear.',
          'Interpret GHS pictograms: Flammable, Corrosive, Toxic, Oxidizer, Health Hazard.',
          'State and explain the acid dilution rule: Always add acid to water slowly down the side with continuous stirring.'
        ],
        keyConcepts: ['GHS Pictograms', 'PPE Hierarchy', 'Exothermic Acid Dilution', 'Emergency Wash'],
        lessonSections: [],
        activityType: 'observation_classification',
        activityInstructions: 'Inspect safety violations on a virtual laboratory bench and match GHS labels to reagent bottles.',
        assessment: { id: 'assess-1-6', title: 'Laboratory Hygiene Assessment', instructions: '', questions: [] },
        scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 },
        masteryThreshold: 80,
        estimatedMinutes: 7,
        rewards: { xp: 140, badgeId: 'badge-safety-guardian', badgeTitle: 'Safety Guardian' },
        unlocks: ['lvl-1-7'],
        contentSources: [{ id: 'osha-ghs', title: 'GHS Hazard Communication Standard', publisherOrInstitution: 'OSHA / UN' }],
        reviewStatus: 'draft',
        implementationStatus: 'planned',
        accessibilityNotes: 'Descriptive text alternatives for all hazard symbols.',
        localizationKeys: {}
      },
      {
        id: 'lvl-1-7',
        worldId: 'world-1-discovery',
        order: 7,
        title: 'Boss Challenge: Restore the Discovery Core',
        shortDescription: 'Multi-stage laboratory investigation: observe unknown samples, record precise measurements, classify evidence, and unlock World 2.',
        difficulty: 'foundations',
        prerequisiteLevelIds: ['lvl-1-6'],
        learningObjectives: [
          'Synthesize observation vs inference, states of matter, mixtures, and measurement precision in a unified investigation.',
          'Defend classification choices with verifiable evidence rather than guessing.',
          'Execute a safe simulated testing procedure without hazard violations.'
        ],
        keyConcepts: ['Synthesis', 'Scientific Method', 'Comprehensive Evidence', 'Discovery Core'],
        lessonSections: [],
        activityType: 'boss_challenge',
        activityInstructions: 'Solve the multi-stage core puzzle by analyzing 3 mystery materials, calibrating instruments, and filing a verified report.',
        assessment: { id: 'assess-1-7', title: 'Discovery Core Boss Tribunal', instructions: '', questions: [] },
        scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 85, passingThreshold: 70 },
        masteryThreshold: 85,
        estimatedMinutes: 12,
        rewards: { xp: 250, badgeId: 'badge-discovery-master', badgeTitle: 'Discovery Core Restored', unlockedToolId: 'atom-builder-preview' },
        unlocks: ['world-2-atomic', 'lvl-2-1'],
        contentSources: [{ id: 'mriirs-syllabus', title: 'Introductory Chemistry Competencies', publisherOrInstitution: 'MRIIRS' }],
        reviewStatus: 'draft',
        implementationStatus: 'planned',
        accessibilityNotes: 'Multi-step keyboard navigation with save points.',
        localizationKeys: {}
      }
    ]
  },

  // =========================================================================
  // WORLD 2 — ATOMIC FRONTIER
  // =========================================================================
  {
    id: 'world-2-atomic',
    num: 2,
    title: 'Atomic Frontier',
    theme: 'Vast particle universe with interactive atomic scientific models',
    story: 'Travel into the microscopic realm to repair the Element Atlas and discover the fundamental quantum building blocks of the elements.',
    worldOutcome: 'Understands atomic subatomic particles, atomic number, isotopes, ion formation, periodic table arrangement, and electron configurations.',
    thumbnail: '/assets/worlds/world-2.png',
    prerequisiteWorldId: 'world-1-discovery',
    unlockLevelId: 'lvl-1-7',
    levels: [
      { id: 'lvl-2-1', worldId: 'world-2-atomic', order: 1, title: 'Inside the Atom (Protons, Neutrons & Electrons)', shortDescription: 'Assemble subatomic particles and discover relative charge and mass.', difficulty: 'foundations', prerequisiteLevelIds: ['lvl-1-7'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'molecule_assembly', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 7, rewards: { xp: 120 }, unlocks: ['lvl-2-2'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-2-2', worldId: 'world-2-atomic', order: 2, title: 'Element Identity Lock (Atomic Number & Mass)', shortDescription: 'Match proton count Z and nucleon mass number A to unlock element gates.', difficulty: 'foundations', prerequisiteLevelIds: ['lvl-2-1'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'calculation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 7, rewards: { xp: 120 }, unlocks: ['lvl-2-3'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-2-3', worldId: 'world-2-atomic', order: 3, title: 'Isotope Observatory (Neutron Variations & Mass)', shortDescription: 'Inspect carbon and hydrogen isotopes and calculate atomic weight.', difficulty: 'foundations', prerequisiteLevelIds: ['lvl-2-2'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'data_analysis', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 8, rewards: { xp: 130 }, unlocks: ['lvl-2-4'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-2-4', worldId: 'world-2-atomic', order: 4, title: 'Ions and the Charge Reactor (Cations vs Anions)', shortDescription: 'Adjust valence electron counts to calculate net charge.', difficulty: 'foundations', prerequisiteLevelIds: ['lvl-2-3'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 8, rewards: { xp: 130 }, unlocks: ['lvl-2-5'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-2-5', worldId: 'world-2-atomic', order: 5, title: 'The Periodic Table Expedition (Groups & Periods)', shortDescription: 'Navigate the 118-element periodic grid and uncover metallic gradients.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-2-4'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'data_analysis', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 9, rewards: { xp: 140 }, unlocks: ['lvl-2-6'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-2-6', worldId: 'world-2-atomic', order: 6, title: 'Electron Shells and Aufbau Orbitals', shortDescription: 'Populate 1s, 2s, 2p, 3s, 3p, 3d subshells using Aufbau and Hund’s rule.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-2-5'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 9, rewards: { xp: 150 }, unlocks: ['lvl-2-7'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-2-7', worldId: 'world-2-atomic', order: 7, title: 'Boss: The Element Atlas Restored', shortDescription: 'Solve complex quantum particle puzzles to unlock World 3.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-2-6'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'boss_challenge', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 85, passingThreshold: 70 }, masteryThreshold: 85, estimatedMinutes: 14, rewards: { xp: 300, badgeId: 'badge-element-master', badgeTitle: 'Atlas Restored' }, unlocks: ['world-3-bonding', 'lvl-3-1'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} }
    ]
  },

  // =========================================================================
  // WORLD 3 — THE BONDING CITADEL
  // =========================================================================
  {
    id: 'world-3-bonding',
    num: 3,
    title: 'The Bonding Citadel',
    theme: 'Molecular architecture world of crystal lattices, bridges, and reaction chambers',
    story: 'The citadel structures are collapsing because molecular blueprints are scrambled. Master chemical bonds, 3D shapes, and chemical reactions.',
    worldOutcome: 'Can explain ionic and covalent bonding, construct basic molecules, interpret formulas, balance equations, and predict 3D shapes.',
    thumbnail: '/assets/worlds/world-3.png',
    prerequisiteWorldId: 'world-2-atomic',
    unlockLevelId: 'lvl-2-7',
    levels: [
      { id: 'lvl-3-1', worldId: 'world-3-bonding', order: 1, title: 'Why Atoms Combine (Electrostatic Stability)', shortDescription: 'Explore valence electron interactions and octet boundaries.', difficulty: 'foundations', prerequisiteLevelIds: ['lvl-2-7'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 8, rewards: { xp: 130 }, unlocks: ['lvl-3-2'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-3-2', worldId: 'world-3-bonding', order: 2, title: 'Ionic Bridgeworks (Lattice Energy & Salt Formulas)', shortDescription: 'Assemble neutral ionic salts matching cation and anion charges.', difficulty: 'foundations', prerequisiteLevelIds: ['lvl-3-1'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'molecule_assembly', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 8, rewards: { xp: 130 }, unlocks: ['lvl-3-3'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-3-3', worldId: 'world-3-bonding', order: 3, title: 'Covalent Architectures (Single, Double & Triple Bonds)', shortDescription: 'Share electron pairs between nonmetals to build covalent molecules.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-3-2'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'molecule_assembly', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 9, rewards: { xp: 140 }, unlocks: ['lvl-3-4'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-3-4', worldId: 'world-3-bonding', order: 4, title: 'Shapes in 3D (VSEPR Geometry & Bond Angles)', shortDescription: 'Rotate molecules to predict linear, trigonal planar, tetrahedral, and bent shapes.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-3-3'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 10, rewards: { xp: 150 }, unlocks: ['lvl-3-5'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-3-5', worldId: 'world-3-bonding', order: 5, title: 'Formula and Naming Forge (IUPAC Nomenclature)', shortDescription: 'Translate between chemical names, subscripts, and structural formulas.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-3-4'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'observation_classification', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 8, rewards: { xp: 140 }, unlocks: ['lvl-3-6'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-3-6', worldId: 'world-3-bonding', order: 6, title: 'Reaction Gate (Conservation of Atoms & Balancing)', shortDescription: 'Balance chemical equations by adjusting integer coefficients only.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-3-5'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'equation_balancing', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 10, rewards: { xp: 160 }, unlocks: ['lvl-3-7'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-3-7', worldId: 'world-3-bonding', order: 7, title: 'Boss: Rebuild the Bonding Citadel', shortDescription: 'Solve structural failures and balance synthesis reactions to unlock World 4.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-3-6'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'boss_challenge', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 85, passingThreshold: 70 }, masteryThreshold: 85, estimatedMinutes: 15, rewards: { xp: 350, badgeId: 'badge-architect-master', badgeTitle: 'Citadel Rebuilder' }, unlocks: ['world-4-quantitative', 'lvl-4-1'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} }
    ]
  },

  // =========================================================================
  // WORLD 4 — THE QUANTITATIVE CRUCIBLE
  // =========================================================================
  {
    id: 'world-4-quantitative',
    num: 4,
    title: 'The Quantitative Crucible',
    theme: 'Measurement and simulation complex with particle counters, balances, and graphs',
    story: 'The Crucible prediction engine is producing inconsistent results. Master particle counting, stoichiometry, concentrations, gas laws, and thermochemistry.',
    worldOutcome: 'Builds quantitative chemistry foundations for JEE-style problem solving, molarity calculations, and engineering stoichiometry.',
    thumbnail: '/assets/worlds/world-4.png',
    prerequisiteWorldId: 'world-3-bonding',
    unlockLevelId: 'lvl-3-7',
    levels: [
      { id: 'lvl-4-1', worldId: 'world-4-quantitative', order: 1, title: 'The Mole Bridge (Avogadro Constant & Molar Mass)', shortDescription: 'Convert between particle count, moles, and grams with unit dimensional checks.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-3-7'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'calculation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 9, rewards: { xp: 140 }, unlocks: ['lvl-4-2'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-4-2', worldId: 'world-4-quantitative', order: 2, title: 'Equation-to-Quantity Engine (Limiting Reagent)', shortDescription: 'Determine limiting reagents and calculate theoretical yields.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-4-1'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'calculation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 10, rewards: { xp: 150 }, unlocks: ['lvl-4-3'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-4-3', worldId: 'world-4-quantitative', order: 3, title: 'Solutions and Concentration Bay (Molarity & Dilutions)', shortDescription: 'Prepare molar solutions and compute standard dilution factors.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-4-2'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'calculation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 9, rewards: { xp: 150 }, unlocks: ['lvl-4-4'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-4-4', worldId: 'world-4-quantitative', order: 4, title: 'Gas and Pressure Station (Ideal Gas PV = nRT)', shortDescription: 'Manipulate temperature and pressure cylinders to solve ideal gas equations.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-4-3'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 10, rewards: { xp: 160 }, unlocks: ['lvl-4-5'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-4-5', worldId: 'world-4-quantitative', order: 5, title: 'Energy Landscape (Enthalpy ΔH & Calorimetry)', shortDescription: 'Interpret exothermic and endothermic reaction profile curves.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-4-4'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'graph_interpretation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 10, rewards: { xp: 160 }, unlocks: ['lvl-4-6'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-4-6', worldId: 'world-4-quantitative', order: 6, title: 'Equilibrium and Rate Control (Le Chatelier)', shortDescription: 'Shift reversible equilibria using concentration and temperature stresses.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-4-5'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 11, rewards: { xp: 170 }, unlocks: ['lvl-4-7'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-4-7', worldId: 'world-4-quantitative', order: 7, title: 'Boss: The Precision Trial', shortDescription: 'Complete multi-step stoichiometry and thermodynamic calculations to unlock World 5.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-4-6'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'boss_challenge', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 85, passingThreshold: 70 }, masteryThreshold: 85, estimatedMinutes: 16, rewards: { xp: 400, badgeId: 'badge-crucible-master', badgeTitle: 'Precision Master' }, unlocks: ['world-5-reactions', 'lvl-5-1'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} }
    ]
  },

  // =========================================================================
  // WORLD 5 — THE REALM OF REACTIONS
  // =========================================================================
  {
    id: 'world-5-reactions',
    num: 5,
    title: 'The Realm of Reactions',
    theme: 'Connected research districts for physical, inorganic, and organic chemistry',
    story: 'A network of research stations needs the player to investigate acid-base equilibria, redox half-reactions, and organic functional groups.',
    worldOutcome: 'Develops advanced school and competitive chemistry mastery across organic, inorganic, and electrochemical systems.',
    thumbnail: '/assets/worlds/world-5.png',
    prerequisiteWorldId: 'world-4-quantitative',
    unlockLevelId: 'lvl-4-7',
    levels: [
      { id: 'lvl-5-1', worldId: 'world-5-reactions', order: 1, title: 'Acid, Base and Indicator Garden (pH & Buffers)', shortDescription: 'Classify acids, bases, and indicator turning intervals on the logarithmic pH scale.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-4-7'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 9, rewards: { xp: 150 }, unlocks: ['lvl-5-2'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-5-2', worldId: 'world-5-reactions', order: 2, title: 'Redox Power Plant (Oxidation Numbers & Electron Transfer)', shortDescription: 'Assign oxidation states and balance ion-electron half-equations.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-5-1'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'equation_balancing', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 10, rewards: { xp: 160 }, unlocks: ['lvl-5-3'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-5-3', worldId: 'world-5-reactions', order: 3, title: 'Periodic Trend Observatory (Electronegativity & Radii)', shortDescription: 'Analyze effective nuclear charge and ionization energy anomalies.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-5-2'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'graph_interpretation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 10, rewards: { xp: 160 }, unlocks: ['lvl-5-4'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-5-4', worldId: 'world-5-reactions', order: 4, title: 'Organic Structure Workshop (Functional Groups & Isomers)', shortDescription: 'Assemble hydrocarbons, alcohols, aldehydes, and aromatic rings.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-5-3'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'molecule_assembly', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 11, rewards: { xp: 170 }, unlocks: ['lvl-5-5'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-5-5', worldId: 'world-5-reactions', order: 5, title: 'Organic Reaction Routes (Syntheses & Mechanisms)', shortDescription: 'Plan multi-step synthesis pathways for target organic molecules.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-5-4'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'data_analysis', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 12, rewards: { xp: 180 }, unlocks: ['lvl-5-6'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-5-6', worldId: 'world-5-reactions', order: 6, title: 'Electrochemistry and Cells (Galvanic Nernst Potential)', shortDescription: 'Trace electron and ion flow in Daniel cells and calculate cell EMF.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-5-5'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 11, rewards: { xp: 180 }, unlocks: ['lvl-5-7'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-5-7', worldId: 'world-5-reactions', order: 7, title: 'Boss: The Reaction Nexus', shortDescription: 'Investigate a complex reaction incident using multi-branch chemical evidence.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-5-6'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'boss_challenge', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 85, passingThreshold: 70 }, masteryThreshold: 85, estimatedMinutes: 18, rewards: { xp: 450, badgeId: 'badge-nexus-master', badgeTitle: 'Nexus Champion' }, unlocks: ['world-6-analytical', 'lvl-6-1'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} }
    ]
  },

  // =========================================================================
  // WORLD 6 — THE ANALYTICAL LABYRINTH
  // =========================================================================
  {
    id: 'world-6-analytical',
    num: 6,
    title: 'The Analytical Labyrinth',
    theme: 'Realistic analytical laboratory with instruments, sample prep, and digital lab notebook',
    story: 'The city water and material testing network returns conflicting reports. Master calibration, titrations, spectrophotometry, and chromatography.',
    worldOutcome: 'Gains practical analytical laboratory reasoning, data plot interpretation, and reproducible lab reporting skills.',
    thumbnail: '/assets/worlds/world-6.png',
    prerequisiteWorldId: 'world-5-reactions',
    unlockLevelId: 'lvl-5-7',
    levels: [
      { id: 'lvl-6-1', worldId: 'world-6-analytical', order: 1, title: 'Instruments and Calibration (Error & Precision)', shortDescription: 'Calibrate instrument zero marks and calculate percent relative error.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-5-7'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'data_analysis', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 9, rewards: { xp: 150 }, unlocks: ['lvl-6-2'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-6-2', worldId: 'world-6-analytical', order: 2, title: 'Titration Control Room (Volumetric Equivalence)', shortDescription: 'Deliver titrant dropwise, detect color endpoints, and calculate unknowns.', difficulty: 'intermediate', prerequisiteLevelIds: ['lvl-6-1'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 11, rewards: { xp: 170 }, unlocks: ['lvl-6-3'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-6-3', worldId: 'world-6-analytical', order: 3, title: 'Spectroscopy Signal Vault (Beer-Lambert Calibration)', shortDescription: 'Construct absorbance vs concentration plots and determine unknown concentrations.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-6-2'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'graph_interpretation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 10, rewards: { xp: 170 }, unlocks: ['lvl-6-4'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-6-4', worldId: 'world-6-analytical', order: 4, title: 'Chromatography Crossing (Rf Retention & Separation)', shortDescription: 'Measure solvent fronts and calculate retention factors for pigment separation.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-6-3'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'data_analysis', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 10, rewards: { xp: 170 }, unlocks: ['lvl-6-5'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-6-5', worldId: 'world-6-analytical', order: 5, title: 'Water Quality Investigation (Hardness, TDS & Chlorine)', shortDescription: 'Run simulated EDTA complexometric titrations to evaluate municipal water.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-6-4'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 12, rewards: { xp: 180 }, unlocks: ['lvl-6-6'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-6-6', worldId: 'world-6-analytical', order: 6, title: 'Error, Uncertainty and Lab Reports', shortDescription: 'Calculate standard deviation and compose rigorous scientific laboratory reports.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-6-5'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'data_analysis', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 11, rewards: { xp: 180 }, unlocks: ['lvl-6-7'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-6-7', worldId: 'world-6-analytical', order: 7, title: 'Boss: The Evidence Tribunal', shortDescription: 'Resolve contradictory analytical evidence in a simulated environmental mystery.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-6-6'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'boss_challenge', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 85, passingThreshold: 70 }, masteryThreshold: 85, estimatedMinutes: 18, rewards: { xp: 500, badgeId: 'badge-tribunal-master', badgeTitle: 'Forensic Chemist' }, unlocks: ['world-7-engineering', 'lvl-7-1'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} }
    ]
  },

  // =========================================================================
  // WORLD 7 — THE ENGINEERING FRONTIER
  // =========================================================================
  {
    id: 'world-7-engineering',
    num: 7,
    title: 'The Engineering Frontier',
    theme: 'Materials labs, corrosion chambers, polymers, and industrial engineering simulators',
    story: 'Apply chemistry to practical engineering materials, corrosion protection, polymer synthesis, fuels, and university lab practicals.',
    worldOutcome: 'Directly maps to the MRIIRS Engineering Chemistry curriculum (4.5CH101C00H) covering tribology, water softening, and electrochemistry.',
    thumbnail: '/assets/worlds/world-7.png',
    prerequisiteWorldId: 'world-6-analytical',
    unlockLevelId: 'lvl-6-7',
    levels: [
      { id: 'lvl-7-1', worldId: 'world-7-engineering', order: 1, title: 'Materials and Crystal Lab (Band Gaps & Alloys)', shortDescription: 'Compare semiconductors, conductivity band gaps, and alloy phase diagrams.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-6-7'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'data_analysis', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 10, rewards: { xp: 160 }, unlocks: ['lvl-7-2'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-7-2', worldId: 'world-7-engineering', order: 2, title: 'Corrosion Defense Station (Cathodic Protection)', shortDescription: 'Simulate sacrificial anode galvanic protection and sacrificial zinc coatings.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-7-1'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 11, rewards: { xp: 170 }, unlocks: ['lvl-7-3'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-7-3', worldId: 'world-7-engineering', order: 3, title: 'Polymers and Smart Materials (Bakelite & Thermoplastics)', shortDescription: 'Examine step-growth phenol-formaldehyde condensation and cross-linking.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-7-2'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'molecule_assembly', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 11, rewards: { xp: 170 }, unlocks: ['lvl-7-4'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-7-4', worldId: 'world-7-engineering', order: 4, title: 'Fuels, Energy and Combustion (Calorific Value & Coal)', shortDescription: 'Calculate Gross and Net Calorific Values using Dulong’s formula.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-7-3'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'calculation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 12, rewards: { xp: 180 }, unlocks: ['lvl-7-5'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-7-5', worldId: 'world-7-engineering', order: 5, title: 'Water Treatment & Industrial Softening (EDTA / Zeolite)', shortDescription: 'Diagnose boiler scale and compare zeolite and lime-soda softening methods.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-7-4'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'engineering_scenario', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 12, rewards: { xp: 180 }, unlocks: ['lvl-7-6'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-7-6', worldId: 'world-7-engineering', order: 6, title: 'Engineering Practical: Redwood Viscometric Tribology', shortDescription: 'Simulate Redwood Viscometer No. 1 and calculate kinematic viscosity.', difficulty: 'capstone', prerequisiteLevelIds: ['lvl-7-5'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 15, rewards: { xp: 200 }, unlocks: ['lvl-7-7'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-7-7', worldId: 'world-7-engineering', order: 7, title: 'Boss: The Engineering Design Review', shortDescription: 'Defend a multi-factor engineering material and water treatment proposal.', difficulty: 'capstone', prerequisiteLevelIds: ['lvl-7-6'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'boss_challenge', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 85, passingThreshold: 70 }, masteryThreshold: 85, estimatedMinutes: 20, rewards: { xp: 600, badgeId: 'badge-engineer-master', badgeTitle: 'Chartered Chemist' }, unlocks: ['world-8-future', 'lvl-8-1'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} }
    ]
  },

  // =========================================================================
  // WORLD 8 — THE ALCHEMIST'S FUTURE
  // =========================================================================
  {
    id: 'world-8-future',
    num: 8,
    title: "The Alchemist's Future",
    theme: 'High-tech sustainable industrial campus, green chemistry, and computational studio',
    story: 'Connects chemistry knowledge, process flow engineering, environmental stewardship, and computational simulations to solve global sustainability challenges.',
    worldOutcome: 'Applies chemistry across industrial systems, understands computational model limitations, and designs sustainable solutions.',
    thumbnail: '/assets/worlds/world-8.png',
    prerequisiteWorldId: 'world-7-engineering',
    unlockLevelId: 'lvl-7-7',
    levels: [
      { id: 'lvl-8-1', worldId: 'world-8-future', order: 1, title: 'Process Flow Architect (Mass Balance & Unit Operations)', shortDescription: 'Design mass-balanced process flows for chemical recycling plants.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-7-7'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'engineering_scenario', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 12, rewards: { xp: 180 }, unlocks: ['lvl-8-2'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-8-2', worldId: 'world-8-future', order: 2, title: 'Computational Chemistry Observatory (RDKit / MMFF94)', shortDescription: 'Inspect conformers, energy minimization, and 3D molecular descriptors.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-8-1'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 13, rewards: { xp: 190 }, unlocks: ['lvl-8-3'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-8-3', worldId: 'world-8-future', order: 3, title: 'Green Chemistry Challenge (12 Principles & Atom Economy)', shortDescription: 'Evaluate reaction routes using atom economy and E-factor waste metrics.', difficulty: 'advanced', prerequisiteLevelIds: ['lvl-8-2'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'calculation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 12, rewards: { xp: 190 }, unlocks: ['lvl-8-4'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-8-4', worldId: 'world-8-future', order: 4, title: 'Industrial Process Optimization (Yield vs Selectivity)', shortDescription: 'Optimize temperature and residence times under strict safety thresholds.', difficulty: 'capstone', prerequisiteLevelIds: ['lvl-8-3'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'simulation', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 14, rewards: { xp: 200 }, unlocks: ['lvl-8-5'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-8-5', worldId: 'world-8-future', order: 5, title: 'Environmental Forensics (Contaminants & Lifecycle)', shortDescription: 'Track trace effluent diffusion and identify chemical emission sources.', difficulty: 'capstone', prerequisiteLevelIds: ['lvl-8-4'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'data_analysis', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 80, passingThreshold: 60 }, masteryThreshold: 80, estimatedMinutes: 14, rewards: { xp: 200 }, unlocks: ['lvl-8-6'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-8-6', worldId: 'world-8-future', order: 6, title: 'Capstone: Design a Sustainable Chemical System', shortDescription: 'Synthesize materials, energy, and green catalysis in an open design brief.', difficulty: 'capstone', prerequisiteLevelIds: ['lvl-8-5'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'engineering_scenario', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 85, passingThreshold: 70 }, masteryThreshold: 85, estimatedMinutes: 18, rewards: { xp: 300 }, unlocks: ['lvl-8-7'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} },
      { id: 'lvl-8-7', worldId: 'world-8-future', order: 7, title: 'Final Boss: The Alche-Me Council', shortDescription: 'The ultimate synthesis tribunal across all 8 realms to earn Master Chemist honors.', difficulty: 'capstone', prerequisiteLevelIds: ['lvl-8-6'], learningObjectives: [], keyConcepts: [], lessonSections: [], activityType: 'boss_challenge', activityInstructions: '', assessment: { id: '', title: '', instructions: '', questions: [] }, scoringRules: { activityWeight: 0.5, assessmentWeight: 0.5, masteryThreshold: 90, passingThreshold: 75 }, masteryThreshold: 90, estimatedMinutes: 25, rewards: { xp: 1000, badgeId: 'badge-grand-alchemist', badgeTitle: 'Grand Alche-Me Master' }, unlocks: ['mastery-hall-of-fame'], contentSources: [], reviewStatus: 'draft', implementationStatus: 'planned', accessibilityNotes: '', localizationKeys: {} }
    ]
  }
];
