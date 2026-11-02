/**
 * Alche-Me — Complete Apparatus Matrix (20 Items)
 * Faithfully matches the Chemistry for Engineers Lab Manual Apparatus Sheet
 */

import { ApparatusItem } from './types';

export const APPARATUS_ITEMS: ApparatusItem[] = [
  {
    id: 'app-conical-flask',
    name: 'Conical flask',
    subtitle: 'Erlenmeyer Flask',
    category: 'glassware',
    experiments: 'Exp 1, 2, 5',
    expNumbers: [1, 2, 5],
    description: 'Flat-bottomed conical borosilicate flask with cylindrical neck, designed for swirling liquids without risk of spillage during titration.',
    specifications: [
      'Capacity: 250 mL',
      'Material: Borosilicate Glass 3.3',
      'Thermal Shock Resistance: Up to 200°C ΔT',
      'Graduations: ±5% volume indication'
    ],
    careAndSafety: [
      'Inspect for hairline cracks before swirling.',
      'Rinse with distilled water; do NOT rinse with titrant or sample solution.',
      'Place on white ceramic tile under burette for sharp color transition detection.'
    ],
    capacity: '250 mL',
    material: 'Borosilicate Glass 3.3'
  },
  {
    id: 'app-stopper-flask',
    name: 'Stopper flask',
    subtitle: 'Iodine Determination Flask',
    category: 'glassware',
    experiments: 'Exp 3',
    expNumbers: [3],
    description: 'Conical flask fitted with ground glass stopper and flared lip, specially engineered to prevent escape of volatile chlorine and iodine vapors.',
    specifications: [
      'Capacity: 250 mL',
      'Interchangeable Joint: Standard ground glass stopper size 24/29',
      'Flared Funnel Lip: Traps displaced vapor with seal water wash'
    ],
    careAndSafety: [
      'Keep stoppered tightly during reaction to prevent iodine sublimation.',
      'Rinse stopper and inner neck with distilled water from wash bottle before opening.'
    ],
    capacity: '250 mL',
    material: 'Borosilicate Glass with Ground Joint'
  },
  {
    id: 'app-beaker',
    name: 'Beaker',
    subtitle: 'Low-Form Griffin Beaker',
    category: 'glassware',
    experiments: 'Exp 1, 3, 4, 7',
    expNumbers: [1, 3, 4, 7],
    description: 'Cylindrical container with flat bottom and pouring spout, used for holding reagents, conducting boiling steps, and immersing sensor probes.',
    specifications: [
      'Capacities: 100 mL, 250 mL, 500 mL',
      'Spout: Clean-pour anti-drip contour',
      'Chemical Resistance: Class 1 Hydrolytic Resistance'
    ],
    careAndSafety: [
      'Do not use beaker graduations for precise volumetric measurements.',
      'Always use wire gauze with ceramic center when heating over Bunsen burner.'
    ],
    capacity: '100 mL / 500 mL',
    material: 'Borosilicate Glass 3.3'
  },
  {
    id: 'app-measuring-flask',
    name: 'Measuring flask',
    subtitle: 'Volumetric Flask with Stopper',
    category: 'glassware',
    experiments: 'Exp 1, 2',
    expNumbers: [1, 2],
    description: 'Pear-shaped flask with long narrow neck carrying a calibrated circular ring mark, for preparing precise standard volumetric solutions.',
    specifications: [
      'Capacity: 250 mL Class A',
      'Calibrated Tolerance: ±0.15 mL at 20°C',
      'Graduation: Single permanent ring mark etched on neck'
    ],
    careAndSafety: [
      'Do not dry volumetric flasks in hot ovens as thermal expansion damages calibration.',
      'Adjust bottom of fluid meniscus to coincide exactly with calibration ring at eye level.'
    ],
    capacity: '250 mL',
    material: 'Class A Borosilicate Glass'
  },
  {
    id: 'app-measuring-cylinder',
    name: 'Measuring cylinder',
    subtitle: 'Graduated Cylinder with Hexagonal Base',
    category: 'glassware',
    experiments: 'Exp 7',
    expNumbers: [7],
    description: 'Tall narrow cylinder calibrated with graduation divisions, used for measuring approximate volumes of reagents and sample solutions.',
    specifications: [
      'Capacity: 50 mL / 100 mL',
      'Subdivisions: 1.0 mL divisions',
      'Base: Heavy hexagonal glass base for anti-roll stability'
    ],
    careAndSafety: [
      'Keep protective plastic bumper ring near top to prevent rim fracture if knocked over.',
      'Read meniscus at perpendicular horizontal line of sight.'
    ],
    capacity: '50 mL',
    material: 'Heavy-Wall Borosilicate Glass'
  },
  {
    id: 'app-pipette',
    name: 'Pipette',
    subtitle: 'Transfer Volumetric Pipette',
    category: 'glassware',
    experiments: 'Exp 1, 2, 3, 5',
    expNumbers: [1, 2, 3, 5],
    description: 'Single-volume bulb pipette calibrated to deliver fixed volume (10 mL, 20 mL, 25 mL) of sample solution with maximum analytical accuracy.',
    specifications: [
      'Capacities: 10 mL, 20 mL, 25 mL Class A',
      'Class A Accuracy: ±0.03 mL delivery tolerance',
      'Color Code: International ring color coding'
    ],
    careAndSafety: [
      'Never mouth-pipette chemical reagents or corrosive acids; always use rubber suction bulb.',
      'Rinse with the solution to be transferred after rinsing with distilled water.',
      'Allow liquid to drain naturally; do not blow out final retained droplet in jet tip.'
    ],
    capacity: '10 mL / 25 mL',
    material: 'Borosilicate Glass Class A'
  },
  {
    id: 'app-burette-stand',
    name: 'Burette and stand',
    subtitle: '50 mL Burette with Retort Clamp',
    category: 'glassware',
    experiments: 'Exp 1 to 5',
    expNumbers: [1, 2, 3, 4, 5],
    description: 'Precision graduated glass tube with PTFE stopcock valve mounted on cast-iron retort stand, dispensing titrant in controlled streams or single drops.',
    specifications: [
      'Capacity: 50 mL',
      'Graduation Interval: 0.10 mL increments',
      'Stopcock: Inert PTFE teflon plug requiring no grease',
      'Retort Base: Heavy enamel cast-iron base with chrome-plated rod'
    ],
    careAndSafety: [
      'Verify no air bubbles are trapped in the burette nozzle before noting initial reading.',
      'Read lower meniscus for colorless liquids and upper meniscus for deeply colored liquids (K2Cr2O7).',
      'Deliver dropwise near equivalence point to avoid overshooting.'
    ],
    capacity: '50 mL',
    material: 'Borosilicate Glass with PTFE Stopcock & Cast Iron Stand'
  },
  {
    id: 'app-micro-burette',
    name: 'Micro-burette',
    subtitle: 'Fine Precision Micro-Titrator',
    category: 'glassware',
    experiments: 'Exp 7',
    expNumbers: [7],
    description: 'Narrow-bore burette with reservoir bulb and micro-metering jet for conductometric titrations where small titrant increments (0.05 mL) are required.',
    specifications: [
      'Capacity: 10 mL',
      'Subdivisions: 0.02 mL / 0.05 mL divisions',
      'Delivery Tip: Drawn fine capillary tip for micro-drop formation'
    ],
    careAndSafety: [
      'Rinse carefully with 0.1 N NaOH to avoid dilution errors.',
      'Keep nozzle immersed or deliver precisely onto beaker liquid surface without splashing.'
    ],
    capacity: '10 mL',
    material: 'Borosilicate Glass'
  },
  {
    id: 'app-wash-bottle',
    name: 'Wash bottle',
    subtitle: 'LDPE Squeeze Dispenser',
    category: 'glassware',
    experiments: 'Exp 3',
    expNumbers: [3],
    description: 'Flexible low-density polyethylene squeeze bottle with angled draw tube, delivering fine directed jet of distilled water to wash vessel walls and electrodes.',
    specifications: [
      'Capacity: 500 mL',
      'Material: Translucent virgin LDPE with polypropylene closure',
      'Flexibility: Easy squeeze with responsive flow cutoff'
    ],
    careAndSafety: [
      'Fill only with deionized or high-purity distilled water.',
      'Do not touch nozzle tip to contaminated reagents.'
    ],
    capacity: '500 mL',
    material: 'Chemical-Resistant Polyethylene'
  },
  {
    id: 'app-glass-rod',
    name: 'Glass rod',
    subtitle: 'Stirring Rod with Polished Ends',
    category: 'glassware',
    experiments: 'Exp 7',
    expNumbers: [7],
    description: 'Solid borosilicate glass rod with flame-polished rounded ends for manual stirring, guiding liquid pouring, and mixing conductometric solutions.',
    specifications: [
      'Diameter: 6 mm',
      'Length: 200 mm',
      'Ends: Flame-polished round hemispherical tips'
    ],
    careAndSafety: [
      'Do not strike bottom of delicate beakers or conductivity cells.',
      'Rinse with distilled water into the titration vessel before setting aside.'
    ],
    capacity: '200 mm length',
    material: 'Solid Borosilicate Glass'
  },
  {
    id: 'app-kohlrausch-flask',
    name: 'Kohlrausch flask',
    subtitle: '50 mL Efflux Receiving Flask',
    category: 'glassware',
    experiments: 'Exp 6 (50 ml mark)',
    expNumbers: [6],
    description: 'Specialized wide-mouthed flask with narrow graduated neck, calibrated specifically to receive exactly 50 mL discharge from Redwood viscometer.',
    specifications: [
      'Capacity: 50 mL exact ring mark',
      'Mouth: Expanded upper funnel to catch dripping oil jet',
      'Neck: Narrow calibration zone maximizing meniscus detection precision'
    ],
    careAndSafety: [
      'Keep flask clean and dry without solvent droplets before viscometer test.',
      'Stop stopwatch precisely as bottom of oil meniscus touches etched 50 mL ring.'
    ],
    capacity: '50 mL at 20°C',
    material: 'Borosilicate Glass'
  },
  {
    id: 'app-stopwatch',
    name: 'Stopwatch',
    subtitle: 'Digital Electronic Chronometer',
    category: 'metal',
    experiments: 'Exp 6',
    expNumbers: [6],
    description: 'High-precision digital quartz stopwatch with start/stop button for recording efflux time in Redwood seconds with 0.01-second resolution.',
    specifications: [
      'Resolution: 0.01 seconds (1/100 s)',
      'Timing Capacity: 23 hr 59 min 59 sec',
      'Trigger Mechanism: Fast tactile microswitch'
    ],
    careAndSafety: [
      'Coordinate lifting of ball valve and pressing start button simultaneously.',
      'Check battery level before starting viscometric test.'
    ],
    capacity: '0.01s Precision',
    material: 'ABS Casing with Stainless Buttons'
  },
  {
    id: 'app-tds-meter',
    name: 'TDS meter',
    subtitle: 'Digital Total Dissolved Solids Tester',
    category: 'electronics',
    experiments: 'Exp 3',
    expNumbers: [3],
    description: 'Handheld microprocessor-based conductivity probe measuring dissolved mineral salts (ppm or mg/L) with automatic temperature compensation (ATC).',
    specifications: [
      'Measurement Range: 0 to 9990 ppm',
      'Accuracy: ±2% Full Scale',
      'ATC: Automatic Temperature Compensation 0–50°C',
      'Calibration: Standard NaCl buffer solution'
    ],
    careAndSafety: [
      'Remove protective cap and immerse electrodes up to maximum immersion line.',
      'Stir gently to dislodge air bubbles adhering to electrode pins.',
      'Rinse with distilled water and dry with tissue after testing.'
    ],
    capacity: '0–9990 ppm Range',
    material: 'Polycarbonate with Titanium Electrodes'
  },
  {
    id: 'app-conductivity-meter',
    name: 'Conductivity meter',
    subtitle: 'Digital Electrolytic Conductometer',
    category: 'electronics',
    experiments: 'Exp 7',
    expNumbers: [7],
    description: 'Laboratory digital conductivity meter with AC bridge oscillator, measuring ionic solution conductance in mS/cm without electrode polarization.',
    specifications: [
      'Frequency: 1 kHz AC square wave prevents electrolysis',
      'Display: 3.5 digit LED/LCD display (mS/cm / µS/cm)',
      'Cell Constant Adjustment: 0.8 to 1.2 cm⁻¹ range'
    ],
    careAndSafety: [
      'Calibrate with standard 0.1 N KCl solution (12.88 mS/cm at 25°C).',
      'Allow 20 seconds for reading to stabilize following each NaOH addition.'
    ],
    capacity: '0.1 µS/cm to 200 mS/cm',
    material: 'Precision Electronics Unit'
  },
  {
    id: 'app-conductivity-cell',
    name: 'Conductivity cell',
    subtitle: 'Dip-Type Platinized Platinum Cell',
    category: 'electronics',
    experiments: 'Exp 7',
    expNumbers: [7],
    description: 'Glass dip cell containing two parallel platinum plates coated with platinum black, defining a rigid cell constant (K ≈ 1.0 cm⁻¹).',
    specifications: [
      'Electrode Plates: Platinized Platinum foil (1 cm² area, 1 cm apart)',
      'Cell Constant (K): ~1.0 cm⁻¹ ± 10%',
      'Body: Glass shroud protecting plates from mechanical shock'
    ],
    careAndSafety: [
      'Never touch platinized black coating on platinum plates with fingers or cloth.',
      'Store submerged in distilled water when not in use to keep active surface hydrated.',
      'Ensure plates are completely submerged below liquid level in titration beaker.'
    ],
    capacity: 'Cell Constant ~1.0 cm⁻¹',
    material: 'Borosilicate Glass & Platinum Black'
  },
  {
    id: 'app-electrodes',
    name: 'Electrodes',
    subtitle: 'Pt, SCE & Glass Electrodes',
    category: 'electronics',
    experiments: 'Exp 4',
    expNumbers: [4],
    description: 'Electrochemical sensor pair: inert Platinum indicator electrode sensing Fe³⁺/Fe²⁺ electron transfer, and Saturated Calomel reference electrode (SCE, +0.242 V).',
    specifications: [
      'Platinum Electrode: Pure Pt wire/foil indicator (E° = +0.771 V vs SHE)',
      'Reference Electrode: Saturated Calomel Electrode (Hg | Hg2Cl2 | KCl sat)',
      'Glass Electrode: Alternative pH sensing bulb for potentiometric acidimetry'
    ],
    careAndSafety: [
      'Check that saturated KCl crystals are visible in calomel electrode reservoir.',
      'Clean Pt electrode by dipping momentarily in concentrated HNO3 and rinsing with water.',
      'Keep porous ceramic junction unclogged.'
    ],
    capacity: 'Standard Half-Cell Couple',
    material: 'Glass, Platinum Foil & Calomel Paste'
  },
  {
    id: 'app-potentiometer',
    name: 'Potentiometer',
    subtitle: 'Digital Millivoltmeter (mV)',
    category: 'electronics',
    experiments: 'Exp 4',
    expNumbers: [4],
    description: 'High-input impedance digital potentiometer measuring the open-circuit cell electromotive force (EMF) without drawing current from the electrochemical cell.',
    specifications: [
      'Voltage Range: -1999 mV to +1999 mV',
      'Input Impedance: > 10¹² Ω preventing cell polarization',
      'Accuracy: ±1 mV resolution'
    ],
    careAndSafety: [
      'Connect Platinum electrode to positive terminal and Calomel electrode to reference ground.',
      'Ensure continuous magnetic stirring between additions, but read EMF when stable.'
    ],
    capacity: '±1999 mV Digital Display',
    material: 'High-Z Solid State Electronics'
  },
  {
    id: 'app-redwood-viscometer',
    name: 'Redwood viscometer',
    subtitle: 'Redwood Viscometer No. 1 & 2',
    category: 'metal',
    experiments: 'Exp 6',
    expNumbers: [6],
    description: 'Standardized apparatus comprising copper water bath, silvered brass oil cup, agate jet capillary, ball valve, and thermometer for oil viscosity measurement.',
    specifications: [
      'Redwood No. 1 Jet: Orifice Ø 1.62 mm, length 10 mm (efflux time < 2000 s)',
      'Redwood No. 2 Jet: Orifice Ø 3.80 mm, length 50 mm (heavy oils > 2000 s)',
      'Agate Orifice: Natural polished agate jewel jet resistant to erosion and corrosion',
      'Water Bath: Heavy gauge copper with spiral burner arm'
    ],
    careAndSafety: [
      'Level apparatus carefully using leveling screws until cup spirit level is centered.',
      'Never clean precision agate orifice with metallic wire; use soft solvent-soaked cotton.',
      'Ensure water bath temperature is uniformly maintained with constant stirring.'
    ],
    capacity: 'Redwood No. 1 & 2 Standard',
    material: 'Copper, Brass, Polished Agate & Cast Iron'
  },
  {
    id: 'app-computer-arguslab',
    name: 'Computer + ArgusLab',
    subtitle: 'Computational Chemistry Workstation',
    category: 'electronics',
    experiments: 'Exp 8, 9',
    expNumbers: [8, 9],
    description: 'Computer workstation running ArgusLab and Alche-Me 3D Molecular Graphics Engine for potential energy surface geometry optimization and valence bond calculation.',
    specifications: [
      'Engine: 3Dmol WebGL + MMFF94 / UFF force field solvers',
      'Calculations: Bond angles, bond lengths, dihedral torsion, and SCF ground state energy',
      'Orbital Rendering: 3D isosurface Marching Cubes visualizer'
    ],
    careAndSafety: [
      'Optimize initial molecular skeletal connectivity before calculating valence angles.',
      'Verify SCF convergence threshold before recording final equilibrium geometry.'
    ],
    capacity: 'Quantum / Molecular Mechanics CAD',
    material: 'Digital Workstation & WebGL Engine'
  },
  {
    id: 'app-key-card',
    name: 'Lab Manual Guide',
    subtitle: 'Syllabus Item Classification',
    category: 'key',
    experiments: 'Exp numbers follow the lab manual',
    expNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    description: 'Color-coded apparatus index aligning physical laboratory equipment with university engineering syllabus (MRIIRS 4.5CH101C00H).',
    specifications: [
      'Glassware: 9 Volumetric & Reaction Vessels (Blue border)',
      'Metal Parts: 3 Mechanical & Timing Instruments (Gray border)',
      'Electronics: 6 Digital Meters, Sensors & Workstations (Teal border)',
      'Curriculum: 10 Prescribed B.Tech Chemistry Experiments'
    ],
    careAndSafety: [
      'Always follow standard laboratory safety protocols (lab coat, safety goggles, enclosed footwear).',
      'Perform all chemical calculations with concordant volumetric values.'
    ],
    capacity: 'All 10 Lab Practicals',
    material: 'University Engineering Lab Matrix'
  }
];
