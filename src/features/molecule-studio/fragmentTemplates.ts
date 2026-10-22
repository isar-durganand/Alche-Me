/**
 * Alche-Me — 3D Molecular Fragment & Ring Template Library
 * Modeled after ArgusLab, MolDraw (moldraw.com), and ChemDraw standard fragment libraries.
 * Provides ready-to-insert rings, functional groups, and attachment algorithms.
 */

import { AtomNode, BondEdge, ElementSymbol } from './types';

export interface FragmentTemplate {
  id: string;
  name: string;
  formula: string;
  category: 'ring' | 'functional_group' | 'alkyl';
  description: string;
  atoms: { symbol: ElementSymbol; x: number; y: number; z: number }[];
  bonds: { fromIndex: number; toIndex: number; order: 1 | 2 | 3 }[];
  attachmentAtomIndex: number; // The atom that connects when attaching to a host
}

export const FRAGMENT_TEMPLATES: FragmentTemplate[] = [
  // ==========================================
  // RINGS
  // ==========================================
  {
    id: 'benzene',
    name: 'Benzene Ring',
    formula: 'C₆H₆',
    category: 'ring',
    description: 'Planar aromatic 6-membered ring (sp² hybridized, D6h symmetry)',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'C', x: 1.397, y: 0, z: 0 },
      { symbol: 'C', x: 0.698, y: 1.209, z: 0 },
      { symbol: 'C', x: -0.698, y: 1.209, z: 0 },
      { symbol: 'C', x: -1.397, y: 0, z: 0 },
      { symbol: 'C', x: -0.698, y: -1.209, z: 0 },
      { symbol: 'C', x: 0.698, y: -1.209, z: 0 },
      { symbol: 'H', x: 2.477, y: 0, z: 0 },
      { symbol: 'H', x: 1.239, y: 2.146, z: 0 },
      { symbol: 'H', x: -1.239, y: 2.146, z: 0 },
      { symbol: 'H', x: -2.477, y: 0, z: 0 },
      { symbol: 'H', x: -1.239, y: -2.146, z: 0 },
      { symbol: 'H', x: 1.239, y: -2.146, z: 0 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 2 },
      { fromIndex: 1, toIndex: 2, order: 1 },
      { fromIndex: 2, toIndex: 3, order: 2 },
      { fromIndex: 3, toIndex: 4, order: 1 },
      { fromIndex: 4, toIndex: 5, order: 2 },
      { fromIndex: 5, toIndex: 0, order: 1 },
      { fromIndex: 0, toIndex: 6, order: 1 },
      { fromIndex: 1, toIndex: 7, order: 1 },
      { fromIndex: 2, toIndex: 8, order: 1 },
      { fromIndex: 3, toIndex: 9, order: 1 },
      { fromIndex: 4, toIndex: 10, order: 1 },
      { fromIndex: 5, toIndex: 11, order: 1 },
    ],
  },
  {
    id: 'cyclohexane_chair',
    name: 'Cyclohexane (Chair)',
    formula: 'C₆H₁₂',
    category: 'ring',
    description: 'Strain-free chair conformation with axial and equatorial valences',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'C', x: 1.261, y: 0.000, z: 0.250 },
      { symbol: 'C', x: 0.631, y: 1.092, z: -0.250 },
      { symbol: 'C', x: -0.631, y: 1.092, z: 0.250 },
      { symbol: 'C', x: -1.261, y: 0.000, z: -0.250 },
      { symbol: 'C', x: -0.631, y: -1.092, z: 0.250 },
      { symbol: 'C', x: 0.631, y: -1.092, z: -0.250 },
      { symbol: 'H', x: 1.340, y: 0.000, z: 1.350 },
      { symbol: 'H', x: 2.270, y: 0.000, z: -0.170 },
      { symbol: 'H', x: 0.670, y: 1.160, z: -1.350 },
      { symbol: 'H', x: 1.140, y: 1.970, z: 0.170 },
      { symbol: 'H', x: -0.670, y: 1.160, z: 1.350 },
      { symbol: 'H', x: -1.140, y: 1.970, z: -0.170 },
      { symbol: 'H', x: -1.340, y: 0.000, z: -1.350 },
      { symbol: 'H', x: -2.270, y: 0.000, z: 0.170 },
      { symbol: 'H', x: -0.670, y: -1.160, z: 1.350 },
      { symbol: 'H', x: -1.140, y: -1.970, z: -0.170 },
      { symbol: 'H', x: 0.670, y: -1.160, z: -1.350 },
      { symbol: 'H', x: 1.140, y: -1.970, z: 0.170 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 1 },
      { fromIndex: 1, toIndex: 2, order: 1 },
      { fromIndex: 2, toIndex: 3, order: 1 },
      { fromIndex: 3, toIndex: 4, order: 1 },
      { fromIndex: 4, toIndex: 5, order: 1 },
      { fromIndex: 5, toIndex: 0, order: 1 },
      { fromIndex: 0, toIndex: 6, order: 1 },
      { fromIndex: 0, toIndex: 7, order: 1 },
      { fromIndex: 1, toIndex: 8, order: 1 },
      { fromIndex: 1, toIndex: 9, order: 1 },
      { fromIndex: 2, toIndex: 10, order: 1 },
      { fromIndex: 2, toIndex: 11, order: 1 },
      { fromIndex: 3, toIndex: 12, order: 1 },
      { fromIndex: 3, toIndex: 13, order: 1 },
      { fromIndex: 4, toIndex: 14, order: 1 },
      { fromIndex: 4, toIndex: 15, order: 1 },
      { fromIndex: 5, toIndex: 16, order: 1 },
      { fromIndex: 5, toIndex: 17, order: 1 },
    ],
  },
  {
    id: 'cyclopentane',
    name: 'Cyclopentane',
    formula: 'C₅H₁₀',
    category: 'ring',
    description: '5-membered cycloalkane ring (envelope conformation)',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'C', x: 1.220, y: 0.000, z: 0.000 },
      { symbol: 'C', x: 0.377, y: 1.160, z: 0.000 },
      { symbol: 'C', x: -0.987, y: 0.717, z: 0.150 },
      { symbol: 'C', x: -0.987, y: -0.717, z: -0.150 },
      { symbol: 'C', x: 0.377, y: -1.160, z: 0.000 },
      { symbol: 'H', x: 1.830, y: 0.000, z: 0.900 },
      { symbol: 'H', x: 1.830, y: 0.000, z: -0.900 },
      { symbol: 'H', x: 0.570, y: 1.740, z: 0.900 },
      { symbol: 'H', x: 0.570, y: 1.740, z: -0.900 },
      { symbol: 'H', x: -1.480, y: 1.080, z: 1.050 },
      { symbol: 'H', x: -1.550, y: 1.120, z: -0.690 },
      { symbol: 'H', x: -1.480, y: -1.080, z: -1.050 },
      { symbol: 'H', x: -1.550, y: -1.120, z: 0.690 },
      { symbol: 'H', x: 0.570, y: -1.740, z: 0.900 },
      { symbol: 'H', x: 0.570, y: -1.740, z: -0.900 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 1 },
      { fromIndex: 1, toIndex: 2, order: 1 },
      { fromIndex: 2, toIndex: 3, order: 1 },
      { fromIndex: 3, toIndex: 4, order: 1 },
      { fromIndex: 4, toIndex: 0, order: 1 },
      { fromIndex: 0, toIndex: 5, order: 1 },
      { fromIndex: 0, toIndex: 6, order: 1 },
      { fromIndex: 1, toIndex: 7, order: 1 },
      { fromIndex: 1, toIndex: 8, order: 1 },
      { fromIndex: 2, toIndex: 9, order: 1 },
      { fromIndex: 2, toIndex: 10, order: 1 },
      { fromIndex: 3, toIndex: 11, order: 1 },
      { fromIndex: 3, toIndex: 12, order: 1 },
      { fromIndex: 4, toIndex: 13, order: 1 },
      { fromIndex: 4, toIndex: 14, order: 1 },
    ],
  },
  {
    id: 'pyridine',
    name: 'Pyridine',
    formula: 'C₅H₅N',
    category: 'ring',
    description: 'Heterocyclic 6-membered aromatic ring with sp² Nitrogen',
    attachmentAtomIndex: 1,
    atoms: [
      { symbol: 'N', x: 0.000, y: 1.390, z: 0 },
      { symbol: 'C', x: 1.150, y: 0.680, z: 0 },
      { symbol: 'C', x: 1.200, y: -0.710, z: 0 },
      { symbol: 'C', x: 0.000, y: -1.410, z: 0 },
      { symbol: 'C', x: -1.200, y: -0.710, z: 0 },
      { symbol: 'C', x: -1.150, y: 0.680, z: 0 },
      { symbol: 'H', x: 2.060, y: 1.270, z: 0 },
      { symbol: 'H', x: 2.140, y: -1.250, z: 0 },
      { symbol: 'H', x: 0.000, y: -2.490, z: 0 },
      { symbol: 'H', x: -2.140, y: -1.250, z: 0 },
      { symbol: 'H', x: -2.060, y: 1.270, z: 0 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 2 },
      { fromIndex: 1, toIndex: 2, order: 1 },
      { fromIndex: 2, toIndex: 3, order: 2 },
      { fromIndex: 3, toIndex: 4, order: 1 },
      { fromIndex: 4, toIndex: 5, order: 2 },
      { fromIndex: 5, toIndex: 0, order: 1 },
      { fromIndex: 1, toIndex: 6, order: 1 },
      { fromIndex: 2, toIndex: 7, order: 1 },
      { fromIndex: 3, toIndex: 8, order: 1 },
      { fromIndex: 4, toIndex: 9, order: 1 },
      { fromIndex: 5, toIndex: 10, order: 1 },
    ],
  },

  // ==========================================
  // FUNCTIONAL GROUPS
  // ==========================================
  {
    id: 'hydroxyl',
    name: 'Hydroxyl (-OH)',
    formula: '-OH',
    category: 'functional_group',
    description: 'Alcohol / Phenol oxygen functional group',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'O', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'H', x: 0.960, y: 0.200, z: 0.000 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 1 },
    ],
  },
  {
    id: 'carbonyl',
    name: 'Carbonyl (=O)',
    formula: '=O',
    category: 'functional_group',
    description: 'Oxo group (ketone/aldehyde/ester carbonyl)',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'O', x: 0.000, y: 0.000, z: 0.000 },
    ],
    bonds: [],
  },
  {
    id: 'carboxyl',
    name: 'Carboxyl (-COOH)',
    formula: '-COOH',
    category: 'functional_group',
    description: 'Carboxylic acid group with carbonyl and hydroxyl',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'C', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'O', x: 0.650, y: 1.050, z: 0.000 },
      { symbol: 'O', x: 0.700, y: -1.150, z: 0.000 },
      { symbol: 'H', x: 1.660, y: -0.980, z: 0.000 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 2 },
      { fromIndex: 0, toIndex: 2, order: 1 },
      { fromIndex: 2, toIndex: 3, order: 1 },
    ],
  },
  {
    id: 'amino',
    name: 'Amino (-NH₂)',
    formula: '-NH₂',
    category: 'functional_group',
    description: 'Primary amine group (pyramidal geometry)',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'N', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'H', x: 0.820, y: 0.580, z: 0.000 },
      { symbol: 'H', x: -0.350, y: 0.580, z: 0.820 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 1 },
      { fromIndex: 0, toIndex: 2, order: 1 },
    ],
  },
  {
    id: 'nitro',
    name: 'Nitro (-NO₂)',
    formula: '-NO₂',
    category: 'functional_group',
    description: 'Nitro group with resonant N-O bonds',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'N', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'O', x: 0.750, y: 0.950, z: 0.000 },
      { symbol: 'O', x: -0.750, y: 0.950, z: 0.000 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 2 },
      { fromIndex: 0, toIndex: 2, order: 1 },
    ],
  },
  {
    id: 'cyano',
    name: 'Cyano (-C≡N)',
    formula: '-CN',
    category: 'functional_group',
    description: 'Nitrile group with linear sp C≡N triple bond',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'C', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'N', x: 1.160, y: 0.000, z: 0.000 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 3 },
    ],
  },
  {
    id: 'thiol',
    name: 'Thiol (-SH)',
    formula: '-SH',
    category: 'functional_group',
    description: 'Mercapto group with sulfur-hydrogen bond',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'S', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'H', x: 1.340, y: 0.200, z: 0.000 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 1 },
    ],
  },
  {
    id: 'trifluoromethyl',
    name: 'Trifluoromethyl (-CF₃)',
    formula: '-CF₃',
    category: 'functional_group',
    description: 'Strongly electron-withdrawing fluorinated methyl group',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'C', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'F', x: 0.000, y: 1.330, z: 0.000 },
      { symbol: 'F', x: 1.150, y: -0.660, z: 0.000 },
      { symbol: 'F', x: -1.150, y: -0.660, z: 0.000 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 1 },
      { fromIndex: 0, toIndex: 2, order: 1 },
      { fromIndex: 0, toIndex: 3, order: 1 },
    ],
  },

  // ==========================================
  // ALKYL FRAGMENTS
  // ==========================================
  {
    id: 'methyl',
    name: 'Methyl (-CH₃)',
    formula: '-CH₃',
    category: 'alkyl',
    description: 'Tetrahedral sp³ methyl group',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'C', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'H', x: 0.000, y: 1.090, z: 0.000 },
      { symbol: 'H', x: 1.030, y: -0.360, z: 0.000 },
      { symbol: 'H', x: -0.510, y: -0.360, z: 0.890 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 1 },
      { fromIndex: 0, toIndex: 2, order: 1 },
      { fromIndex: 0, toIndex: 3, order: 1 },
    ],
  },
  {
    id: 'ethyl',
    name: 'Ethyl (-C₂H₅)',
    formula: '-C₂H₅',
    category: 'alkyl',
    description: 'Ethyl 2-carbon aliphatic group',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'C', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'C', x: 1.540, y: 0.000, z: 0.000 },
      { symbol: 'H', x: -0.360, y: 1.030, z: 0.000 },
      { symbol: 'H', x: -0.360, y: -0.510, z: 0.890 },
      { symbol: 'H', x: 1.900, y: 1.030, z: 0.000 },
      { symbol: 'H', x: 1.900, y: -0.510, z: 0.890 },
      { symbol: 'H', x: 1.900, y: -0.510, z: -0.890 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 1 },
      { fromIndex: 0, toIndex: 2, order: 1 },
      { fromIndex: 0, toIndex: 3, order: 1 },
      { fromIndex: 1, toIndex: 4, order: 1 },
      { fromIndex: 1, toIndex: 5, order: 1 },
      { fromIndex: 1, toIndex: 6, order: 1 },
    ],
  },
  {
    id: 'isopropyl',
    name: 'Isopropyl (-CH(CH₃)₂)',
    formula: '-C₃H₇',
    category: 'alkyl',
    description: 'Branched isopropyl alkyl group',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'C', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'C', x: 1.250, y: 0.880, z: 0.000 },
      { symbol: 'C', x: -1.250, y: 0.880, z: 0.000 },
      { symbol: 'H', x: 0.000, y: -0.630, z: 0.890 },
      { symbol: 'H', x: 1.250, y: 1.510, z: 0.890 },
      { symbol: 'H', x: 1.250, y: 1.510, z: -0.890 },
      { symbol: 'H', x: 2.160, y: 0.270, z: 0.000 },
      { symbol: 'H', x: -1.250, y: 1.510, z: 0.890 },
      { symbol: 'H', x: -1.250, y: 1.510, z: -0.890 },
      { symbol: 'H', x: -2.160, y: 0.270, z: 0.000 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 1 },
      { fromIndex: 0, toIndex: 2, order: 1 },
      { fromIndex: 0, toIndex: 3, order: 1 },
      { fromIndex: 1, toIndex: 4, order: 1 },
      { fromIndex: 1, toIndex: 5, order: 1 },
      { fromIndex: 1, toIndex: 6, order: 1 },
      { fromIndex: 2, toIndex: 7, order: 1 },
      { fromIndex: 2, toIndex: 8, order: 1 },
      { fromIndex: 2, toIndex: 9, order: 1 },
    ],
  },
  {
    id: 'phenyl',
    name: 'Phenyl (-C₆H₅)',
    formula: '-C₆H₅',
    category: 'alkyl',
    description: 'Aromatic phenyl substituent group',
    attachmentAtomIndex: 0,
    atoms: [
      { symbol: 'C', x: 0.000, y: 0.000, z: 0.000 },
      { symbol: 'C', x: 0.700, y: 1.210, z: 0.000 },
      { symbol: 'C', x: 2.100, y: 1.210, z: 0.000 },
      { symbol: 'C', x: 2.800, y: 0.000, z: 0.000 },
      { symbol: 'C', x: 2.100, y: -1.210, z: 0.000 },
      { symbol: 'C', x: 0.700, y: -1.210, z: 0.000 },
      { symbol: 'H', x: 0.160, y: 2.150, z: 0.000 },
      { symbol: 'H', x: 2.640, y: 2.150, z: 0.000 },
      { symbol: 'H', x: 3.880, y: 0.000, z: 0.000 },
      { symbol: 'H', x: 2.640, y: -2.150, z: 0.000 },
      { symbol: 'H', x: 0.160, y: -2.150, z: 0.000 },
    ],
    bonds: [
      { fromIndex: 0, toIndex: 1, order: 2 },
      { fromIndex: 1, toIndex: 2, order: 1 },
      { fromIndex: 2, toIndex: 3, order: 2 },
      { fromIndex: 3, toIndex: 4, order: 1 },
      { fromIndex: 4, toIndex: 5, order: 2 },
      { fromIndex: 5, toIndex: 0, order: 1 },
      { fromIndex: 1, toIndex: 6, order: 1 },
      { fromIndex: 2, toIndex: 7, order: 1 },
      { fromIndex: 3, toIndex: 8, order: 1 },
      { fromIndex: 4, toIndex: 9, order: 1 },
      { fromIndex: 5, toIndex: 10, order: 1 },
    ],
  },
];

