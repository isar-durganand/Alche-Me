import { FeatureInventoryItem } from '../domain/types';

export const FEATURE_INVENTORY: FeatureInventoryItem[] = [
  {
    id: 'foundation-shell',
    title: 'Design System & Foundation Shell',
    category: 'Core System',
    phase: 'Phase 01 & 02',
    status: 'foundational_in_place',
    notes: 'Base dark theme tokens, layout grid, typography, and asset pipeline established.',
    sourceModule: 'src/index.css, src/App.tsx'
  },
  {
    id: 'periodic-table-grid',
    title: 'Full 118-Element Periodic Grid & Property Drawer',
    category: 'Periodic Table',
    phase: 'Phase 05',
    status: 'implemented_in_prototype',
    notes: 'All 118 elements with atomic mass, electronegativity, ionization energy, electron affinity, and visual orbital filling diagrams.',
    sourceModule: 'HomoLumo (periodicTableData.ts, PeriodicTableModal.tsx)'
  },
  {
    id: 'mriirs-lab-practicals',
    title: '10 Engineering Chemistry Laboratory Experiments',
    category: 'Virtual Lab',
    phase: 'Phase 07 & 09',
    status: 'implemented_in_prototype',
    notes: 'EDTA water hardness, conductometric titration, potentiometric redox, viscometry, proximate analysis, flash & fire point, aspirin & bakelite synthesis mapped to MRIIRS syllabus 4.5CH101C00H.',
    sourceModule: 'HomoLumo (LabSimulator.tsx)'
  },
  {
    id: 'vsepr-presets',
    title: 'Syllabus Molecular Presets (VSEPR & Hydrocarbons)',
    category: 'Molecule Studio',
    phase: 'Phase 05 & 08',
    status: 'implemented_in_prototype',
    notes: 'Hydrides (H2O, H2S, H2Se, NH3), hydrocarbons (CH4, C2H6, C4H10, C6H6), and engineering chelates with Drago/Bent rule context.',
    sourceModule: 'HomoLumo (syllabusPresets.ts)'
  },
  {
    id: '3d-molecule-viewer',
    title: 'Hardware-Accelerated 3D Molecular Graphics',
    category: 'Molecule Studio',
    phase: 'Phase 08',
    status: 'implemented_in_prototype',
    notes: 'Ball-and-stick, CPK space filling, licorice, wireframe, atom/distance/angle measurements via 3Dmol.js and Three.js PBR renderer.',
    sourceModule: 'HomoLumo (MoleculeViewer3D.tsx, BlenderPBRViewer.tsx)'
  },
  {
    id: 'viva-voce-quiz',
    title: 'Laboratory Viva Voce Assessment Engine',
    category: 'Curriculum & Worlds',
    phase: 'Phase 06',
    status: 'implemented_in_prototype',
    notes: 'Conceptual viva questions with scoring, rationale breakdowns, and scorecards for engineering experiments.',
    sourceModule: 'HomoLumo (VivaQuizModal.tsx)'
  },
  {
    id: 'pdf-lab-report',
    title: 'Automated PDF Lab Report Generation',
    category: 'Virtual Lab',
    phase: 'Phase 07',
    status: 'implemented_in_prototype',
    notes: 'Client-side PDF report compilation with observation tables, calculations, and canvas snapshots.',
    sourceModule: 'HomoLumo (pdfExport.ts)'
  },
  {
    id: 'world-progression',
    title: '6 Thematic Adventure Worlds & Mission Briefings',
    category: 'Curriculum & Worlds',
    phase: 'Phase 03',
    status: 'planned',
    notes: 'Discovery Academy, Atomic Frontier, Bonding Worlds, Reaction Forge, Physical Realm, Analytical District.',
    sourceModule: 'docs/Alche-Me_Master_Specification.md (Section 6)'
  },
  {
    id: 'local-persistence',
    title: 'Offline-First Local Persistence & Save State',
    category: 'Persistence',
    phase: 'Phase 04',
    status: 'planned',
    notes: 'IndexedDB/localStorage storage adapter for guest sessions, progress sync, and molecule libraries.',
    sourceModule: 'docs/Alche-Me_Master_Specification.md (Section 12)'
  },
  {
    id: 'rdkit-backend',
    title: 'FastAPI + RDKit C++ Computational Chemistry Server',
    category: 'Molecule Studio',
    phase: 'Phase 08',
    status: 'implemented_in_prototype',
    notes: 'ETKDGv3 3D conformer minimization (MMFF94/UFF), volumetric Gaussian .cube orbital generation, and HSAB matrix.',
    sourceModule: 'HomoLumo backend (chem_engine.py, orbital_engine.py)'
  }
];
