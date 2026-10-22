/**
 * Alche-Me — 3D Molecular Studio & HOMO-LUMO Quantum Frontier Types
 * Standard IUPAC, Bondi radii, CPK colors, and Frontier Molecular Orbital Theory (Fukui-Hoffmann).
 */

/**
 * Alche-Me — 3D Molecular Studio & HOMO-LUMO Quantum Frontier Types
 * Standard IUPAC, Bondi radii, CPK colors, and Frontier Molecular Orbital Theory (Fukui-Hoffmann).
 * Full 118 Periodic Table coverage for seamless element creation and editing.
 */

import { getAll118Elements } from '../../data/periodicTableData';

export type ElementSymbol = string;

export interface ElementData {
  symbol: ElementSymbol;
  name: string;
  atomicNumber: number;
  valences: number[];
  maxValence: number;
  cpkColor: number;
  hexColor: string;
  covalentRadius: number; // in Å
  vdwRadius: number;      // in Å
  atomicMass: number;     // g/mol
  electronegativity: number;
  category?: string;
}

// Base CPK & IUPAC reference for key elements
export const ELEMENT_REGISTRY: Record<string, ElementData> = {
  H: { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, valences: [1], maxValence: 1, cpkColor: 0xF8FAFC, hexColor: '#ffffff', covalentRadius: 0.32, vdwRadius: 1.20, atomicMass: 1.008, electronegativity: 2.20, category: 'nonmetal' },
  He: { symbol: 'He', name: 'Helium', atomicNumber: 2, valences: [0], maxValence: 0, cpkColor: 0x06B6D4, hexColor: '#06b6d4', covalentRadius: 0.28, vdwRadius: 1.40, atomicMass: 4.0026, electronegativity: 0, category: 'noble' },
  Li: { symbol: 'Li', name: 'Lithium', atomicNumber: 3, valences: [1], maxValence: 1, cpkColor: 0x8B5CF6, hexColor: '#8b5cf6', covalentRadius: 1.28, vdwRadius: 1.82, atomicMass: 6.94, electronegativity: 0.98, category: 'alkali' },
  Be: { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, valences: [2], maxValence: 2, cpkColor: 0x059669, hexColor: '#059669', covalentRadius: 0.96, vdwRadius: 1.53, atomicMass: 9.012, electronegativity: 1.57, category: 'alkaline' },
  B: { symbol: 'B', name: 'Boron', atomicNumber: 5, valences: [3], maxValence: 3, cpkColor: 0xFB923C, hexColor: '#fb923c', covalentRadius: 0.82, vdwRadius: 1.92, atomicMass: 10.81, electronegativity: 2.04, category: 'metalloid' },
  C: { symbol: 'C', name: 'Carbon', atomicNumber: 6, valences: [4], maxValence: 4, cpkColor: 0x334155, hexColor: '#334155', covalentRadius: 0.77, vdwRadius: 1.70, atomicMass: 12.011, electronegativity: 2.55, category: 'nonmetal' },
  N: { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, valences: [3, 4], maxValence: 4, cpkColor: 0x2563EB, hexColor: '#2563eb', covalentRadius: 0.75, vdwRadius: 1.55, atomicMass: 14.007, electronegativity: 3.04, category: 'nonmetal' },
  O: { symbol: 'O', name: 'Oxygen', atomicNumber: 8, valences: [2], maxValence: 2, cpkColor: 0xDC2626, hexColor: '#dc2626', covalentRadius: 0.73, vdwRadius: 1.52, atomicMass: 15.999, electronegativity: 3.44, category: 'nonmetal' },
  F: { symbol: 'F', name: 'Fluorine', atomicNumber: 9, valences: [1], maxValence: 1, cpkColor: 0x10B981, hexColor: '#10b981', covalentRadius: 0.72, vdwRadius: 1.47, atomicMass: 18.998, electronegativity: 3.98, category: 'halogen' },
  Ne: { symbol: 'Ne', name: 'Neon', atomicNumber: 10, valences: [0], maxValence: 0, cpkColor: 0x06B6D4, hexColor: '#06b6d4', covalentRadius: 0.58, vdwRadius: 1.54, atomicMass: 20.180, electronegativity: 0, category: 'noble' },
  Na: { symbol: 'Na', name: 'Sodium', atomicNumber: 11, valences: [1], maxValence: 1, cpkColor: 0x8B5CF6, hexColor: '#8b5cf6', covalentRadius: 1.54, vdwRadius: 2.27, atomicMass: 22.990, electronegativity: 0.93, category: 'alkali' },
  Mg: { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, valences: [2], maxValence: 2, cpkColor: 0x059669, hexColor: '#059669', covalentRadius: 1.30, vdwRadius: 1.73, atomicMass: 24.305, electronegativity: 1.31, category: 'alkaline' },
  Al: { symbol: 'Al', name: 'Aluminium', atomicNumber: 13, valences: [3], maxValence: 3, cpkColor: 0x64748B, hexColor: '#94a3b8', covalentRadius: 1.18, vdwRadius: 1.84, atomicMass: 26.982, electronegativity: 1.61, category: 'post_transition' },
  Si: { symbol: 'Si', name: 'Silicon', atomicNumber: 14, valences: [4], maxValence: 4, cpkColor: 0x64748B, hexColor: '#94a3b8', covalentRadius: 1.11, vdwRadius: 2.10, atomicMass: 28.085, electronegativity: 1.90, category: 'metalloid' },
  P: { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, valences: [3, 5], maxValence: 5, cpkColor: 0xEA580C, hexColor: '#ea580c', covalentRadius: 1.06, vdwRadius: 1.80, atomicMass: 30.974, electronegativity: 2.19, category: 'nonmetal' },
  S: { symbol: 'S', name: 'Sulfur', atomicNumber: 16, valences: [2, 4, 6], maxValence: 6, cpkColor: 0xEAB308, hexColor: '#eab308', covalentRadius: 1.02, vdwRadius: 1.80, atomicMass: 32.06, electronegativity: 2.58, category: 'nonmetal' },
  Cl: { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, valences: [1], maxValence: 1, cpkColor: 0x16A34A, hexColor: '#16a34a', covalentRadius: 0.99, vdwRadius: 1.75, atomicMass: 35.45, electronegativity: 3.16, category: 'halogen' },
  Ar: { symbol: 'Ar', name: 'Argon', atomicNumber: 18, valences: [0], maxValence: 0, cpkColor: 0x06B6D4, hexColor: '#06b6d4', covalentRadius: 0.97, vdwRadius: 1.88, atomicMass: 39.948, electronegativity: 0, category: 'noble' },
  K: { symbol: 'K', name: 'Potassium', atomicNumber: 19, valences: [1], maxValence: 1, cpkColor: 0x8B5CF6, hexColor: '#8b5cf6', covalentRadius: 1.96, vdwRadius: 2.75, atomicMass: 39.098, electronegativity: 0.82, category: 'alkali' },
  Ca: { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, valences: [2], maxValence: 2, cpkColor: 0x10B981, hexColor: '#10b981', covalentRadius: 1.74, vdwRadius: 2.31, atomicMass: 40.078, electronegativity: 1.00, category: 'alkaline' },
  Sc: { symbol: 'Sc', name: 'Scandium', atomicNumber: 21, valences: [3], maxValence: 3, cpkColor: 0xE2E8F0, hexColor: '#e2e8f0', covalentRadius: 1.44, vdwRadius: 2.11, atomicMass: 44.956, electronegativity: 1.36, category: 'transition' },
  Ti: { symbol: 'Ti', name: 'Titanium', atomicNumber: 22, valences: [4], maxValence: 4, cpkColor: 0x94A3B8, hexColor: '#94a3b8', covalentRadius: 1.36, vdwRadius: 2.00, atomicMass: 47.867, electronegativity: 1.54, category: 'transition' },
  V: { symbol: 'V', name: 'Vanadium', atomicNumber: 23, valences: [3, 5], maxValence: 5, cpkColor: 0x64748B, hexColor: '#64748b', covalentRadius: 1.25, vdwRadius: 2.00, atomicMass: 50.942, electronegativity: 1.63, category: 'transition' },
  Cr: { symbol: 'Cr', name: 'Chromium', atomicNumber: 24, valences: [3, 6], maxValence: 6, cpkColor: 0x38BDF8, hexColor: '#38bdf8', covalentRadius: 1.27, vdwRadius: 2.00, atomicMass: 51.996, electronegativity: 1.66, category: 'transition' },
  Mn: { symbol: 'Mn', name: 'Manganese', atomicNumber: 25, valences: [2, 4, 7], maxValence: 7, cpkColor: 0x818CF8, hexColor: '#818cf8', covalentRadius: 1.39, vdwRadius: 2.00, atomicMass: 54.938, electronegativity: 1.55, category: 'transition' },
  Fe: { symbol: 'Fe', name: 'Iron', atomicNumber: 26, valences: [2, 3], maxValence: 3, cpkColor: 0xB45309, hexColor: '#b45309', covalentRadius: 1.25, vdwRadius: 2.00, atomicMass: 55.845, electronegativity: 1.83, category: 'transition' },
  Co: { symbol: 'Co', name: 'Cobalt', atomicNumber: 27, valences: [2, 3], maxValence: 3, cpkColor: 0x0284C7, hexColor: '#0284c7', covalentRadius: 1.26, vdwRadius: 2.00, atomicMass: 58.933, electronegativity: 1.88, category: 'transition' },
  Ni: { symbol: 'Ni', name: 'Nickel', atomicNumber: 28, valences: [2], maxValence: 2, cpkColor: 0x0D9488, hexColor: '#0d9488', covalentRadius: 1.21, vdwRadius: 1.63, atomicMass: 58.693, electronegativity: 1.91, category: 'transition' },
  Cu: { symbol: 'Cu', name: 'Copper', atomicNumber: 29, valences: [1, 2], maxValence: 2, cpkColor: 0xC2410C, hexColor: '#c2410c', covalentRadius: 1.38, vdwRadius: 1.40, atomicMass: 63.546, electronegativity: 1.90, category: 'transition' },
  Zn: { symbol: 'Zn', name: 'Zinc', atomicNumber: 30, valences: [2], maxValence: 2, cpkColor: 0x7DD3FC, hexColor: '#7dd3fc', covalentRadius: 1.31, vdwRadius: 1.39, atomicMass: 65.38, electronegativity: 1.65, category: 'transition' },
  Br: { symbol: 'Br', name: 'Bromine', atomicNumber: 35, valences: [1], maxValence: 1, cpkColor: 0x991B1B, hexColor: '#991b1b', covalentRadius: 1.14, vdwRadius: 1.85, atomicMass: 79.904, electronegativity: 2.96, category: 'halogen' },
  Ag: { symbol: 'Ag', name: 'Silver', atomicNumber: 47, valences: [1], maxValence: 1, cpkColor: 0xC0C0C0, hexColor: '#c0c0c0', covalentRadius: 1.53, vdwRadius: 1.72, atomicMass: 107.868, electronegativity: 1.93, category: 'transition' },
  I: { symbol: 'I', name: 'Iodine', atomicNumber: 53, valences: [1], maxValence: 1, cpkColor: 0x7E22CE, hexColor: '#7e22ce', covalentRadius: 1.33, vdwRadius: 1.98, atomicMass: 126.904, electronegativity: 2.66, category: 'halogen' },
  Xe: { symbol: 'Xe', name: 'Xenon', atomicNumber: 54, valences: [2, 4, 6], maxValence: 6, cpkColor: 0x06B6D4, hexColor: '#06b6d4', covalentRadius: 1.30, vdwRadius: 2.16, atomicMass: 131.293, electronegativity: 2.60, category: 'noble' },
  Pt: { symbol: 'Pt', name: 'Platinum', atomicNumber: 78, valences: [2, 4], maxValence: 4, cpkColor: 0x94A3B8, hexColor: '#64748b', covalentRadius: 1.28, vdwRadius: 1.75, atomicMass: 195.084, electronegativity: 2.28, category: 'transition' },
  Au: { symbol: 'Au', name: 'Gold', atomicNumber: 79, valences: [1, 3], maxValence: 3, cpkColor: 0xF59E0B, hexColor: '#f59e0b', covalentRadius: 1.44, vdwRadius: 1.66, atomicMass: 196.967, electronegativity: 2.54, category: 'transition' },
  Hg: { symbol: 'Hg', name: 'Mercury', atomicNumber: 80, valences: [1, 2], maxValence: 2, cpkColor: 0xE2E8F0, hexColor: '#e2e8f0', covalentRadius: 1.49, vdwRadius: 1.55, atomicMass: 200.592, electronegativity: 2.00, category: 'transition' },
  Pb: { symbol: 'Pb', name: 'Lead', atomicNumber: 82, valences: [2, 4], maxValence: 4, cpkColor: 0x475569, hexColor: '#475569', covalentRadius: 1.47, vdwRadius: 2.02, atomicMass: 207.2, electronegativity: 2.33, category: 'post_transition' },
  U: { symbol: 'U', name: 'Uranium', atomicNumber: 92, valences: [4, 6], maxValence: 6, cpkColor: 0x10B981, hexColor: '#10b981', covalentRadius: 1.56, vdwRadius: 1.86, atomicMass: 238.029, electronegativity: 1.38, category: 'actinide' },
};

