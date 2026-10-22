/**
 * Alche-Me — Molecule Studio Gamified Challenge & Level Verification Engine
 * Validates student molecular drawings against IUPAC chemical formulas,
 * bond connectivity, and on-canvas VSEPR bond angle measurements.
 */

import { AtomNode, BondEdge, MeasurementResult } from './types';
import { calculateHillFormula } from './vseprPhysics';

export interface MoleculeChallenge {
  id: string;
  level: number;
  name: string;
  formula: string;
  category: string;
  geometry: string;
  vseprNotation: string;
  targetAngle: number;
  angleTolerance: number;
  description: string;
  hints: string[];
  xpReward: number;
  expectedBondCount?: number;
  requiredDoubleBonds?: number;
  requiredTripleBonds?: number;
}

export const MOLECULE_CHALLENGES: MoleculeChallenge[] = [
  {
    id: 'challenge-water',
    level: 1,
    name: 'Water (H₂O)',
    formula: 'H2O',
    category: 'VSEPR Bent',
    geometry: 'Bent (V-Shaped)',
    vseprNotation: 'AX₂E₂ (2 bonding pairs, 2 lone pairs)',
    targetAngle: 104.5,
    angleTolerance: 4.0,
    description: 'Construct the fundamental molecule of life! Add 1 Oxygen and 2 Hydrogens, connect single bonds, clean with VSEPR, and measure the H-O-H angle.',
    hints: [
      'Select Oxygen (O) and add it to the canvas.',
      'Add 2 Hydrogen (H) atoms or click "+ Auto-H" to saturate.',
      'Switch to the "Measure" tool, select "Angle (°)", and click H1 → O → H2.'
    ],
    xpReward: 100,
    expectedBondCount: 2,
  },
  {
    id: 'challenge-co2',
    level: 2,
    name: 'Carbon Dioxide (CO₂)',
    formula: 'CO2',
    category: 'Linear Oxide',
    geometry: 'Linear',
    vseprNotation: 'AX₂ (2 double bonds, 0 lone pairs)',
    targetAngle: 180.0,
    angleTolerance: 4.0,
    description: 'Synthesize Carbon Dioxide with sp hybridization! Create two double bonds (O=C=O), clean 3D, and measure the rigid 180° linear angle.',
    hints: [
      'Place 1 Carbon (C) atom and 2 Oxygen (O) atoms.',
      'Connect both bonds with Double (=) bond order.',
      'Click "Clean 3D" to relax VSEPR forces into a straight line.',
      'Measure the O-C-O angle (should be 180°).'
    ],
    xpReward: 150,
    expectedBondCount: 2,
    requiredDoubleBonds: 2,
  },
  {
    id: 'challenge-ammonia',
    level: 3,
    name: 'Ammonia (NH₃)',
    formula: 'H3N',
    category: 'Trigonal Pyramidal',
    geometry: 'Trigonal Pyramidal',
    vseprNotation: 'AX₃E (3 bonding pairs, 1 lone pair)',
    targetAngle: 107.3,
    angleTolerance: 4.0,
    description: 'Construct Ammonia! Place Nitrogen (N) and attach 3 Hydrogens. The nitrogen lone pair compresses the H-N-H angle to 107.3°.',
    hints: [
      'Place a Nitrogen (N) atom.',
      'Click "+ Auto-H" to automatically add 3 Hydrogens.',
      'Clean 3D to form the pyramidal umbrella.',
      'Measure any H-N-H angle (arm1 → Nitrogen → arm2).'
    ],
    xpReward: 200,
    expectedBondCount: 3,
  },
  {
    id: 'challenge-methane',
    level: 4,
    name: 'Methane (CH₄)',
    formula: 'CH4',
    category: 'Tetrahedral Alkane',
    geometry: 'Tetrahedral',
    vseprNotation: 'AX₄ (4 bonding pairs, 0 lone pairs)',
    targetAngle: 109.5,
    angleTolerance: 4.0,
    description: 'Build the quintessential organic hydrocarbon! Verify the iconic sp³ tetrahedral bond angle of 109.5°.',
    hints: [
      'Place Carbon (C) at the center.',
      'Use "+ Auto-H" to saturate all 4 valences.',
      'Click "Clean 3D" to minimize VSEPR repulsion.',
      'Measure any H-C-H angle on canvas.'
    ],
    xpReward: 250,
    expectedBondCount: 4,
  },
  {
    id: 'challenge-ethene',
    level: 5,
    name: 'Ethene (C₂H₄)',
    formula: 'C2H4',
    category: 'Planar Alkene',
    geometry: 'Trigonal Planar',
    vseprNotation: 'AX₃ (sp² hybridized carbons)',
    targetAngle: 121.3,
    angleTolerance: 5.0,
    description: 'Synthesize the simplest alkene featuring a Carbon-Carbon double bond (C=C). Measure the 120° trigonal planar bond angle!',
    hints: [
      'Place 2 Carbon atoms and connect them with a Double (=) bond.',
      'Click "+ Auto-H" to add 2 Hydrogens to each Carbon.',
      'Clean 3D to align into a flat planar geometry.',
      'Measure the H-C=C bond angle.'
    ],
    xpReward: 300,
    expectedBondCount: 5,
    requiredDoubleBonds: 1,
  },
  {
    id: 'challenge-benzene',
    level: 6,
    name: 'Benzene (C₆H₆)',
    formula: 'C6H6',
    category: 'Aromatic Ring',
    geometry: 'Planar Hexagonal Ring',
    vseprNotation: 'Planar sp² conjugated ring',
    targetAngle: 120.0,
    angleTolerance: 3.5,
    description: 'Synthesize the legendary aromatic ring of Benzene! Insert the Benzene template or draw 6 carbons in a ring, clean 3D, and measure the 120° angle.',
    hints: [
      'Use the "Benzene Ring" template under Templates, or build a 6-carbon ring.',
      'Clean 3D to achieve perfect hexagonal symmetry.',
      'Measure any internal C-C-C ring angle on canvas (120°).'
    ],
    xpReward: 400,
  },
];

