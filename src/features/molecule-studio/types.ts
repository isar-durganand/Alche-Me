/**
 * Alche-Me — 3D Molecular Studio & HOMO-LUMO Quantum Frontier Types
 * Standard IUPAC, Bondi radii, CPK colors, and Frontier Molecular Orbital Theory (Fukui-Hoffmann).
 */

export type ElementSymbol = 
  | 'H' | 'He' | 'Li' | 'Be' | 'B' | 'C' | 'N' | 'O' | 'F' | 'Ne'
  | 'Na' | 'Mg' | 'Al' | 'Si' | 'P' | 'S' | 'Cl' | 'Ar'
  | 'K' | 'Ca' | 'Fe' | 'Cu' | 'Zn' | 'Br' | 'I' | 'Pt' | 'Xe';

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
}

export const ELEMENT_REGISTRY: Record<string, ElementData> = {
  H: { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, valences: [1], maxValence: 1, cpkColor: 0xF8FAFC, hexColor: '#ffffff', covalentRadius: 0.32, vdwRadius: 1.20, atomicMass: 1.008, electronegativity: 2.20 },
  C: { symbol: 'C', name: 'Carbon', atomicNumber: 6, valences: [4], maxValence: 4, cpkColor: 0x334155, hexColor: '#334155', covalentRadius: 0.77, vdwRadius: 1.70, atomicMass: 12.011, electronegativity: 2.55 },
  N: { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, valences: [3, 4], maxValence: 4, cpkColor: 0x2563EB, hexColor: '#2563eb', covalentRadius: 0.75, vdwRadius: 1.55, atomicMass: 14.007, electronegativity: 3.04 },
  O: { symbol: 'O', name: 'Oxygen', atomicNumber: 8, valences: [2], maxValence: 2, cpkColor: 0xDC2626, hexColor: '#dc2626', covalentRadius: 0.73, vdwRadius: 1.52, atomicMass: 15.999, electronegativity: 3.44 },
  F: { symbol: 'F', name: 'Fluorine', atomicNumber: 9, valences: [1], maxValence: 1, cpkColor: 0x10B981, hexColor: '#10b981', covalentRadius: 0.72, vdwRadius: 1.47, atomicMass: 18.998, electronegativity: 3.98 },
  Cl: { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, valences: [1], maxValence: 1, cpkColor: 0x16A34A, hexColor: '#16a34a', covalentRadius: 0.99, vdwRadius: 1.75, atomicMass: 35.45, electronegativity: 3.16 },
  Br: { symbol: 'Br', name: 'Bromine', atomicNumber: 35, valences: [1], maxValence: 1, cpkColor: 0x991B1B, hexColor: '#991b1b', covalentRadius: 1.14, vdwRadius: 1.85, atomicMass: 79.904, electronegativity: 2.96 },
  I: { symbol: 'I', name: 'Iodine', atomicNumber: 53, valences: [1], maxValence: 1, cpkColor: 0x7E22CE, hexColor: '#7e22ce', covalentRadius: 1.33, vdwRadius: 1.98, atomicMass: 126.904, electronegativity: 2.66 },
  P: { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, valences: [3, 5], maxValence: 5, cpkColor: 0xEA580C, hexColor: '#ea580c', covalentRadius: 1.06, vdwRadius: 1.80, atomicMass: 30.974, electronegativity: 2.19 },
  S: { symbol: 'S', name: 'Sulfur', atomicNumber: 16, valences: [2, 4, 6], maxValence: 6, cpkColor: 0xEAB308, hexColor: '#eab308', covalentRadius: 1.02, vdwRadius: 1.80, atomicMass: 32.06, electronegativity: 2.58 },
  B: { symbol: 'B', name: 'Boron', atomicNumber: 5, valences: [3], maxValence: 3, cpkColor: 0xFB923C, hexColor: '#fb923c', covalentRadius: 0.82, vdwRadius: 1.92, atomicMass: 10.81, electronegativity: 2.04 },
  Si: { symbol: 'Si', name: 'Silicon', atomicNumber: 14, valences: [4], maxValence: 4, cpkColor: 0x64748B, hexColor: '#94a3b8', covalentRadius: 1.11, vdwRadius: 2.10, atomicMass: 28.085, electronegativity: 1.90 },
  Pt: { symbol: 'Pt', name: 'Platinum', atomicNumber: 78, valences: [2, 4], maxValence: 4, cpkColor: 0x94A3B8, hexColor: '#64748b', covalentRadius: 1.28, vdwRadius: 1.75, atomicMass: 195.084, electronegativity: 2.28 },
  Fe: { symbol: 'Fe', name: 'Iron', atomicNumber: 26, valences: [2, 3], maxValence: 3, cpkColor: 0xB45309, hexColor: '#b45309', covalentRadius: 1.25, vdwRadius: 2.00, atomicMass: 55.845, electronegativity: 1.83 },
  Na: { symbol: 'Na', name: 'Sodium', atomicNumber: 11, valences: [1], maxValence: 1, cpkColor: 0x8B5CF6, hexColor: '#8b5cf6', covalentRadius: 1.54, vdwRadius: 2.27, atomicMass: 22.990, electronegativity: 0.93 },
  Ca: { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, valences: [2], maxValence: 2, cpkColor: 0x10B981, hexColor: '#10b981', covalentRadius: 1.74, vdwRadius: 2.31, atomicMass: 40.078, electronegativity: 1.00 },
};

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
export type MeasurementMode = 'distance' | 'angle' | 'dihedral' | 'none';
export type OrbitalType = 'HOMO' | 'LUMO' | 'NONE';

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