// Category to default CPK color mapping
const CATEGORY_COLOR_MAP: Record<string, string> = {
  alkali: '#8b5cf6',
  alkaline: '#059669',
  transition: '#0284c7',
  post_transition: '#64748b',
  metalloid: '#fb923c',
  nonmetal: '#334155',
  halogen: '#16a34a',
  noble: '#06b6d4',
  lanthanide: '#d946ef',
  actinide: '#db2777',
};

// Dynamic fallback resolving any of all 118 elements
export function getElementData(symbol: string): ElementData {
  if (ELEMENT_REGISTRY[symbol]) {
    return ELEMENT_REGISTRY[symbol];
  }

  // Lookup from 118 periodic elements dataset
  const all118 = getAll118Elements();
  const match = all118.find((e) => e.symbol.toLowerCase() === symbol.toLowerCase() || e.name.toLowerCase() === symbol.toLowerCase());

  if (match) {
    const hex = CATEGORY_COLOR_MAP[match.category] || '#64748b';
    const cpk = parseInt(hex.replace('#', '0x'), 16);
    const covRad = match.covalent_radius ? match.covalent_radius / 100 : 1.25;
    const vdwRad = match.atomic_radius ? match.atomic_radius / 100 : covRad * 1.5;

    // Estimate typical valences from group
    let valences = [1];
    let maxV = 1;
    if (match.group === 1) { valences = [1]; maxV = 1; }
    else if (match.group === 2) { valences = [2]; maxV = 2; }
    else if (match.group === 13) { valences = [3]; maxV = 3; }
    else if (match.group === 14) { valences = [4]; maxV = 4; }
    else if (match.group === 15) { valences = [3, 5]; maxV = 5; }
    else if (match.group === 16) { valences = [2, 4, 6]; maxV = 6; }
    else if (match.group === 17) { valences = [1]; maxV = 1; }
    else if (match.group === 18) { valences = [0]; maxV = 0; }
    else { valences = [2, 3]; maxV = 4; } // Transition metals

    const generated: ElementData = {
      symbol: match.symbol,
      name: match.name,
      atomicNumber: match.number,
      valences,
      maxValence: maxV,
      cpkColor: cpk,
      hexColor: hex,
      covalentRadius: covRad,
      vdwRadius: vdwRad,
      atomicMass: match.mass,
      electronegativity: match.electronegativity || 1.5,
      category: match.category,
    };

    // Cache into registry
    ELEMENT_REGISTRY[match.symbol] = generated;
    return generated;
  }

  // Fallback Carbon
  return ELEMENT_REGISTRY['C'];
}