export interface ChallengeValidationResult {
  isFormulaMatch: boolean;
  isBondsMatch: boolean;
  isAngleMeasured: boolean;
  measuredAngle?: number;
  isComplete: boolean;
  feedback: string;
}

/**
 * Normalizes formula string for comparison (converts subscript numbers like H₂O to ASCII H2O)
 */
function normalizeFormula(formula: string): string {
  const subscriptMap: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  };
  return formula
    .replace(/[₀-₉]/g, (char) => subscriptMap[char] || char)
    .replace(/\s+/g, '')
    .toUpperCase();
}

/**
 * Validates whether the student's current canvas state passes the challenge level
 */
export function validateChallengeCompletion(
  studentAtoms: AtomNode[],
  studentBonds: BondEdge[],
  measurements: MeasurementResult[],
  challenge: MoleculeChallenge
): ChallengeValidationResult {
  const currentFormula = calculateHillFormula(studentAtoms);
  const normCurrent = normalizeFormula(currentFormula);
  const normTarget = normalizeFormula(challenge.formula);

  // Check formula match (supporting alternate Hill notations like H3N vs NH3)
  const isFormulaMatch =
    normCurrent === normTarget ||
    (normTarget === 'H3N' && normCurrent === 'H3N') ||
    (normTarget === 'H2O' && (normCurrent === 'H2O' || normCurrent === 'OH2'));

  // Check bond orders if specified
  let isBondsMatch = true;
  if (challenge.requiredDoubleBonds) {
    const doubleCount = studentBonds.filter((b) => b.order === 2).length;
    if (doubleCount < challenge.requiredDoubleBonds) {
      isBondsMatch = false;
    }
  }
  if (challenge.requiredTripleBonds) {
    const tripleCount = studentBonds.filter((b) => b.order === 3).length;
    if (tripleCount < challenge.requiredTripleBonds) {
      isBondsMatch = false;
    }
  }

  // Check angle measurement
  const angleMeasurements = measurements.filter((m) => m.type === 'angle');
  let matchedAngleMeasurement: MeasurementResult | undefined = undefined;

  for (const m of angleMeasurements) {
    const diff = Math.abs(m.value - challenge.targetAngle);
    if (diff <= challenge.angleTolerance) {
      matchedAngleMeasurement = m;
      break;
    }
  }

  const isAngleMeasured = !!matchedAngleMeasurement;
  const measuredAngle = matchedAngleMeasurement?.value;

  // Determine overall completion
  const isComplete = isFormulaMatch && isBondsMatch && isAngleMeasured;

  let feedback = '';
  if (!isFormulaMatch) {
    feedback = `Formula mismatch: Current is ${currentFormula || 'empty'}, target is ${challenge.formula}.`;
  } else if (!isBondsMatch) {
    feedback = `Check bond orders: Need ${challenge.requiredDoubleBonds ? `${challenge.requiredDoubleBonds} double bond(s)` : 'proper bonds'}.`;
  } else if (!isAngleMeasured) {
    if (angleMeasurements.length === 0) {
      feedback = `Molecule drawn! Now measure the bond angle on canvas using the Angle tool (${challenge.targetAngle}° target).`;
    } else {
      const closest = angleMeasurements[0].value.toFixed(1);
      feedback = `Angle measured (${closest}°), but target is ${challenge.targetAngle}° (±${challenge.angleTolerance}°). Click "Clean 3D" to relax geometry!`;
    }
  } else {
    feedback = `Target achieved! ${challenge.name} verified with angle ${measuredAngle?.toFixed(1)}°!`;
  }

  return {
    isFormulaMatch,
    isBondsMatch,
    isAngleMeasured,
    measuredAngle,
    isComplete,
    feedback,
  };
}
