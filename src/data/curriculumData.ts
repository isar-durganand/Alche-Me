/**
 * Alche-Me — Curriculum, Worlds & Level Definitions
 * Sourced from MRIIRS Engineering Chemistry Syllabus (4.5CH101C00H)
 * and Master Specification Section 6.
 */

export interface LessonContent {
  title: string;
  conceptSummary: string;
  bulletPoints: string[];
  keyEquation?: string;
  accessibleText?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CurriculumActivity {
  id: string;
  type: 'lesson_and_quiz';
  lesson: LessonContent;
  quiz: QuizQuestion[];
  xpReward?: number;
}

export interface CurriculumLevel {
  id: string;
  worldId: string;
  num: number;
  title: string;
  summary: string;
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  prerequisiteId?: string;
  estimatedMinutes: number;
  xpReward: number;
  activity: CurriculumActivity;
}

export interface CurriculumWorld {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  summary: string;
  thumbnail: string;
  prerequisiteWorldId?: string;
  levels: CurriculumLevel[];
}

export const CURRICULUM_WORLDS: CurriculumWorld[] = [
  {
    id: 'discovery-academy',
    num: 1,
    title: 'Discovery Academy',
    subtitle: 'Matter, Units & Laboratory Hygiene',
    summary: 'The gateway world for all aspiring chemists. Master standard laboratory glassware, precise volumetric measurement, safety pictograms, and fundamental SI dimensional consistency.',
    thumbnail: '/assets/worlds/world-1.png',
    levels: [
      {
        id: 'da-lvl-1',
        worldId: 'discovery-academy',
        num: 1,
        title: 'Safety First: Glassware & Chemical Hazards',
        summary: 'Learn standard laboratory apparatus identification, PPE guidelines, and GHS chemical hazard pictograms before handling reagents.',
        difficulty: 'foundation',
        estimatedMinutes: 5,
        xpReward: 100,
        activity: {
          id: 'act-da-1',
          type: 'lesson_and_quiz',
          lesson: {
            title: 'Laboratory Hygiene & Apparatus Fundamentals',
            conceptSummary: 'Accurate analytical chemistry depends upon proper glassware selection and meticulous hazard prevention. Never use a beaker for exact volumetric measurement—use a calibrated volumetric pipette or burette.',
            bulletPoints: [
              'Burette (±0.05 mL tolerance): Used strictly for deliverable titrant volume measurements.',
              'Volumetric Flask: Calibrated strictly to contain (TC) a precise solution volume at 20°C.',
              'PPE Hierarchy: Safety goggles, chemical-resistant nitrile gloves, and a lab coat must be worn before opening any reagent bottle.',
              'Acid Dilution Golden Rule: Always add concentrated acid slowly to water down the side of the container with continuous stirring—never add water to acid to prevent violent exothermic splattering.'
            ],
            keyEquation: 'Acid Dilution: H₂SO₄(conc) + H₂O ⟶ Exothermic Dissociation (Add Acid to Water)',
            accessibleText: 'Always add acid to water slowly down the side of glassware to prevent steam splattering.'
          },
          quiz: [
            {
              id: 'q-da-1-1',
              question: 'Which piece of laboratory glassware delivers the highest precision when measuring 25.00 mL of standard hard water for titration?',
              options: [
                'Graduated Beaker',
                'Calibrated Volumetric Pipette',
                'Erlenmeyer Conical Flask',
                'Measuring Cylinder'
              ],
              correctIndex: 1,
              explanation: 'A volumetric pipette is calibrated with narrow tolerance (±0.03 to ±0.05 mL) specifically to deliver fixed volumes accurately, unlike beakers or conical flasks which only provide approximate markings.'
            },
            {
              id: 'q-da-1-2',
              question: 'What is the mandatory procedure when preparing a dilute solution of sulfuric acid (H₂SO₄)?',
              options: [
                'Pour water quickly into the concentrated acid bottle',
                'Add acid slowly down the side of the container into water with stirring',
                'Mix equal volumes simultaneously in a sealed beaker',
                'Heat the acid first to reduce its viscosity before adding water'
              ],
              correctIndex: 1,
              explanation: 'Dissolution of concentrated sulfuric acid is intensely exothermic. Adding acid to water ensures the large heat capacity of water absorbs the dissipated energy, preventing localized boiling and acid splatters.'
            },
            {
              id: 'q-da-1-3',
              question: 'What does the GHS corrosion pictogram (substance pouring onto hands and metal) indicate?',
              options: [
                'Fl проявляable aerosol hazard',
                'Causes severe skin burns, eye damage, and corrodes metals',
                'Explosive self-reactive chemical',
                'Non-toxic environmental nuisance'
              ],
              correctIndex: 1,
              explanation: 'The GHS corrosion symbol specifically warns of irreversible destructive damage to living dermal tissue and corrosive degradation of structural metals.'
            }
          ]
        }
      },
      {
        id: 'da-lvl-2',
        worldId: 'discovery-academy',
        num: 2,
        title: 'The Metric Foundation: Solution Concentrations & Molarity',
        summary: 'Master standard solution calculations: molarity (M), normality (N), parts per million (ppm), and equivalence relationships.',
        difficulty: 'foundation',
        prerequisiteId: 'da-lvl-1',
        estimatedMinutes: 6,
        xpReward: 120,
        activity: {
          id: 'act-da-2',
          type: 'lesson_and_quiz',
          lesson: {
            title: 'Expressing Chemical Concentrations',
            conceptSummary: 'Engineering chemistry practicals (such as EDTA hardness and water alkalinity) rely on stoichiometric concentration units: Molarity (moles/L), Normality (gram-equivalents/L), and ppm (mg/L).',
            bulletPoints: [
              'Molarity (M): Moles of solute dissolved per litre of solution (M = n / V).',
              'Normality (N): Number of gram-equivalents per litre (N = M × n-factor).',
              'Parts per million (ppm): Mass of solute in mg per 1 litre of water (1 ppm = 1 mg/L = 1 mg per 10⁶ mg water).',
              'Equivalence Law: At the stoichiometric end point, N₁V₁ = N₂V₂.'
            ],
            keyEquation: 'N₁V₁ = N₂V₂  and  1 ppm = 1 mg CaCO₃ equivalent / L',
            accessibleText: 'Normality one times Volume one equals Normality two times Volume two.'
          },
          quiz: [
            {
              id: 'q-da-2-1',
              question: 'In engineering water technology, how is 1 ppm (part per million) of hardness officially defined?',
              options: [
                '1 gram of calcium per 100 mL of water',
                '1 milligram of CaCO₃ equivalent per 1 litre of water',
                '1 mole of EDTA per 1000 litres of water',
                '1 microgram of magnesium per gallon'
              ],
              correctIndex: 1,
              explanation: '1 ppm is defined as 1 part by weight of CaCO₃ equivalent hardness present in 10⁶ parts by weight of water, which translates in dilute aqueous systems to 1 mg/L.'
            },
            {
              id: 'q-da-2-2',
              question: 'If 25 mL of unknown hard water requires 12.5 mL of 0.01 M EDTA for complete titration, what titration law enables direct calculation of total hardness?',
              options: [
                'Beer-Lambert Law (A = εbc)',
                'Law of Chemical Equivalence (N₁V₁ = N₂V₂)',
                'Raoult’s Law of Vapor Pressure',
                'Hess’s Law of Constant Heat Summation'
              ],
              correctIndex: 1,
              explanation: 'Volumetric titration calculations rely on the Law of Chemical Equivalence, stating that reacting species consume identical numbers of equivalents at the stoichiometric endpoint.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'atomic-frontier',
    num: 2,
    title: 'Atomic Frontier',
    subtitle: 'Quantum Orbitals & Periodic Trends',
    summary: 'Delve into atomic quantum numbers, subshell electron capacities, Hund’s rule of maximum multiplicity, and Pauling electronegativity gradients across the 118 elements.',
    thumbnail: '/assets/worlds/world-2.png',
    prerequisiteWorldId: 'discovery-academy',
    levels: [
      {
        id: 'af-lvl-1',
        worldId: 'atomic-frontier',
        num: 1,
        title: 'Quantum Orbitals: Subshells & Electron Spins',
        summary: 'Explore 1s, 2s, 2p, 3s, 3p, 3d orbital boxes. Predict ground-state electron configurations using the Aufbau principle and Hund’s rule.',
        difficulty: 'intermediate',
        prerequisiteId: 'da-lvl-2',
        estimatedMinutes: 7,
        xpReward: 150,
        activity: {
          id: 'act-af-1',
          type: 'lesson_and_quiz',
          lesson: {
            title: 'Orbital Filling Principles',
            conceptSummary: 'Electrons occupy three-dimensional quantum mechanical probability clouds characterized by 4 quantum numbers (n, l, m_l, m_s).',
            bulletPoints: [
              'Aufbau Principle: Orbitals of lowest energy are filled first (1s < 2s < 2p < 3s < 3p < 4s < 3d).',
              'Pauli Exclusion Principle: No two electrons in an atom can have the same four quantum numbers. Each orbital box holds a maximum of two electrons with opposite spins (↑↓).',
              'Hund’s Rule: Degenerate orbitals (e.g. 2px, 2py, 2pz) are each singly occupied with parallel spins (↑) before any orbital is doubly occupied.',
              'Chromium & Copper Anomalies: Half-filled (3d⁵) and completely filled (3d¹⁰) subshells possess extra thermodynamic stability due to symmetrical charge distribution and maximum exchange energy.'
            ],
            keyEquation: 'E_exchange ∝ K × [n(n-1)/2] (Stability of half-filled subshells)',
            accessibleText: 'Exchange energy increases with the number of parallel spin electron pairs.'
          },
          quiz: [
            {
              id: 'q-af-1-1',
              question: 'According to Hund’s rule, how should the three 2p electrons in a neutral Nitrogen atom (Z = 7) be distributed across 2px, 2py, and 2pz?',
              options: [
                'Two electrons in 2px (↑↓), one in 2py (↑), zero in 2pz',
                'One electron in each orbital with parallel spins: 2px(↑) 2py(↑) 2pz(↑)',
                'All three electrons in 2px with differing spins',
                'Two electrons in 2pz with opposite spins and one in 2px'
              ],
              correctIndex: 1,
              explanation: 'Hund’s rule dictates that pairing cannot occur in degenerate orbitals until each orbital contains one electron with parallel spin, maximizing exchange energy and minimizing inter-electronic repulsion.'
            },
            {
              id: 'q-af-1-2',
              question: 'What is the ground-state electron configuration of Chromium (Z = 24)?',
              options: [
                '[Ar] 4s² 3d⁴',
                '[Ar] 4s¹ 3d⁵',
                '[Ar] 4s² 3d³ 4p¹',
                '[Ar] 3d⁶'
              ],
              correctIndex: 1,
              explanation: 'Chromium adopts [Ar] 4s¹ 3d⁵ instead of [Ar] 4s² 3d⁴ because the half-filled 3d⁵ subshell achieves symmetrical electron density and maximal exchange energy.'
            }
          ]
        }
      },
      {
        id: 'af-lvl-2',
        worldId: 'atomic-frontier',
        num: 2,
        title: 'Periodic Trends: Electronegativity & Ionization',
        summary: 'Investigate how effective nuclear charge (Z_eff) and atomic radii govern chemical bonding, ionization energy, and electronegativity trends.',
        difficulty: 'intermediate',
        prerequisiteId: 'af-lvl-1',
        estimatedMinutes: 7,
        xpReward: 150,
        activity: {
          id: 'act-af-2',
          type: 'lesson_and_quiz',
          lesson: {
            title: 'Periodic Trends Across Periods and Groups',
            conceptSummary: 'Atomic properties vary systematically across the periodic table due to the balance between increasing nuclear charge and inner-shell electron shielding.',
            bulletPoints: [
              'Atomic Radius: Decreases across a period (left to right) as effective nuclear charge (Z_eff) pulls valence electrons closer; increases down a group due to new electron shells.',
              'Electronegativity: Measures an atom’s power to attract shared electron pairs in a covalent bond (Fluorine is highest at 3.98 Pauling).',
              'First Ionization Energy: Increases across a period with slight dips at Group 13 (np¹ electron easier to remove) and Group 16 (paired np⁴ electron repelled).',
              'Engineering Implication: Pauling electronegativity differences govern whether bonds are purely covalent (Δχ < 0.4), polar covalent (0.4 ≤ Δχ ≤ 1.7), or predominantly ionic (Δχ > 1.7).'
            ],
            keyEquation: 'Z_eff = Z - σ (Slater’s effective nuclear charge)',
            accessibleText: 'Effective nuclear charge equals atomic number minus shielding constant.'
          },
          quiz: [
            {
              id: 'q-af-2-1',
              question: 'Why does Nitrogen (Group 15) have a higher first ionization energy than Oxygen (Group 16), despite being to its left in Period 2?',
              options: [
                'Nitrogen has a larger atomic radius than Oxygen',
                'Nitrogen possesses a stable half-filled 2p³ configuration, whereas Oxygen has paired 2p⁴ electrons experiencing inter-electronic repulsion',
                'Oxygen has fewer protons in its nucleus than Nitrogen',
                'Nitrogen’s 1s electrons shield the nucleus more weakly'
              ],
              correctIndex: 1,
              explanation: 'Nitrogen’s half-filled 2p³ subshell has elevated exchange stability. In Oxygen (2p⁴), the fourth electron must pair up with an existing electron, creating repulsion that makes it easier to ionize.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'bonding-worlds',
    num: 3,
    title: 'Bonding & Molecular Worlds',
    subtitle: 'VSEPR, Drago’s Rule & 3D Conformations',
    summary: 'Analyze lone-pair repulsions in VSEPR hydrides (H₂O at 104.5°, H₂S at 92.1°, H₂Se at 91.0°). Explore octahedral coordination complexes and Drago’s hybridization threshold.',
    thumbnail: '/assets/worlds/world-3.png',
    prerequisiteWorldId: 'atomic-frontier',
    levels: []
  },
  {
    id: 'reaction-forge',
    num: 4,
    title: 'Reaction Forge',
    subtitle: 'Stoichiometry & Redox Potentiometry',
    summary: 'Balance complex multi-electron half-reactions and quantify ferrous-ion oxidation with dichromate using calomel-platinum electrode potentiometry.',
    thumbnail: '/assets/worlds/world-4.png',
    prerequisiteWorldId: 'bonding-worlds',
    levels: []
  },
  {
    id: 'analytical-district',
    num: 5,
    title: 'Analytical District',
    subtitle: 'Titrimetry & Water Quality Analysis',
    summary: 'Conductometric acid-base curves, permanent and temporary water hardness determination, and phenolphthalein-methyl orange alkalinity quantification.',
    thumbnail: '/assets/worlds/world-5.png',
    prerequisiteWorldId: 'reaction-forge',
    levels: []
  },
  {
    id: 'materials-frontier',
    num: 6,
    title: 'Materials & Energy Frontier',
    subtitle: 'Lubricants, Polymers & Fuels',
    summary: 'Industrial engineering practicals: Redwood viscometric calibration, Pensky-Martens flash & fire points, coal proximate analysis, and Bakelite resin condensation.',
    thumbnail: '/assets/worlds/world-6.png',
    prerequisiteWorldId: 'analytical-district',
    levels: []
  }
];