export interface AtomNode {
  id: string;
  index: number;
  symbol: string;
  atomic_number?: number;
  x: number;
  y: number;
  z: number;
  hybridization?: string;
  formal_charge?: number;
}

export interface BondEdge {
  id: string;
  from: string | number;
  to: string | number;
  order: 1 | 2 | 3;
}

export interface OrbitalsSummary {
  homo_ev: number;
  lumo_ev: number;
  band_gap_ev: number;
  chemical_hardness_ev: number;
  chemical_softness_ev_inv: number;
  chemical_potential_ev: number;
  electronegativity_ev: number;
  electrophilicity_index: number;
  hsab_classification: string;
}

export interface OrbitalLobe {
  center: [number, number, number];
  phase: 'positive' | 'negative';
  radius: number;
}

export interface MoleculeStructure {
  id: string;
  name: string;
  formula: string;
  iupacName: string;
  category: 'vsepr' | 'organic' | 'inorganic' | 'biomolecule' | 'engineering';
  geometry: string;
  vseprNotation?: string;
  idealBondAngle: string;
  dipoleMoment: string;
  molarMass: number;
  description: string;
  provenance: string;
  raw_xyz: string;
  atoms: AtomNode[];
  bonds: BondEdge[];
  orbitals_summary: OrbitalsSummary;
  ai_summary?: string;
  homoLobes?: OrbitalLobe[];
  lumoLobes?: OrbitalLobe[];
}

export type DisplayStyle = 'ballAndStick' | 'spaceFilling' | 'licorice' | 'wireframe';
export type SurfaceStyle = 'none' | 'vdw' | 'sas';
export type MeasurementMode = 'distance' | 'angle' | 'dihedral' | 'none';
export type OrbitalType = 'HOMO' | 'LUMO' | 'NONE';
export type BuilderToolMode = 'addAtom' | 'drawBond' | 'replaceElement' | 'erase' | 'select';

export interface MeasurementResult {
  id: string;
  type: 'distance' | 'angle' | 'dihedral';
  atomIndices: number[];
  atomSymbols: string[];
  value: number;
  unit: string;
  label: string;
}

export interface ValidationFeedback {
  isValid: boolean;
  warnings: string[];
  formula: string;
  molarMass: number;
  atomValenceMap: Record<string, { current: number; max: number; valid: boolean }>;
}
