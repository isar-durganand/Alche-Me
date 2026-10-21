export interface Atom {
  index: number;
  symbol: string;
  atomic_number: number;
  x: number;
  y: number;
  z: number;
  hybridization?: string;
  implicit_valence?: number;
  formal_charge?: number;
  is_aromatic?: boolean;
}

export interface Bond {
  start: number;
  end: number;
  order: number;
  is_aromatic?: boolean;
  is_conjugated?: boolean;
}

export interface MolecularProperties {
  formula: string;
  molecular_weight: number;
  exact_mass: number;
  tpsa: number;
  logp: number;
  h_bond_donors: number;
  h_bond_acceptors: number;
  rotatable_bonds: number;
  mmff94_energy_kcal_mol: number;
  uff_energy_kcal_mol: number;
  mmff94_energy_kj_mol: number;
  num_atoms?: number;
  num_heavy_atoms?: number;
  num_bonds?: number;
  num_rotatable_bonds?: number;
  num_rings?: number;
  num_aromatic_rings?: number;
  fraction_csp3?: number;
  formal_charge?: number;
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

export interface PhysicalProperties {
  color: string;
  odor: string;
  taste: string;
  density: string;
  melting_point: string;
  boiling_point: string;
  freezing_point: string;
  state_of_matter: string;
  hardness: string;
  luster: string;
  malleability: string;
  ductility: string;
  conductivity: string;
  solubility: string;
  viscosity: string;
  mass: string;
  volume: string;
  vapor_pressure: string;
  refractive_index: string;
}

export interface ChemicalProperties {
  reactivity: string;
  flammability: string;
  acidity: string;
  basicity: string;
  ph: string;
  toxicity: string;
  corrosiveness: string;
  oxidation_state: string;
  electronegativity: string;
  ionization_energy: string;
  heat_of_combustion: string;
  radioactivity: string;
  chemical_stability: string;
  combustibility: string;
  enthalpy_of_formation: string;
}

export interface MoleculeData {
  smiles: string;
  smiles_with_h?: string;
  raw_xyz: string;
  optimized_xyz: string;
  mol_block?: string;
  atoms: Atom[];
  raw_atoms?: Atom[];
  bonds: Bond[];
  properties: MolecularProperties;
  orbitals_summary: OrbitalsSummary;
  active_force_field?: string;
  query?: string;
  ai_summary?: string;
  ai_title?: string;
  physical_properties?: PhysicalProperties;
  chemical_properties?: ChemicalProperties;
}

export interface Measurement {
  id: string;
  type: 'distance' | 'angle' | 'dihedral';
  atoms: Atom[];
  value: number;
  unit: string;
}

export interface TorsionStep {
  angle_deg: number;
  energy_kcal_mol: number;
  relative_energy_kcal_mol: number;
  conformation_type: string;
}

export interface TorsionScanResult {
  dihedral_atoms: number[];
  energy_profile: TorsionStep[];
  conformer_xyzs: Record<string, string>;
}

export interface PeriodicElement {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  period: number;
  group: number;
  category: 'alkali' | 'alkaline' | 'transition' | 'post-transition' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble' | 'lanthanide' | 'actinide';
  electronegativity: number | null;
  atomic_radius: number | null;
  covalent_radius: number | null;
  ionization_energy: number | null;
  electron_affinity: number | null;
  oxidation_states: string;
  electron_configuration: string;
  subshells: { subshell: string; count: number; capacity: number }[];
  summary: string;
}

export interface IRBand {
  group: string;
  range_cm_inv: string;
  peak_cm_inv: number;
  intensity: string;
  assignment: string;
}

export interface SpectroscopyData {
  ir_bands: IRBand[];
  estimated_dipole_debye: number;
  polarity_classification: string;
  tpsa_angstrom2: number;
  logp: number;
  water_solubility_prediction: string;
}

export interface VivaQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  syllabus_topic: string;
}

export interface SyllabusPreset {
  id: string;
  name: string;
  formula: string;
  smiles: string;
  category: string;
  description: string;
  bent_rule_context: string;
}

export interface TeamMember {
  name: string;
  rollNumber: string;
  role: string;
}

export interface ReportDetails {
  studentName?: string;
  rollNumber?: string;
  teamMembers: TeamMember[];
  institution: string;
  branch: string;
  semester: string;
  subject: string;
  subjectCode: string;
  experimentNumber: string;
  experimentTitle: string;
  aim: string;
  date: string;
}