/**
 * Append or attach a FragmentTemplate to an existing molecule
 */
export function insertFragment(
  currentAtoms: AtomNode[],
  currentBonds: BondEdge[],
  template: FragmentTemplate,
  hostAtomIndex?: number
): { newAtoms: AtomNode[]; newBonds: BondEdge[] } {
  const newAtoms = [...currentAtoms];
  const newBonds = [...currentBonds];
  const baseIndex = newAtoms.length;

  let originX = 0;
  let originY = 0;
  let originZ = 0;
  let attachBond = false;
  let hostAtomId = '';

  if (typeof hostAtomIndex === 'number' && hostAtomIndex >= 0 && hostAtomIndex < currentAtoms.length) {
    const host = currentAtoms[hostAtomIndex];
    hostAtomId = host.id;
    attachBond = true;
    // Calculate offset vector for clean placement
    originX = host.x + 1.50;
    originY = host.y + 0.30;
    originZ = host.z + 0.30;
  } else if (currentAtoms.length > 0) {
    // Offset from center of current molecule
    let maxX = -Infinity;
    for (const a of currentAtoms) {
      if (a.x > maxX) maxX = a.x;
    }
    originX = maxX + 2.5;
  }

  // Create unique id prefix
  const fragPrefix = `frag-${Date.now()}`;
  const templateAtomIdMap: string[] = [];

  // Add atoms with coordinate offsets
  template.atoms.forEach((tAtom, idx) => {
    const atomId = `${fragPrefix}-${idx}`;
    templateAtomIdMap.push(atomId);
    newAtoms.push({
      id: atomId,
      index: baseIndex + idx,
      symbol: tAtom.symbol,
      x: Math.round((originX + tAtom.x) * 1000) / 1000,
      y: Math.round((originY + tAtom.y) * 1000) / 1000,
      z: Math.round((originZ + tAtom.z) * 1000) / 1000,
    });
  });

  // Add internal template bonds
  template.bonds.forEach((tBond, idx) => {
    newBonds.push({
      id: `${fragPrefix}-b-${idx}`,
      from: templateAtomIdMap[tBond.fromIndex],
      to: templateAtomIdMap[tBond.toIndex],
      order: tBond.order,
    });
  });

  // If attached to a host atom, create link bond
  if (attachBond && hostAtomId) {
    const attachAtomId = templateAtomIdMap[template.attachmentAtomIndex] || templateAtomIdMap[0];
    const order = template.id === 'carbonyl' ? 2 : 1;
    newBonds.push({
      id: `${fragPrefix}-attach`,
      from: hostAtomId,
      to: attachAtomId,
      order: order as 1 | 2 | 3,
    });
  }

  return { newAtoms, newBonds };
}
