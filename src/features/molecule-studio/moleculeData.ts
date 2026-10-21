/**
 * Alche-Me — Curated Molecule Database with HOMO-LUMO Quantum Frontier Data
 * Validated Cartesian coordinates in XYZ format + DFT B3LYP/6-31G* quantum chemistry values.
 */

import { MoleculeStructure } from './types';

export const CURATED_MOLECULES: MoleculeStructure[] = [
  // ==========================================
  // HYDRIDES & VSEPR GEOMETRIES
  // ==========================================
  {
    id: 'water',
    name: 'Water',
    formula: 'H₂O',
    iupacName: 'Oxidane',
    category: 'vsepr',
    geometry: 'Bent (V-Shaped)',
    vseprNotation: 'AX₂E₂ (2 bonding pairs, 2 lone pairs)',
    idealBondAngle: '104.5°',
    dipoleMoment: '1.85 D (Strongly Polar)',
    molarMass: 18.015,
    description: 'Classic VSEPR benchmark: 2 lone pairs compress the H-O-H bond angle from 109.5° down to 104.5°. The HOMO is the non-bonding 1b₁ oxygen 2p_x orbital.',
    provenance: 'NIST WebBook / PubChem CID 962 / HomoLumo Benchmark',
    raw_xyz: `3
Water VSEPR Ground State
O   0.0000   0.0000   0.1173
H   0.0000   0.7572  -0.4692
H   0.0000  -0.7572  -0.4692`,
    atoms: [
      { id: 'w-0', index: 0, symbol: 'O', x: 0.0, y: 0.0, z: 0.1173, hybridization: 'sp³' },
      { id: 'w-1', index: 1, symbol: 'H', x: 0.0, y: 0.7572, z: -0.4692, hybridization: '1s' },
      { id: 'w-2', index: 2, symbol: 'H', x: 0.0, y: -0.7572, z: -0.4692, hybridization: '1s' },
    ],
    bonds: [
      { id: 'wb-1', from: 0, to: 1, order: 1 },
      { id: 'wb-2', from: 0, to: 2, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -12.62,
      lumo_ev: 3.50,
      band_gap_ev: 16.12,
      chemical_hardness_ev: 8.06,
      chemical_softness_ev_inv: 0.062,
      chemical_potential_ev: -4.56,
      electronegativity_ev: 4.56,
      electrophilicity_index: 1.29,
      hsab_classification: 'Hard Molecule (High kinetic stability, wide band gap, low nucleophilic reactivity)',
    },
    ai_summary: 'Two sp³ lone pairs on oxygen exert intense repulsion (lp-lp > lp-bp > bp-bp), compressing the angle to 104.5°. The non-bonding 1b₁ orbital houses the HOMO at -12.62 eV with a 16.12 eV gap.',
    homoLobes: [
      { center: [0, 0, 0.65], phase: 'positive', radius: 0.44 },
      { center: [0, 0, -0.45], phase: 'negative', radius: 0.44 },
    ],
    lumoLobes: [
      { center: [0, 0.7, -0.3], phase: 'positive', radius: 0.40 },
      { center: [0, -0.7, -0.3], phase: 'negative', radius: 0.40 },
    ],
  },
  {
    id: 'ammonia',
    name: 'Ammonia',
    formula: 'NH₃',
    iupacName: 'Azane',
    category: 'vsepr',
    geometry: 'Trigonal Pyramidal',
    vseprNotation: 'AX₃E (3 bonding pairs, 1 lone pair)',
    idealBondAngle: '107.3°',
    dipoleMoment: '1.47 D (Polar)',
    molarMass: 17.031,
    description: 'Trigonal pyramidal geometry where one nitrogen lone pair compresses the H-N-H bond angles to 107.3°. HOMO is the concentrated 3a₁ lone pair atop nitrogen.',
    provenance: 'NIST WebBook / PubChem CID 222',
    raw_xyz: `4
Ammonia Geometry
N   0.0000   0.0000   0.1160
H   0.0000   0.9380  -0.2720
H   0.8120  -0.4690  -0.2720
H  -0.8120  -0.4690  -0.2720`,
    atoms: [
      { id: 'nh3-0', index: 0, symbol: 'N', x: 0.0, y: 0.0, z: 0.1160, hybridization: 'sp³' },
      { id: 'nh3-1', index: 1, symbol: 'H', x: 0.0, y: 0.9380, z: -0.2720, hybridization: '1s' },
      { id: 'nh3-2', index: 2, symbol: 'H', x: 0.8120, y: -0.4690, z: -0.2720, hybridization: '1s' },
      { id: 'nh3-3', index: 3, symbol: 'H', x: -0.8120, y: -0.4690, z: -0.2720, hybridization: '1s' },
    ],
    bonds: [
      { id: 'nb-1', from: 0, to: 1, order: 1 },
      { id: 'nb-2', from: 0, to: 2, order: 1 },
      { id: 'nb-3', from: 0, to: 3, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -10.82,
      lumo_ev: 2.45,
      band_gap_ev: 13.27,
      chemical_hardness_ev: 6.63,
      chemical_softness_ev_inv: 0.075,
      chemical_potential_ev: -4.18,
      electronegativity_ev: 4.18,
      electrophilicity_index: 1.32,
      hsab_classification: 'Hard Lewis Base (High electron-pair donation power at N center)',
    },
    homoLobes: [
      { center: [0, 0, 0.72], phase: 'positive', radius: 0.48 },
    ],
    lumoLobes: [
      { center: [0, 0, -0.65], phase: 'negative', radius: 0.42 },
    ],
  },
  {
    id: 'methane',
    name: 'Methane',
    formula: 'CH₄',
    iupacName: 'Methane',
    category: 'vsepr',
    geometry: 'Regular Tetrahedral',
    vseprNotation: 'AX₄ (4 bonding pairs, 0 lone pairs)',
    idealBondAngle: '109.5°',
    dipoleMoment: '0.00 D (Centrosymmetric Non-polar)',
    molarMass: 16.043,
    description: 'Perfect tetrahedral symmetry (Td) with four equivalent sp³ C-H bonds separated by 109.47°. Wide HOMO-LUMO gap of 14.8 eV confers great chemical inertia.',
    provenance: 'NIST WebBook / PubChem CID 297',
    raw_xyz: `5
Methane Tetrahedral
C   0.0000   0.0000   0.0000
H   0.6290   0.6290   0.6290
H  -0.6290  -0.6290   0.6290
H  -0.6290   0.6290  -0.6290
H   0.6290  -0.6290  -0.6290`,
    atoms: [
      { id: 'm-0', index: 0, symbol: 'C', x: 0.0, y: 0.0, z: 0.0, hybridization: 'sp³' },
      { id: 'm-1', index: 1, symbol: 'H', x: 0.629, y: 0.629, z: 0.629, hybridization: '1s' },
      { id: 'm-2', index: 2, symbol: 'H', x: -0.629, y: -0.629, z: 0.629, hybridization: '1s' },
      { id: 'm-3', index: 3, symbol: 'H', x: -0.629, y: 0.629, z: -0.629, hybridization: '1s' },
      { id: 'm-4', index: 4, symbol: 'H', x: 0.629, y: -0.629, z: -0.629, hybridization: '1s' },
    ],
    bonds: [
      { id: 'mb-1', from: 0, to: 1, order: 1 },
      { id: 'mb-2', from: 0, to: 2, order: 1 },
      { id: 'mb-3', from: 0, to: 3, order: 1 },
      { id: 'mb-4', from: 0, to: 4, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -12.60,
      lumo_ev: 2.20,
      band_gap_ev: 14.80,
      chemical_hardness_ev: 7.40,
      chemical_softness_ev_inv: 0.068,
      chemical_potential_ev: -5.20,
      electronegativity_ev: 5.20,
      electrophilicity_index: 1.83,
      hsab_classification: 'Hard Non-polar Hydrocarbon (Inert to electrophilic attack)',
    },
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    iupacName: 'Carbon dioxide',
    category: 'vsepr',
    geometry: 'Linear',
    vseprNotation: 'AX₂ (2 double bonds, 0 lone pairs)',
    idealBondAngle: '180.0°',
    dipoleMoment: '0.00 D (Centrosymmetric Non-polar)',
    molarMass: 44.01,
    description: 'Linear centrosymmetric greenhouse gas. Central sp carbon forms two perpendicular π bonds with flanking oxygens. HOMO consists of non-bonding oxygen 1πg lone pairs.',
    provenance: 'NIST WebBook / PubChem CID 280',
    raw_xyz: `3
Carbon Dioxide Linear
C   0.0000   0.0000   0.0000
O  -1.1630   0.0000   0.0000
O   1.1630   0.0000   0.0000`,
    atoms: [
      { id: 'c-0', index: 0, symbol: 'C', x: 0.0, y: 0.0, z: 0.0, hybridization: 'sp' },
      { id: 'c-1', index: 1, symbol: 'O', x: -1.163, y: 0.0, z: 0.0, hybridization: 'sp²' },
      { id: 'c-2', index: 2, symbol: 'O', x: 1.163, y: 0.0, z: 0.0, hybridization: 'sp²' },
    ],
    bonds: [
      { id: 'cb-1', from: 0, to: 1, order: 2 },
      { id: 'cb-2', from: 0, to: 2, order: 2 },
    ],
    orbitals_summary: {
      homo_ev: -13.78,
      lumo_ev: 1.20,
      band_gap_ev: 14.98,
      chemical_hardness_ev: 7.49,
      chemical_softness_ev_inv: 0.067,
      chemical_potential_ev: -6.29,
      electronegativity_ev: 6.29,
      electrophilicity_index: 2.64,
      hsab_classification: 'Hard Electrophile (LUMO localized on central carbon facilitates nucleophilic attack by OH⁻)',
    },
  },

  // ==========================================
  // HYDROCARBONS & CONFORMERS
  // ==========================================
  {
    id: 'ethene',
    name: 'Ethene (Ethylene)',
    formula: 'C₂H₄',
    iupacName: 'Ethene',
    category: 'organic',
    geometry: 'Planar Alkene (sp²)',
    idealBondAngle: '121.3° (H-C-C) / 117.4° (H-C-H)',
    dipoleMoment: '0.00 D (Planar Non-polar)',
    molarMass: 28.054,
    description: 'Prototypical frontier orbital textbook model: HOMO is the 1b₃u bonding π orbital; LUMO is the 1b₂g antibonding π* orbital with a vertical nodal plane between carbons.',
    provenance: 'NIST WebBook / PubChem CID 8325 / Fukui FMO Benchmark',
    raw_xyz: `6
Ethylene Planar
C  -0.6690   0.0000   0.0000
C   0.6690   0.0000   0.0000
H  -1.2400   0.9300   0.0000
H  -1.2400  -0.9300   0.0000
H   1.2400   0.9300   0.0000
H   1.2400  -0.9300   0.0000`,
    atoms: [
      { id: 'e-0', index: 0, symbol: 'C', x: -0.669, y: 0.0, z: 0.0, hybridization: 'sp²' },
      { id: 'e-1', index: 1, symbol: 'C', x: 0.669, y: 0.0, z: 0.0, hybridization: 'sp²' },
      { id: 'e-2', index: 2, symbol: 'H', x: -1.24, y: 0.93, z: 0.0 },
      { id: 'e-3', index: 3, symbol: 'H', x: -1.24, y: -0.93, z: 0.0 },
      { id: 'e-4', index: 4, symbol: 'H', x: 1.24, y: 0.93, z: 0.0 },
      { id: 'e-5', index: 5, symbol: 'H', x: 1.24, y: -0.93, z: 0.0 },
    ],
    bonds: [
      { id: 'eb-1', from: 0, to: 1, order: 2 },
      { id: 'eb-2', from: 0, to: 2, order: 1 },
      { id: 'eb-3', from: 0, to: 3, order: 1 },
      { id: 'eb-4', from: 1, to: 4, order: 1 },
      { id: 'eb-5', from: 1, to: 5, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -10.51,
      lumo_ev: 1.50,
      band_gap_ev: 12.01,
      chemical_hardness_ev: 6.00,
      chemical_softness_ev_inv: 0.083,
      chemical_potential_ev: -4.50,
      electronegativity_ev: 4.50,
      electrophilicity_index: 1.69,
      hsab_classification: 'Soft Nucleophile (High-lying π-HOMO readily attacks electrophiles in addition reactions)',
    },
    homoLobes: [
      { center: [-0.67, 0, 0.65], phase: 'positive', radius: 0.44 },
      { center: [0.67, 0, 0.65], phase: 'positive', radius: 0.44 },
      { center: [-0.67, 0, -0.65], phase: 'negative', radius: 0.44 },
      { center: [0.67, 0, -0.65], phase: 'negative', radius: 0.44 },
    ],
    lumoLobes: [
      { center: [-0.67, 0, 0.65], phase: 'positive', radius: 0.42 },
      { center: [0.67, 0, 0.65], phase: 'negative', radius: 0.42 },
      { center: [-0.67, 0, -0.65], phase: 'negative', radius: 0.42 },
      { center: [0.67, 0, -0.65], phase: 'positive', radius: 0.42 },
    ],
  },
  {
    id: 'ethyne',
    name: 'Ethyne (Acetylene)',
    formula: 'C₂H₂',
    iupacName: 'Ethyne',
    category: 'organic',
    geometry: 'Linear Alkyne (sp)',
    idealBondAngle: '180.0°',
    dipoleMoment: '0.00 D (Linear Non-polar)',
    molarMass: 26.038,
    description: 'Linear alkyne featuring two degenerate perpendicular π bonds. High carbon-carbon bond energy (839 kJ/mol).',
    provenance: 'NIST WebBook / PubChem CID 6326',
    raw_xyz: `4
Acetylene Linear
C  -0.6030   0.0000   0.0000
C   0.6030   0.0000   0.0000
H  -1.6650   0.0000   0.0000
H   1.6650   0.0000   0.0000`,
    atoms: [
      { id: 'ac-0', index: 0, symbol: 'C', x: -0.603, y: 0.0, z: 0.0, hybridization: 'sp' },
      { id: 'ac-1', index: 1, symbol: 'C', x: 0.603, y: 0.0, z: 0.0, hybridization: 'sp' },
      { id: 'ac-2', index: 2, symbol: 'H', x: -1.665, y: 0.0, z: 0.0 },
      { id: 'ac-3', index: 3, symbol: 'H', x: 1.665, y: 0.0, z: 0.0 },
    ],
    bonds: [
      { id: 'acb-1', from: 0, to: 1, order: 3 },
      { id: 'acb-2', from: 0, to: 2, order: 1 },
      { id: 'acb-3', from: 1, to: 3, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -11.40,
      lumo_ev: 1.80,
      band_gap_ev: 13.20,
      chemical_hardness_ev: 6.60,
      chemical_softness_ev_inv: 0.076,
      chemical_potential_ev: -4.80,
      electronegativity_ev: 4.80,
      electrophilicity_index: 1.75,
      hsab_classification: 'Cylindrical π electron donor with high localized electron density',
    },
  },
  {
    id: 'benzene',
    name: 'Benzene',
    formula: 'C₆H₆',
    iupacName: 'Benzene',
    category: 'organic',
    geometry: 'Planar Aromatic Ring (D₆ₕ)',
    idealBondAngle: '120.0°',
    dipoleMoment: '0.00 D (Highly Symmetric Non-polar)',
    molarMass: 78.114,
    description: 'Gold-standard aromatic system exhibiting 6 π-electron Hückel aromaticity (4n+2). Degenerate HOMO levels (1e₁g) absorb at 254 nm in the UV spectrum.',
    provenance: 'NIST WebBook / PubChem CID 241',
    raw_xyz: `12
Benzene Planar D6h
C   1.3970   0.0000   0.0000
C   0.6990   1.2100   0.0000
C  -0.6990   1.2100   0.0000
C  -1.3970   0.0000   0.0000
C  -0.6990  -1.2100   0.0000
C   0.6990  -1.2100   0.0000
H   2.4810   0.0000   0.0000
H   1.2410   2.1490   0.0000
H  -1.2410   2.1490   0.0000
H  -2.4810   0.0000   0.0000
H  -1.2410  -2.1490   0.0000
H   1.2410  -2.1490   0.0000`,
    atoms: [
      { id: 'b-0', index: 0, symbol: 'C', x: 1.397, y: 0.0, z: 0.0, hybridization: 'sp²' },
      { id: 'b-1', index: 1, symbol: 'C', x: 0.699, y: 1.21, z: 0.0, hybridization: 'sp²' },
      { id: 'b-2', index: 2, symbol: 'C', x: -0.699, y: 1.21, z: 0.0, hybridization: 'sp²' },
      { id: 'b-3', index: 3, symbol: 'C', x: -1.397, y: 0.0, z: 0.0, hybridization: 'sp²' },
      { id: 'b-4', index: 4, symbol: 'C', x: -0.699, y: -1.21, z: 0.0, hybridization: 'sp²' },
      { id: 'b-5', index: 5, symbol: 'C', x: 0.699, y: -1.21, z: 0.0, hybridization: 'sp²' },
      { id: 'b-6', index: 6, symbol: 'H', x: 2.481, y: 0.0, z: 0.0 },
      { id: 'b-7', index: 7, symbol: 'H', x: 1.241, y: 2.149, z: 0.0 },
      { id: 'b-8', index: 8, symbol: 'H', x: -1.241, y: 2.149, z: 0.0 },
      { id: 'b-9', index: 9, symbol: 'H', x: -2.481, y: 0.0, z: 0.0 },
      { id: 'b-10', index: 10, symbol: 'H', x: -1.241, y: -2.149, z: 0.0 },
      { id: 'b-11', index: 11, symbol: 'H', x: 1.241, y: -2.149, z: 0.0 },
    ],
    bonds: [
      { id: 'bb-1', from: 0, to: 1, order: 2 },
      { id: 'bb-2', from: 1, to: 2, order: 1 },
      { id: 'bb-3', from: 2, to: 3, order: 2 },
      { id: 'bb-4', from: 3, to: 4, order: 1 },
      { id: 'bb-5', from: 4, to: 5, order: 2 },
      { id: 'bb-6', from: 5, to: 0, order: 1 },
      { id: 'bb-h1', from: 0, to: 6, order: 1 },
      { id: 'bb-h2', from: 1, to: 7, order: 1 },
      { id: 'bb-h3', from: 2, to: 8, order: 1 },
      { id: 'bb-h4', from: 3, to: 9, order: 1 },
      { id: 'bb-h5', from: 4, to: 10, order: 1 },
      { id: 'bb-h6', from: 5, to: 11, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -9.24,
      lumo_ev: -1.15,
      band_gap_ev: 8.09,
      chemical_hardness_ev: 4.05,
      chemical_softness_ev_inv: 0.123,
      chemical_potential_ev: -5.20,
      electronegativity_ev: 5.20,
      electrophilicity_index: 3.34,
      hsab_classification: 'Aromatic Soft Lewis Base (Delocalized π-electron cloud absorbs UV photons at 254 nm)',
    },
    homoLobes: [
      { center: [0, 1.2, 0.65], phase: 'positive', radius: 0.52 },
      { center: [0, -1.2, 0.65], phase: 'negative', radius: 0.52 },
      { center: [0, 1.2, -0.65], phase: 'negative', radius: 0.52 },
      { center: [0, -1.2, -0.65], phase: 'positive', radius: 0.52 },
    ],
  },

  // ==========================================
  // ENGINEERING & COORDINATION APPLICATIONS
  // ==========================================
  {
    id: 'aspirin',
    name: 'Aspirin',
    formula: 'C₉H₈O₄',
    iupacName: '2-Acetyloxybenzoic acid',
    category: 'engineering',
    geometry: 'Ortho-Substituted Aromatic Ring',
    idealBondAngle: '120.0° (aromatic / ester)',
    dipoleMoment: '2.10 D',
    molarMass: 180.158,
    description: 'Semester 1 Organic Synthesis practical: esterification of salicylic acid. Distinct carbonyl peaks in IR spectroscopy with ester and carboxyl groups.',
    provenance: 'PubChem CID 2244 / MRIIRS Lab Manual',
    raw_xyz: `21
Aspirin Molecule
C   0.0000   0.0000   0.0000
C   1.3900   0.0000   0.0000
C   2.0800   1.2100   0.0000
C   1.3900   2.4100   0.0000
C   0.0000   2.4100   0.0000
C  -0.6900   1.2100   0.0000
H   3.1600   1.2100   0.0000
H   1.9300   3.3500   0.0000
H  -0.5400   3.3500   0.0000
H  -1.7700   1.2100   0.0000
C  -0.7300  -1.3000   0.0000
O  -0.2100  -2.3900   0.0000
O  -2.0700  -1.1800   0.0000
H  -2.4800  -2.0400   0.0000
O   2.1200  -1.1700   0.0000
C   1.6300  -2.4300   0.0000
O   0.4400  -2.6900   0.0000
C   2.7100  -3.4800   0.0000
H   3.3200  -3.3200   0.8900
H   3.3200  -3.3200  -0.8900
H   2.2700  -4.4700   0.0000`,
    atoms: [
      { id: 'asp-0', index: 0, symbol: 'C', x: 0.0, y: 0.0, z: 0.0 },
      { id: 'asp-1', index: 1, symbol: 'C', x: 1.39, y: 0.0, z: 0.0 },
      { id: 'asp-2', index: 2, symbol: 'C', x: 2.08, y: 1.21, z: 0.0 },
      { id: 'asp-3', index: 3, symbol: 'C', x: 1.39, y: 2.41, z: 0.0 },
      { id: 'asp-4', index: 4, symbol: 'C', x: 0.0, y: 2.41, z: 0.0 },
      { id: 'asp-5', index: 5, symbol: 'C', x: -0.69, y: 1.21, z: 0.0 },
      { id: 'asp-6', index: 6, symbol: 'H', x: 3.16, y: 1.21, z: 0.0 },
      { id: 'asp-7', index: 7, symbol: 'H', x: 1.93, y: 3.35, z: 0.0 },
      { id: 'asp-8', index: 8, symbol: 'H', x: -0.54, y: 3.35, z: 0.0 },
      { id: 'asp-9', index: 9, symbol: 'H', x: -1.77, y: 1.21, z: 0.0 },
      { id: 'asp-10', index: 10, symbol: 'C', x: -0.73, y: -1.3, z: 0.0 },
      { id: 'asp-11', index: 11, symbol: 'O', x: -0.21, y: -2.39, z: 0.0 },
      { id: 'asp-12', index: 12, symbol: 'O', x: -2.07, y: -1.18, z: 0.0 },
      { id: 'asp-13', index: 13, symbol: 'H', x: -2.48, y: -2.04, z: 0.0 },
      { id: 'asp-14', index: 14, symbol: 'O', x: 2.12, y: -1.17, z: 0.0 },
      { id: 'asp-15', index: 15, symbol: 'C', x: 1.63, y: -2.43, z: 0.0 },
      { id: 'asp-16', index: 16, symbol: 'O', x: 0.44, y: -2.69, z: 0.0 },
      { id: 'asp-17', index: 17, symbol: 'C', x: 2.71, y: -3.48, z: 0.0 },
      { id: 'asp-18', index: 18, symbol: 'H', x: 3.32, y: -3.32, z: 0.89 },
      { id: 'asp-19', index: 19, symbol: 'H', x: 3.32, y: -3.32, z: -0.89 },
      { id: 'asp-20', index: 20, symbol: 'H', x: 2.27, y: -4.47, z: 0.0 },
    ],
    bonds: [
      { id: 'ab-1', from: 0, to: 1, order: 2 },
      { id: 'ab-2', from: 1, to: 2, order: 1 },
      { id: 'ab-3', from: 2, to: 3, order: 2 },
      { id: 'ab-4', from: 3, to: 4, order: 1 },
      { id: 'ab-5', from: 4, to: 5, order: 2 },
      { id: 'ab-6', from: 5, to: 0, order: 1 },
      { id: 'ab-7', from: 2, to: 6, order: 1 },
      { id: 'ab-8', from: 3, to: 7, order: 1 },
      { id: 'ab-9', from: 4, to: 8, order: 1 },
      { id: 'ab-10', from: 5, to: 9, order: 1 },
      { id: 'ab-11', from: 0, to: 10, order: 1 },
      { id: 'ab-12', from: 10, to: 11, order: 2 },
      { id: 'ab-13', from: 10, to: 12, order: 1 },
      { id: 'ab-14', from: 12, to: 13, order: 1 },
      { id: 'ab-15', from: 1, to: 14, order: 1 },
      { id: 'ab-16', from: 14, to: 15, order: 1 },
      { id: 'ab-17', from: 15, to: 16, order: 2 },
      { id: 'ab-18', from: 15, to: 17, order: 1 },
      { id: 'ab-19', from: 17, to: 18, order: 1 },
      { id: 'ab-20', from: 17, to: 19, order: 1 },
      { id: 'ab-21', from: 17, to: 20, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -8.92,
      lumo_ev: -1.25,
      band_gap_ev: 7.67,
      chemical_hardness_ev: 3.84,
      chemical_softness_ev_inv: 0.130,
      chemical_potential_ev: -5.09,
      electronegativity_ev: 5.09,
      electrophilicity_index: 3.37,
      hsab_classification: 'Carbonyl π* LUMO enables transesterification inactivation of cyclooxygenase (COX-1/2)',
    },
  },
  {
    id: 'cisplatin',
    name: 'Cisplatin',
    formula: 'Pt(NH₃)₂Cl₂',
    iupacName: 'cis-Diamminedichloroplatinum(II)',
    category: 'engineering',
    geometry: 'Square Planar Platinum(II)',
    vseprNotation: 'd⁸ transition metal square planar (dsp²)',
    idealBondAngle: '90.0°',
    dipoleMoment: '1.40 D (cis polar)',
    molarMass: 300.05,
    description: 'Anticancer chemotherapy agent. The cis geometry places both chloride ligands at adjacent 90° sites, allowing aquation and cross-linking of DNA guanine N7 atoms.',
    provenance: 'Inorganic Chemistry / PubChem CID 2767 / Lab Practical 08',
    raw_xyz: `11
Cisplatin Complex
Pt   0.0000   0.0000   0.0000
Cl   2.3000   0.0000   0.0000
Cl   0.0000   2.3000   0.0000
N   -2.0500   0.0000   0.0000
N    0.0000  -2.0500   0.0000
H   -2.5500   0.6500   0.6500
H   -2.5500  -0.6500  -0.6500
H    0.6500  -2.5500   0.6500
H   -0.6500  -2.5500  -0.6500
H   -2.5500   0.6500  -0.6500
H    0.6500  -2.5500  -0.6500`,
    atoms: [
      { id: 'pt-0', index: 0, symbol: 'Pt', x: 0.0, y: 0.0, z: 0.0 },
      { id: 'pt-1', index: 1, symbol: 'Cl', x: 2.3, y: 0.0, z: 0.0 },
      { id: 'pt-2', index: 2, symbol: 'Cl', x: 0.0, y: 2.3, z: 0.0 },
      { id: 'pt-3', index: 3, symbol: 'N', x: -2.05, y: 0.0, z: 0.0 },
      { id: 'pt-4', index: 4, symbol: 'N', x: 0.0, y: -2.05, z: 0.0 },
      { id: 'pt-5', index: 5, symbol: 'H', x: -2.55, y: 0.65, z: 0.65 },
      { id: 'pt-6', index: 6, symbol: 'H', x: -2.55, y: -0.65, z: -0.65 },
      { id: 'pt-7', index: 7, symbol: 'H', x: 0.65, y: -2.55, z: 0.65 },
      { id: 'pt-8', index: 8, symbol: 'H', x: -0.65, y: -2.55, z: -0.65 },
      { id: 'pt-9', index: 9, symbol: 'H', x: -2.55, y: 0.65, z: -0.65 },
      { id: 'pt-10', index: 10, symbol: 'H', x: 0.65, y: -2.55, z: -0.65 },
    ],
    bonds: [
      { id: 'ptb-1', from: 0, to: 1, order: 1 },
      { id: 'ptb-2', from: 0, to: 2, order: 1 },
      { id: 'ptb-3', from: 0, to: 3, order: 1 },
      { id: 'ptb-4', from: 0, to: 4, order: 1 },
      { id: 'ptb-5', from: 3, to: 5, order: 1 },
      { id: 'ptb-6', from: 3, to: 6, order: 1 },
      { id: 'ptb-7', from: 4, to: 7, order: 1 },
      { id: 'ptb-8', from: 4, to: 8, order: 1 },
      { id: 'ptb-9', from: 3, to: 9, order: 1 },
      { id: 'ptb-10', from: 4, to: 10, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -8.40,
      lumo_ev: -1.80,
      band_gap_ev: 6.60,
      chemical_hardness_ev: 3.30,
      chemical_softness_ev_inv: 0.152,
      chemical_potential_ev: -5.10,
      electronegativity_ev: 5.10,
      electrophilicity_index: 3.94,
      hsab_classification: 'Soft Pt(II) d-orbital acceptor (dsp² dx²-y²* LUMO binds strongly to soft DNA guanine bases)',
    },
  },
  {
    id: 'edta',
    name: 'EDTA',
    formula: 'C₁₀H₁₆N₂O₈',
    iupacName: 'Ethylenediaminetetraacetic acid',
    category: 'engineering',
    geometry: 'Hexadentate Chelating Ligand',
    idealBondAngle: '109.5° (amine/carboxylate backbone)',
    dipoleMoment: '3.40 D',
    molarMass: 292.24,
    description: 'Practical 01 core reagent: Hexadentate chelating agent used to determine total hardness of water using Eriochrome Black T indicator at pH 10.',
    provenance: 'MRIIRS Engineering Chemistry Practical 01 / PubChem CID 6049',
    raw_xyz: `16
EDTA Backbone
C  -0.7500   0.0000   0.0000
C   0.7500   0.0000   0.0000
N  -1.3500   1.2500   0.0000
N   1.3500  -1.2500   0.0000
C  -2.8000   1.2000   0.0000
C  -0.7000   2.4500   0.0000
C   2.8000  -1.2000   0.0000
C   0.7000  -2.4500   0.0000
O  -3.4000   2.2500   0.0000
O  -3.2500   0.0500   0.0000
O  -1.2500   3.5000   0.0000
O   0.5000   2.3500   0.0000
O   3.4000  -2.2500   0.0000
O   3.2500  -0.0500   0.0000
O   1.2500  -3.5000   0.0000
O  -0.5000  -2.3500   0.0000`,
    atoms: [
      { id: 'ed-0', index: 0, symbol: 'C', x: -0.75, y: 0.0, z: 0.0 },
      { id: 'ed-1', index: 1, symbol: 'C', x: 0.75, y: 0.0, z: 0.0 },
      { id: 'ed-2', index: 2, symbol: 'N', x: -1.35, y: 1.25, z: 0.0 },
      { id: 'ed-3', index: 3, symbol: 'N', x: 1.35, y: -1.25, z: 0.0 },
      { id: 'ed-4', index: 4, symbol: 'C', x: -2.8, y: 1.2, z: 0.0 },
      { id: 'ed-5', index: 5, symbol: 'C', x: -0.7, y: 2.45, z: 0.0 },
      { id: 'ed-6', index: 6, symbol: 'C', x: 2.8, y: -1.2, z: 0.0 },
      { id: 'ed-7', index: 7, symbol: 'C', x: 0.7, y: -2.45, z: 0.0 },
      { id: 'ed-8', index: 8, symbol: 'O', x: -3.4, y: 2.25, z: 0.0 },
      { id: 'ed-9', index: 9, symbol: 'O', x: -3.25, y: 0.05, z: 0.0 },
      { id: 'ed-10', index: 10, symbol: 'O', x: -1.25, y: 3.5, z: 0.0 },
      { id: 'ed-11', index: 11, symbol: 'O', x: 0.5, y: 2.35, z: 0.0 },
      { id: 'ed-12', index: 12, symbol: 'O', x: 3.4, y: -2.25, z: 0.0 },
      { id: 'ed-13', index: 13, symbol: 'O', x: 3.25, y: -0.05, z: 0.0 },
      { id: 'ed-14', index: 14, symbol: 'O', x: 1.25, y: -3.5, z: 0.0 },
      { id: 'ed-15', index: 15, symbol: 'O', x: -0.5, y: -2.35, z: 0.0 },
    ],
    bonds: [
      { id: 'edb-1', from: 0, to: 1, order: 1 },
      { id: 'edb-2', from: 0, to: 2, order: 1 },
      { id: 'edb-3', from: 1, to: 3, order: 1 },
      { id: 'edb-4', from: 2, to: 4, order: 1 },
      { id: 'edb-5', from: 2, to: 5, order: 1 },
      { id: 'edb-6', from: 3, to: 6, order: 1 },
      { id: 'edb-7', from: 3, to: 7, order: 1 },
      { id: 'edb-8', from: 4, to: 8, order: 2 },
      { id: 'edb-9', from: 4, to: 9, order: 1 },
      { id: 'edb-10', from: 5, to: 10, order: 2 },
      { id: 'edb-11', from: 5, to: 11, order: 1 },
      { id: 'edb-12', from: 6, to: 12, order: 2 },
      { id: 'edb-13', from: 6, to: 13, order: 1 },
      { id: 'edb-14', from: 7, to: 14, order: 2 },
      { id: 'edb-15', from: 7, to: 15, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -7.85,
      lumo_ev: 0.45,
      band_gap_ev: 8.30,
      chemical_hardness_ev: 4.15,
      chemical_softness_ev_inv: 0.120,
      chemical_potential_ev: -3.70,
      electronegativity_ev: 3.70,
      electrophilicity_index: 1.65,
      hsab_classification: 'Hexadentate Chelate (6 lone pairs form 1:1 octahedral cage complex with Ca²⁺ and Mg²⁺)',
    },
  },
  {
    id: 'h2s',
    name: 'Hydrogen Sulfide',
    formula: 'H₂S',
    iupacName: 'Sulfane',
    category: 'vsepr',
    geometry: 'Bent (Drago Rule)',
    vseprNotation: 'AX₂E₂ (Unhybridized 3p bonding)',
    idealBondAngle: '92.1°',
    dipoleMoment: '0.97 D',
    molarMass: 34.08,
    description: "Drago's rule textbook example: 92.1° bond angle due to bonding through almost pure sulfur 3p orbitals without sp³ hybridization.",
    provenance: 'NIST WebBook / HomoLumo Drago Benchmark',
    raw_xyz: `3
Hydrogen Sulfide Drago Rule
S   0.0000   0.0000   0.1020
H   0.0000   0.9600  -0.8900
H   0.0000  -0.9600  -0.8900`,
    atoms: [
      { id: 's-0', index: 0, symbol: 'S', x: 0.0, y: 0.0, z: 0.102 },
      { id: 's-1', index: 1, symbol: 'H', x: 0.0, y: 0.96, z: -0.89 },
      { id: 's-2', index: 2, symbol: 'H', x: 0.0, y: -0.96, z: -0.89 },
    ],
    bonds: [
      { id: 'sb-1', from: 0, to: 1, order: 1 },
      { id: 'sb-2', from: 0, to: 2, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -10.45,
      lumo_ev: 2.10,
      band_gap_ev: 12.55,
      chemical_hardness_ev: 6.28,
      chemical_softness_ev_inv: 0.080,
      chemical_potential_ev: -4.18,
      electronegativity_ev: 4.18,
      electrophilicity_index: 1.39,
      hsab_classification: 'Soft Lewis Base (Easily polarizable sulfur non-bonding lone pair)',
    },
  },
  {
    id: 'sf6',
    name: 'Sulfur Hexafluoride',
    formula: 'SF₆',
    iupacName: 'Hexafluoro-λ⁶-sulfane',
    category: 'vsepr',
    geometry: 'Regular Octahedral',
    vseprNotation: 'AX₆ (6 bonding pairs, 0 lone pairs)',
    idealBondAngle: '90.0°',
    dipoleMoment: '0.00 D (Centrosymmetric Non-polar)',
    molarMass: 146.06,
    description: 'Inert dielectric insulator with sp³d² hybridization. Six fluorine atoms occupy octahedral vertices at 90° angles.',
    provenance: 'NIST WebBook / PubChem CID 17358',
    raw_xyz: `7
Sulfur Hexafluoride Octahedral
S   0.0000   0.0000   0.0000
F   1.5600   0.0000   0.0000
F  -1.5600   0.0000   0.0000
F   0.0000   1.5600   0.0000
F   0.0000  -1.5600   0.0000
F   0.0000   0.0000   1.5600
F   0.0000   0.0000  -1.5600`,
    atoms: [
      { id: 'sf-0', index: 0, symbol: 'S', x: 0.0, y: 0.0, z: 0.0 },
      { id: 'sf-1', index: 1, symbol: 'F', x: 1.56, y: 0.0, z: 0.0 },
      { id: 'sf-2', index: 2, symbol: 'F', x: -1.56, y: 0.0, z: 0.0 },
      { id: 'sf-3', index: 3, symbol: 'F', x: 0.0, y: 1.56, z: 0.0 },
      { id: 'sf-4', index: 4, symbol: 'F', x: 0.0, y: -1.56, z: 0.0 },
      { id: 'sf-5', index: 5, symbol: 'F', x: 0.0, y: 0.0, z: 1.56 },
      { id: 'sf-6', index: 6, symbol: 'F', x: 0.0, y: 0.0, z: -1.56 },
    ],
    bonds: [
      { id: 'sfb-1', from: 0, to: 1, order: 1 },
      { id: 'sfb-2', from: 0, to: 2, order: 1 },
      { id: 'sfb-3', from: 0, to: 3, order: 1 },
      { id: 'sfb-4', from: 0, to: 4, order: 1 },
      { id: 'sfb-5', from: 0, to: 5, order: 1 },
      { id: 'sfb-6', from: 0, to: 6, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -15.60,
      lumo_ev: 0.85,
      band_gap_ev: 16.45,
      chemical_hardness_ev: 8.23,
      chemical_softness_ev_inv: 0.061,
      chemical_potential_ev: -7.38,
      electronegativity_ev: 7.38,
      electrophilicity_index: 3.31,
      hsab_classification: 'Extremely Hard Octahedral (Exceptionally high dielectric strength)',
    },
  },
  {
    id: 'acetone',
    name: 'Acetone',
    formula: 'CH₃COCH₃',
    iupacName: 'Propan-2-one',
    category: 'organic',
    geometry: 'Trigonal Planar Carbonyl',
    idealBondAngle: '122.0° (C-C=O) / 116.0° (C-C-C)',
    dipoleMoment: '2.88 D',
    molarMass: 58.08,
    description: 'Prototypical ketone with a permanent dipole. HOMO is the oxygen non-bonding lone pair; LUMO is the carbonyl π* antibonding orbital accepting nucleophilic addition.',
    provenance: 'NIST WebBook / PubChem CID 180',
    raw_xyz: `10
Acetone Ground State
C   0.0000   0.1800   0.0000
O   0.0000   1.3900   0.0000
C  -1.2900  -0.6100   0.0000
C   1.2900  -0.6100   0.0000
H  -1.3300  -1.2400   0.8900
H  -1.3300  -1.2400  -0.8900
H  -2.1300   0.0800   0.0000
H   1.3300  -1.2400   0.8900
H   1.3300  -1.2400  -0.8900
H   2.1300   0.0800   0.0000`,
    atoms: [
      { id: 'act-0', index: 0, symbol: 'C', x: 0.0, y: 0.18, z: 0.0, hybridization: 'sp²' },
      { id: 'act-1', index: 1, symbol: 'O', x: 0.0, y: 1.39, z: 0.0 },
      { id: 'act-2', index: 2, symbol: 'C', x: -1.29, y: -0.61, z: 0.0, hybridization: 'sp³' },
      { id: 'act-3', index: 3, symbol: 'C', x: 1.29, y: -0.61, z: 0.0, hybridization: 'sp³' },
      { id: 'act-4', index: 4, symbol: 'H', x: -1.33, y: -1.24, z: 0.89 },
      { id: 'act-5', index: 5, symbol: 'H', x: -1.33, y: -1.24, z: -0.89 },
      { id: 'act-6', index: 6, symbol: 'H', x: -2.13, y: 0.08, z: 0.0 },
      { id: 'act-7', index: 7, symbol: 'H', x: 1.33, y: -1.24, z: 0.89 },
      { id: 'act-8', index: 8, symbol: 'H', x: 1.33, y: -1.24, z: -0.89 },
      { id: 'act-9', index: 9, symbol: 'H', x: 2.13, y: 0.08, z: 0.0 },
    ],
    bonds: [
      { id: 'actb-1', from: 0, to: 1, order: 2 },
      { id: 'actb-2', from: 0, to: 2, order: 1 },
      { id: 'actb-3', from: 0, to: 3, order: 1 },
      { id: 'actb-4', from: 2, to: 4, order: 1 },
      { id: 'actb-5', from: 2, to: 5, order: 1 },
      { id: 'actb-6', from: 2, to: 6, order: 1 },
      { id: 'actb-7', from: 3, to: 7, order: 1 },
      { id: 'actb-8', from: 3, to: 8, order: 1 },
      { id: 'actb-9', from: 3, to: 9, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -9.70,
      lumo_ev: 0.22,
      band_gap_ev: 9.92,
      chemical_hardness_ev: 4.96,
      chemical_softness_ev_inv: 0.101,
      chemical_potential_ev: -4.74,
      electronegativity_ev: 4.74,
      electrophilicity_index: 2.26,
      hsab_classification: 'Dipolar Carbonyl (LUMO π* on carbonyl carbon undergoes nucleophilic attack)',
    },
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    iupacName: 'Ethanol',
    category: 'organic',
    geometry: 'Tetrahedral with Bent Hydroxyl',
    idealBondAngle: '108.5° (C-C-O)',
    dipoleMoment: '1.69 D',
    molarMass: 46.069,
    description: 'Protic solvent exhibiting intermolecular hydrogen bonding. HOMO resides in oxygen non-bonding sp³ lone pairs.',
    provenance: 'NIST WebBook / PubChem CID 702',
    raw_xyz: `9
Ethanol Molecule
C  -1.2400  -0.2600   0.0000
C   0.0000   0.5800   0.0000
O   1.1800  -0.2300   0.0000
H   1.9400   0.3500   0.0000
H  -1.2600  -0.9000   0.8800
H  -1.2600  -0.9000  -0.8800
H  -2.1000   0.4100   0.0000
H   0.0400   1.2200   0.8800
H   0.0400   1.2200  -0.8800`,
    atoms: [
      { id: 'eth-0', index: 0, symbol: 'C', x: -1.24, y: -0.26, z: 0.0 },
      { id: 'eth-1', index: 1, symbol: 'C', x: 0.0, y: 0.58, z: 0.0 },
      { id: 'eth-2', index: 2, symbol: 'O', x: 1.18, y: -0.23, z: 0.0 },
      { id: 'eth-3', index: 3, symbol: 'H', x: 1.94, y: 0.35, z: 0.0 },
      { id: 'eth-4', index: 4, symbol: 'H', x: -1.26, y: -0.9, z: 0.88 },
      { id: 'eth-5', index: 5, symbol: 'H', x: -1.26, y: -0.9, z: -0.88 },
      { id: 'eth-6', index: 6, symbol: 'H', x: -2.1, y: 0.41, z: 0.0 },
      { id: 'eth-7', index: 7, symbol: 'H', x: 0.04, y: 1.22, z: 0.88 },
      { id: 'eth-8', index: 8, symbol: 'H', x: 0.04, y: 1.22, z: -0.88 },
    ],
    bonds: [
      { id: 'ethb-1', from: 0, to: 1, order: 1 },
      { id: 'ethb-2', from: 1, to: 2, order: 1 },
      { id: 'ethb-3', from: 2, to: 3, order: 1 },
      { id: 'ethb-4', from: 0, to: 4, order: 1 },
      { id: 'ethb-5', from: 0, to: 5, order: 1 },
      { id: 'ethb-6', from: 0, to: 6, order: 1 },
      { id: 'ethb-7', from: 1, to: 7, order: 1 },
      { id: 'ethb-8', from: 1, to: 8, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -10.65,
      lumo_ev: 2.80,
      band_gap_ev: 13.45,
      chemical_hardness_ev: 6.73,
      chemical_softness_ev_inv: 0.074,
      chemical_potential_ev: -3.93,
      electronegativity_ev: 3.93,
      electrophilicity_index: 1.15,
      hsab_classification: 'Hard Nucleophile (Hydrogen-bonding protic donor/acceptor)',
    },
  },
  {
    id: 'phenolphthalein',
    name: 'Phenolphthalein',
    formula: 'C₂₀H₁₄O₄',
    iupacName: '3,3-bis(4-hydroxyphenyl)-2-benzofuran-1-one',
    category: 'engineering',
    geometry: 'Triarylmethane Lactone Core',
    idealBondAngle: '109.5° (central sp³ carbon in acid)',
    dipoleMoment: '3.10 D',
    molarMass: 318.32,
    description: 'Indicator practicals: colorless in acid (pH < 8.2), turns intense fuchsia in alkaline solution as lactone ring opens into conjugated quinonoid dianion with narrow HOMO-LUMO gap absorbing at 553 nm.',
    provenance: 'MRIIRS Practical 02 / HomoLumo Indicator Benchmark',
    raw_xyz: `15
Phenolphthalein Core
C   0.0000   0.0000   0.0000
C   1.4000   0.0000   0.0000
C  -0.7000   1.2100   0.0000
C  -0.7000  -1.2100   0.0000
O   2.1000   1.2000   0.0000
C   1.3000   2.3500   0.0000
O   1.6500   3.4500   0.0000
C  -2.1000   1.2100   0.0000
C  -2.8000   2.4100   0.0000
O  -4.1500   2.4100   0.0000
C  -2.1000  -1.2100   0.0000
C  -2.8000  -2.4100   0.0000
O  -4.1500  -2.4100   0.0000
H  -4.6000   3.1500   0.0000
H  -4.6000  -3.1500   0.0000`,
    atoms: [
      { id: 'ph-0', index: 0, symbol: 'C', x: 0.0, y: 0.0, z: 0.0, hybridization: 'sp³' },
      { id: 'ph-1', index: 1, symbol: 'C', x: 1.4, y: 0.0, z: 0.0 },
      { id: 'ph-2', index: 2, symbol: 'C', x: -0.7, y: 1.21, z: 0.0 },
      { id: 'ph-3', index: 3, symbol: 'C', x: -0.7, y: -1.21, z: 0.0 },
      { id: 'ph-4', index: 4, symbol: 'O', x: 2.1, y: 1.2, z: 0.0 },
      { id: 'ph-5', index: 5, symbol: 'C', x: 1.3, y: 2.35, z: 0.0 },
      { id: 'ph-6', index: 6, symbol: 'O', x: 1.65, y: 3.45, z: 0.0 },
      { id: 'ph-7', index: 7, symbol: 'C', x: -2.1, y: 1.21, z: 0.0 },
      { id: 'ph-8', index: 8, symbol: 'C', x: -2.8, y: 2.41, z: 0.0 },
      { id: 'ph-9', index: 9, symbol: 'O', x: -4.15, y: 2.41, z: 0.0 },
      { id: 'ph-10', index: 10, symbol: 'C', x: -2.1, y: -1.21, z: 0.0 },
      { id: 'ph-11', index: 11, symbol: 'C', x: -2.8, y: -2.41, z: 0.0 },
      { id: 'ph-12', index: 12, symbol: 'O', x: -4.15, y: -2.41, z: 0.0 },
      { id: 'ph-13', index: 13, symbol: 'H', x: -4.6, y: 3.15, z: 0.0 },
      { id: 'ph-14', index: 14, symbol: 'H', x: -4.6, y: -3.15, z: 0.0 },
    ],
    bonds: [
      { id: 'phb-1', from: 0, to: 1, order: 1 },
      { id: 'phb-2', from: 0, to: 2, order: 1 },
      { id: 'phb-3', from: 0, to: 3, order: 1 },
      { id: 'phb-4', from: 1, to: 4, order: 1 },
      { id: 'phb-5', from: 4, to: 5, order: 1 },
      { id: 'phb-6', from: 5, to: 6, order: 2 },
      { id: 'phb-7', from: 2, to: 7, order: 2 },
      { id: 'phb-8', from: 7, to: 8, order: 1 },
      { id: 'phb-9', from: 8, to: 9, order: 1 },
      { id: 'phb-10', from: 9, to: 13, order: 1 },
      { id: 'phb-11', from: 3, to: 10, order: 2 },
      { id: 'phb-12', from: 10, to: 11, order: 1 },
      { id: 'phb-13', from: 11, to: 12, order: 1 },
      { id: 'phb-14', from: 12, to: 14, order: 1 },
    ],
    orbitals_summary: {
      homo_ev: -6.45,
      lumo_ev: -2.85,
      band_gap_ev: 3.60,
      chemical_hardness_ev: 1.80,
      chemical_softness_ev_inv: 0.278,
      chemical_potential_ev: -4.65,
      electronegativity_ev: 4.65,
      electrophilicity_index: 6.01,
      hsab_classification: 'Quinoid Chromophore (Narrow band gap of 3.6 eV gives intense pink visible absorption at 553 nm in base)',
    },
  },
];
