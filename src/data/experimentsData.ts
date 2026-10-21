export interface ExperimentItem {
  id: string;
  num: string;
  title: string;
  category: string;
  manualPage: string;
  aim: string;
  reagents: string[];
  apparatus: string[];
  principle: string;
  reactions: string[];
  procedure: string[];
  observations: string[];
  formulae: string;
  precautions: string[];
  thingsToObserve: string;
  utility: string;
  targetSmiles: string;
  compoundName: string;
}

export const EXPERIMENTS_DATA: ExperimentItem[] = [
  {
    id: 'exp-1',
    num: '01',
    title: 'Determination of Hardness of Water using EDTA',
    category: 'Complexometric Titration',
    manualPage: 'Pages 5–8',
    aim: 'To determine the total, permanent, and temporary hardness of a given water sample using standard 0.01 M EDTA solution and Eriochrome Black T (EBT) indicator in ammonia buffer at pH 10.',
    reagents: [
      'Standard 0.01 M Disodium EDTA solution',
      'Ammonia buffer solution (NH4Cl + NH4OH, pH = 10.0)',
      'Standard Hard Water (SHW, 1 mg/mL CaCO3 equivalent)',
      'Eriochrome Black T (EBT) indicator',
      'Unknown hard water sample'
    ],
    apparatus: [
      'Burette (50 mL) & stand',
      'Conical flask (250 mL)',
      'Volumetric pipette (25 mL)',
      'Measuring flask (250 mL)',
      'Beaker (500 mL)'
    ],
    principle: 'Total hardness (permanent as well as temporary) is determined by complexometric titration against EDTA in ammonia buffer (pH 10) using EBT. Ca²⁺ and Mg²⁺ form an unstable wine-red complex with EBT. When titrated with standard EDTA, EDTA binds preferentially with Ca²⁺ and Mg²⁺ to form a highly stable, colorless chelate complex, displacing free EBT which turns pure steel blue at the stoichiometric equivalence point.',
    reactions: [
      'Step 1: Ca²⁺/Mg²⁺ + EBT (blue) ⟶ [Ca/Mg-EBT complex] (unstable wine-red)',
      'Step 2: Ca²⁺/Mg²⁺ + EDTA ⟶ [Ca/Mg-EDTA complex] (stable, colorless)',
      'Step 3: [Ca/Mg-EBT] (wine-red) + EDTA ⟶ [Ca/Mg-EDTA] (colorless) + EBT (free steel blue)'
    ],
    procedure: [
      '1. Standardization of EDTA: Pipette 25 mL standard hard water into conical flask, add 5 mL buffer solution (pH 10) and 2-3 drops of EBT indicator (turns wine-red). Titrate against standard EDTA until wine-red changes to steel blue (V1 mL).',
      '2. Total Hardness: Pipette 25 mL of unknown hard water sample, add 5 mL buffer and 2-3 drops EBT. Titrate with EDTA until wine-red turns blue (V2 mL).',
      '3. Permanent Hardness: Take 250 mL of hard water sample in 500 mL beaker, boil gently for 1 hour to precipitate temporary hardness as insoluble carbonates. Cool, filter into 250 mL volumetric flask, make up to mark with distilled water. Titrate 25 mL of this boiled sample against EDTA (V3 mL).',
      '4. Temporary Hardness: Calculate by subtracting permanent hardness from total hardness.'
    ],
    observations: [
      'Table 1 (Standard Hard Water): Concordant volume of EDTA used = V1 mL',
      'Table 2 (Unknown Hard Water): Concordant volume of EDTA used = V2 mL',
      'Table 3 (Boiled Water): Concordant volume of EDTA used = V3 mL',
      'Endpoint: Distinct color change from wine-red to steel blue'
    ],
    formulae: '1. Standardization: 1 mL EDTA = 25 / V1 mg CaCO3 eq\n2. Total Hardness = (V2 / V1) × 1000 mg/L or ppm (Say X ppm)\n3. Permanent Hardness = (V3 / V1) × 1000 mg/L or ppm (Say Y ppm)\n4. Temporary Hardness = Total - Permanent = (X - Y) ppm',
    precautions: [
      'Rinse all glassware with distilled water before starting the experiment.',
      'Maintain buffer solution pH precisely at 10.0 for stable chelate formation.',
      'The volume of EBT indicator used should be constant across all titrations.',
      'Add EDTA solution drop-wise near the equivalence point to prevent overshooting.'
    ],
    thingsToObserve: 'Carefully observe the transition from wine-red to clear steel blue without residual purple hue.',
    utility: 'Crucial for assessing boiler feed water quality to prevent scale/sludge formation and calculating exact lime-soda water softening dosage.',
    targetSmiles: 'C10H16N2O8',
    compoundName: 'EDTA (Ethylenediaminetetraacetic Acid)'
  },
  {
    id: 'exp-2',
    num: '02',
    title: 'Determination of Alkalinity of Water Sample',
    category: 'Acid-Base Neutralization Titration',
    manualPage: 'Pages 9–11',
    aim: 'To determine the alkalinity (due to OH⁻, CO3²⁻, and HCO3⁻ ions) in a given water sample by double indicator titration using standard N/10 H2SO4.',
    reagents: [
      'Standard N/10 Sulfuric Acid (H2SO4)',
      'Phenolphthalein indicator solution',
      'Methyl orange indicator solution',
      'Water sample'
    ],
    apparatus: [
      'Conical flask (250 mL)',
      'Burette (50 mL) & stand',
      'Volumetric pipette (50 mL)',
      'Measuring flask'
    ],
    principle: 'Alkalinity is caused by hydroxide (OH⁻), carbonate (CO3²⁻), and bicarbonate (HCO3⁻) ions. They are estimated separately by stepwise titration against standard acid using two indicators with distinct pH ranges: Phenolphthalein (endpoint P at pH 8.3) completes OH⁻ neutralization and half-neutralizes CO3²⁻ to HCO3⁻; Methyl orange (endpoint M at pH 4.0-4.5) neutralizes all remaining HCO3⁻ to H2O and CO2. OH⁻ and HCO3⁻ cannot coexist as they recombine into CO3²⁻.',
    reactions: [
      'Reaction 1 (P): OH⁻ + H⁺ ⟶ H2O',
      'Reaction 2 (P): CO3²⁻ + H⁺ ⟶ HCO3⁻ (Half neutralization of carbonate)',
      'Reaction 3 (M): HCO3⁻ + H⁺ ⟶ H2O + CO2 (Complete neutralization)'
    ],
    procedure: [
      '1. Pipette 50 mL of water sample into a clean conical flask.',
      '2. Add 2-3 drops of phenolphthalein indicator. If solution turns pink, titrate against N/10 H2SO4 until pink just disappears (VP mL).',
      '3. To the same solution, add 2-3 drops of methyl orange indicator (turns light yellow).',
      '4. Continue titration with N/10 H2SO4 until light yellow changes to yellowish-red (VM mL).',
      '5. Repeat titration to obtain concordant burette readings for VP and VM.'
    ],
    observations: [
      'Volume of water sample used = 50 mL',
      'Concordant reading for Phenolphthalein end point (VP) = ... mL',
      'Concordant reading for Methyl Orange end point (VM) = ... mL'
    ],
    formulae: 'Phenolphthalein Alkalinity (P) = VP × 100 ppm CaCO3 eq\nTotal Alkalinity (M) = VM × 100 ppm CaCO3 eq\n\nIon Alkalinity Breakdown Table:\n• P = 0 ⟹ OH⁻ = 0, CO3²⁻ = 0, HCO3⁻ = M\n• P = 1/2 M ⟹ OH⁻ = 0, CO3²⁻ = 2P, HCO3⁻ = 0\n• P < 1/2 M ⟹ OH⁻ = 0, CO3²⁻ = 2P, HCO3⁻ = M - 2P\n• P > 1/2 M ⟹ OH⁻ = 2P - M, CO3²⁻ = 2(M - P), HCO3⁻ = 0\n• P = M ⟹ OH⁻ = P = M, CO3²⁻ = 0, HCO3⁻ = 0',
    precautions: [
      'Rinse glass wares with distilled water before starting.',
      'The end point of titration should be carefully observed at first color transition.',
      'H2SO4 solution should be added drop-wise to obtain an accurate end point.'
    ],
    thingsToObserve: 'Color change from pink to colorless (Phenolphthalein) followed by light yellow to reddish-yellow (Methyl Orange).',
    utility: 'Essential to control boiler corrosion/caustic embrittlement, determine softening lime-soda requirements, and regulate agricultural irrigation water.',
    targetSmiles: 'C20H14O4',
    compoundName: 'Phenolphthalein Indicator'
  },
  {
    id: 'exp-3',
    num: '03',
    title: 'Determination of Chlorine Content and TDS in Water Samples',
    category: 'Iodometric Redox Titration & Electrometric TDS',
    manualPage: 'Pages 12–14',
    aim: 'To determine the amount of residual chlorine in water samples by iodometric titration against N/50 Na2S2O3 and measure Total Dissolved Solids (TDS) using a digital TDS meter.',
    reagents: [
      'Standard N/50 Sodium Thiosulfate (Na2S2O3 / Hypo)',
      'Glacial acetic acid (maintains pH 3–4)',
      'Potassium Iodide (KI)',
      'Freshly prepared starch indicator solution',
      'Water samples'
    ],
    apparatus: [
      'Digital TDS meter (DiST)',
      'Burette & stand',
      'Pipette (50 mL)',
      'Stoppered conical flask (250 mL)',
      'Beakers'
    ],
    principle: 'Residual chlorine oxidizes potassium iodide (KI) quantitatively in acidic medium (pH 3-4) to liberate free elemental iodine (I2): Cl2 + 2KI ⟶ 2KCl + I2. The liberated iodine is titrated against standardized hypo (Na2S2O3): I2 + 2Na2S2O3 ⟶ 2NaI + Na2S4O6. Starch forms an intense blue adsorption complex with residual iodine; the disappearance of this blue marks the equivalence point. TDS is measured directly using a digital conductivity probe.',
    reactions: [
      'Cl2 + 2KI ⟶ 2KCl + I2 (Dark Brown)',
      'I2 + 2Na2S2O3 ⟶ 2NaI + Na2S4O6 (Pale Yellow / Colorless)',
      'I2 + Starch ⟶ Deep Blue Complex (Disappears at end point)'
    ],
    procedure: [
      '1. Pipette 50 mL water sample into stoppered flask, add 2 mL KI solution and 3 mL glacial acetic acid (pH 3-4).',
      '2. Cover flask, swirl, and rinse inner flask walls with wash bottle.',
      '3. Titrate with N/50 Na2S2O3 from burette until dark brown turns pale yellow.',
      '4. Add a few drops of freshly prepared starch solution (turns deep dark blue).',
      '5. Continue drop-wise titration with Na2S2O3 until blue color completely vanishes. Repeat for 3 concordant readings.',
      '6. TDS Measurement: Remove protective cap of digital TDS meter, immerse electrode in sample, and read direct TDS in g/L or ppm.'
    ],
    observations: [
      'Normality of Na2S2O3 = N/50',
      'Sample Volume = 50 mL; Volume of titrant used = V2 mL',
      'TDS Readings across samples (tap water, groundwater, filtered water) in ppm'
    ],
    formulae: 'N1 × 50 = (1/50) × V2 ⟹ N1 = V2 / 2500\nTotal Residual Chlorine = N1 × Equivalent Weight of Cl (35.5) × 1000 mg/L (ppm)\nFederal TDS Guideline: Recommended < 500 ppm (Aesthetic taste optimum ~300 ppm)',
    precautions: [
      'Chlorine vapors are harmful; do not inhale.',
      'Titrate rapidly to avoid atmospheric oxidation of iodide.',
      'End point must be taken at the very first disappearance of blue color.'
    ],
    thingsToObserve: 'Color evolution: Brown ⟶ Pale yellow ⟶ Deep blue (with starch) ⟶ Pure colorless.',
    utility: 'Validates municipal drinking water disinfection (< 1 ppm residual limit prevents mucous and digestive tract irritation) and monitors dissolved mineral scaling.',
    targetSmiles: 'Na2S2O3',
    compoundName: 'Sodium Thiosulfate (Hypo)'
  },
  {
    id: 'exp-4',
    num: '04',
    title: 'Determination of Ferrous Ion Concentration using Potentiometer',
    category: 'Potentiometric Redox Titration',
    manualPage: 'Pages 15–16',
    aim: 'To determine the exact concentration and strength of ferrous ions (Fe²⁺) in a given solution by potentiometric redox titration using standard N/10 potassium dichromate.',
    reagents: [
      'Standard N/10 Potassium Dichromate (K2Cr2O7)',
      'Hydrated ferrous sulfate solution (FeSO4·7H2O)',
      'Dilute Sulfuric Acid (H2SO4)',
      'Distilled water'
    ],
    apparatus: [
      'Digital Potentiometer / Millivoltmeter',
      'Platinum indicator foil electrode',
      'Saturated Calomel reference electrode (SCE)',
      'Burette (50 mL)',
      'Beaker (100 mL)',
      'Magnetic stirrer'
    ],
    principle: 'Potentiometric titrations measure the electromotive force (EMF) between an inert platinum indicator electrode and a saturated calomel reference electrode during redox reaction: 6Fe²⁺ + Cr2O7²⁻ + 14H⁺ ⟶ 6Fe³⁺ + 2Cr³⁺ + 7H2O. Cell setup: Pt | Fe²⁺, Fe³⁺ || KCl, Hg2Cl2(s) | Hg. As K2Cr2O7 is added, Fe²⁺ is oxidized to Fe³⁺, raising the potential according to the Nernst equation. At the equivalence point, complete depletion of Fe²⁺ triggers a steep potential jump (ΔE/ΔV).',
    reactions: [
      '6Fe²⁺ + Cr2O7²⁻ + 14H⁺ ⟶ 6Fe³⁺ + 2Cr³⁺ + 7H2O',
      'Indicator: Fe³⁺ + e⁻ ⇌ Fe²⁺ (E° = +0.77 V)',
      'Reference: Hg2Cl2(s) + 2e⁻ ⇌ 2Hg(l) + 2Cl⁻ (E = +0.242 V)'
    ],
    procedure: [
      '1. Prepare standard N/10 Potassium Dichromate solution.',
      '2. Pipette 20 mL ferrous solution into 100 mL beaker; add 10 mL dilute H2SO4.',
      '3. Dip platinum electrode and calomel electrode into solution and connect to potentiometer.',
      '4. Add K2Cr2O7 in 1 mL increments from burette, stirring for 30 seconds after each addition.',
      '5. Record stabilized EMF after each addition; continue for 5 measurements past the jump.',
      '6. Plot EMF (mV) vs Volume of K2Cr2O7 (mL) to identify the inflection point (V1).'
    ],
    observations: [
      'Volume of Potassium Dichromate (V1) at steepest slope (ΔE/ΔV) = ... mL',
      'Volume of ferrous solution (V2) = 20 mL; Normality of dichromate (N1) = 0.1 N'
    ],
    formulae: 'Normality of Fe²⁺ (N2) = (V1 × N1) / V2\nStrength of Fe²⁺ = N2 × Equivalent Weight of Fe (55.85) g/L',
    precautions: [
      'Rinse electrodes with distilled water before and after use.',
      'Thoroughly stir solution after each increment; wait for EMF to stabilize.',
      'Handle electrodes carefully; ensure full immersion without touching beaker walls.'
    ],
    thingsToObserve: 'Measure EMF after stabilization. Note the gently sloping region followed by a steep vertical surge at equivalence.',
    utility: 'Preferred over manual visual titrations for dark, colored, or turbid solutions; widely used for iron assaying in metallurgy and mineral ores.',
    targetSmiles: '[K+].[K+].[O-][Cr](=O)(=O)O[Cr](=O)(=O)[O-]',
    compoundName: 'Potassium Dichromate (K2Cr2O7)'
  },
  {
    id: 'exp-5',
    num: '05',
    title: 'Percentage Composition of Mixture of NaOH and NaCl',
    category: 'Acidimetric Neutralization',
    manualPage: 'Pages 17–18',
    aim: 'To determine the percentage composition of sodium hydroxide (NaOH) and sodium chloride (NaCl) in a given binary solid mixture (8 g/L) by titration against 0.1 N HCl.',
    reagents: [
      'Standard 0.1 N Hydrochloric Acid (HCl)',
      'Binary mixture of NaOH and NaCl (8 g/L total sample)',
      'Phenolphthalein indicator',
      'Distilled water'
    ],
    apparatus: [
      'Burette (50 mL)',
      'Volumetric pipette (10 mL)',
      'Conical flasks (250 mL)',
      'Beakers'
    ],
    principle: 'Hydrochloric acid selectively neutralizes sodium hydroxide: HCl + NaOH ⟶ NaCl + H2O, while sodium chloride (NaCl) is an inert neutral salt and remains unreacted. By measuring the volume of 0.1 N HCl required to discharge the pink phenolphthalein color, the strength of NaOH is determined directly. Subtracting this from the known total solid content (8 g/L) yields the percentage of NaCl.',
    reactions: [
      'HCl + NaOH ⟶ NaCl + H2O (Selective neutralization)',
      'NaCl + HCl ⟶ No Reaction (Inert neutral salt)'
    ],
    procedure: [
      '1. Fill burette with 0.1 N HCl solution after rinsing; note initial reading.',
      '2. Pipette 10 mL of the given mixture (total 8 g/L) into conical flask.',
      '3. Add 1 drop of phenolphthalein indicator (solution turns pink).',
      '4. Titrate with 0.1 N HCl until solution becomes permanently colorless (V1 mL).',
      '5. Repeat to obtain three concordant readings.'
    ],
    observations: [
      'Normality of HCl (N1) = 0.1 N',
      'Volume of mixture taken (V2) = 10 mL',
      'Concordant volume of 0.1 N HCl used (V1) = ... mL'
    ],
    formulae: 'N1 V1 = N2 V2 ⟹ N2(NaOH) = (0.1 × V1) / 10\nStrength of NaOH (y) = N2 × 40 g/L\nAmount of NaCl (z) = (8 - y) g/L\n% NaOH = (y / 8) × 100%\n% NaCl = (z / 8) × 100%',
    precautions: [
      'Wash apparatus with detergent and rinse thoroughly with distilled water.',
      'Rinse burette and pipette with respective operating solutions.',
      'Do not rinse conical flask with the sample solution.'
    ],
    thingsToObserve: 'Sharp single-drop transition from pink to colorless at equivalence.',
    utility: 'Individual concentration assaying in industrial chlor-alkali production, caustic soda quality control, and saline brine processing.',
    targetSmiles: '[Na+].[OH-]',
    compoundName: 'Sodium Hydroxide (NaOH)'
  },
  {
    id: 'exp-6',
    num: '06',
    title: 'Determination of Viscosity of Lubricating Oil by Redwood Viscometer',
    category: 'Fluid Mechanics & Tribology',
    manualPage: 'Pages 19–21',
    aim: 'To determine the kinematic and absolute viscosity of given lubricating oil samples (engine oil, machine oil) at room temperature using Redwood Viscometer No. 1 and No. 2.',
    reagents: [
      'Lubricating oil samples (engine oil, machine oil)',
      'Petroleum spirit / Diethyl ether (jet cleaning solvent)'
    ],
    apparatus: [
      'Redwood Viscometer No. 1 (jet Ø 1.62 mm, length 10 mm, for efflux times < 2000 s)',
      'Redwood Viscometer No. 2 (jet Ø 3.80 mm, length 50 mm, for heavy oils > 2000 s)',
      'Digital Precision Stopwatch (0.01 s)',
      '50 mL Kohlrausch receiving flask',
      'Thermometer'
    ],
    principle: 'Viscosity is the fluid property determining resistance to flow due to internal molecular cohesion: F = η · A · (dV/dx). Redwood viscometer measures the time (in Redwood Seconds) required for exactly 50 mL of oil to discharge through a standardized agate orifice under a constant gravity head.',
    reactions: [
      'Poiseuille Capillary Flow: η = (π · P · r⁴ · t) / (8 · V · L)',
      'Empirical Conversion: Kinematic Viscosity ν = A·t - B/t'
    ],
    procedure: [
      '1. Clean viscometer cup and agate jet with petroleum spirit and dry completely.',
      '2. Level the apparatus stand using leveling screws.',
      '3. Place metallic ball valve on mouth of capillary; fill cup with oil up to pointer tip; cover lid with thermometer.',
      '4. Place clean, dry 50 mL Kohlrausch flask directly below discharge jet.',
      '5. Lift ball valve and trigger digital stopwatch simultaneously.',
      '6. Stop timer when lower oil meniscus reaches 50 mL mark on receiving flask.',
      '7. Record elapsed time in Redwood seconds. Repeat for second oil sample.'
    ],
    observations: [
      'Room Temperature = ... °C',
      'Sample 1 (Engine Oil): Observed Viscosity = ... Redwood Seconds (RW1)',
      'Sample 2 (Machine Oil): Observed Viscosity = ... Redwood Seconds (RW1/RW2)'
    ],
    formulae: 'Observed Viscosity = t Redwood Seconds\nKinematic Viscosity (ν in Stokes):\n• For t = 34 to 100 s: ν = 0.0026·t - 1.72/t\n• For t > 100 s: ν = 0.00247·t - 0.50/t\nAbsolute Viscosity (η in Poise) = ν × Density of oil (g/cm³)',
    precautions: [
      'Filter oil properly before testing to avoid clogging the precision agate jet.',
      'Prevent foaming or air bubble entrapment in the Kohlrausch receiving flask.',
      'Ensure apparatus is perfectly leveled before lifting the ball valve.'
    ],
    thingsToObserve: 'Carefully stop the timer exactly when lower meniscus touches the 50 mL ring mark.',
    utility: 'Critical for selecting correct SAE engine oils, hydrodynamic bearing calculations, and minimizing engine wear and parasitic friction.',
    targetSmiles: 'CCCCCCCC',
    compoundName: 'Octane / Aliphatic Base Oil'
  },
  {
    id: 'exp-7',
    num: '07',
    title: 'Conductometric Titration of Strong Acid vs. Strong Base',
    category: 'Conductometric Electroanalysis',
    manualPage: 'Pages 22–23',
    aim: 'To determine the strength of a strong acid (HCl) by conductometric titration using standard 0.1 N sodium hydroxide (NaOH) and plot the conductometric curve.',
    reagents: [
      'Standard 0.1 N Sodium Hydroxide (NaOH)',
      'Hydrochloric acid unknown sample (HCl ~0.1 N)',
      'Conductivity / Deionized water'
    ],
    apparatus: [
      'Digital Conductivity Meter',
      'Conductivity Dip Cell with platinized Pt electrodes',
      'Micro-burette (10 mL / 0.05 mL divisions)',
      'Beaker (100 mL)',
      'Magnetic stirrer & Teflon pellet'
    ],
    principle: 'Conductance depends on ionic concentrations and mobilities. Highly mobile hydronium ions (H⁺, λ = 350 S cm²/eq) are neutralized into unionized water and replaced by lower-mobility sodium ions (Na⁺, λ = 50 S cm²/eq): HCl + NaOH ⟶ NaCl + H2O. Conductivity drops linearly until the equivalence point. Beyond equivalence, addition of excess NaOH introduces fast-moving hydroxide ions (OH⁻, λ = 198 S cm²/eq), producing a steep linear ascent and a distinct V-shaped curve.',
    reactions: [
      'Pre-Equivalence: H⁺ (fast, 350) + Cl⁻ + Na⁺ + OH⁻ ⟶ H2O (unionized) + Na⁺ (slow, 50) + Cl⁻',
      'Equivalence Point: Complete neutralization at conductivity minimum',
      'Post-Equivalence: Excess Na⁺ + OH⁻ (fast, 198) causes steep linear rise'
    ],
    procedure: [
      '1. Calibrate conductivity meter with standard 0.1 M KCl solution; check distilled water.',
      '2. Pipette 50 mL given HCl solution into 100 mL beaker; immerse conductivity cell.',
      '3. Record initial conductivity reading (mS/cm).',
      '4. Add 1.0 mL portions of 0.1 N NaOH from micro-burette; stir for 20 seconds and record stabilized conductivity.',
      '5. Continue additions up to 5 mL beyond the conductivity minimum.',
      '6. Plot Conductivity (mS/cm, Y-axis) vs Volume of NaOH added (mL, X-axis); intersection of linear branches marks equivalence volume V2.'
    ],
    observations: [
      'Volume of HCl taken (V1) = 50 mL',
      'Volume of NaOH added (mL) vs Observed Conductivity (mS/cm) table',
      'Intersection of descending and ascending branches yields equivalence point V2'
    ],
    formulae: 'N1 V1 = N2 V2 ⟹ N1(HCl) = (N2 × V2) / V1\nStrength of HCl = N1 × Equivalent Weight of HCl (36.5) g/L\n(where N2 = 0.1 N, V1 = 50 mL)',
    precautions: [
      'Sodium hydroxide is corrosive; avoid skin and eye contact.',
      'Keep conductivity cell fully submerged without trapped air bubbles.',
      'Stir uniformly after each addition and wait for stable display.'
    ],
    thingsToObserve: 'Conductivity goes down to equivalence point and then suddenly increases, creating a symmetric V-shape.',
    utility: 'Enables accurate acid-base titration in turbid, muddy, or deeply colored industrial effluents without visual indicator ambiguity.',
    targetSmiles: 'Cl',
    compoundName: 'Hydrochloric Acid (HCl)'
  },
  {
    id: 'exp-8',
    num: '08',
    title: 'Compare the Bond Angles of H2O, H2S, and H2Se using Computational Techniques',
    category: 'Computational Chemistry & VSEPR Modeling',
    manualPage: 'Pages 24–25',
    aim: 'To model, optimize 3D molecular geometries, and computationally compare the bond angles of group 16 dihydrides (H2O, H2S, and H2Se) using computational software (ArgusLab / HomoLumo).',
    reagents: [
      'HomoLumo / ArgusLab Computational Chemistry Engine',
      'Group 16 dihydride coordinate datasets (H2O, H2S, H2Se)',
      'Molecular Force Fields (MMFF94 / UFF) & Quantum SCF Solvers'
    ],
    apparatus: [
      'HomoLumo Studio 3D Canvas / ArgusLab Workstation',
      '3D Angle Measurement Tool',
      'Geometry Optimization Engine'
    ],
    principle: 'All group 16 dihydrides have 2 bond pairs and 2 lone pairs on central chalcogen. According to VSEPR theory, Bent’s rule, and Drago’s rule: Oxygen has high electronegativity (3.44) and small radius (66 pm), pulling bond pairs close to the nucleus, causing strong bond-pair bond-pair repulsion which expands the angle to 104.5° (sp³ hybridization). Down group 16 (O ⟶ S ⟶ Se), electronegativity decreases (S: 2.58, Se: 2.55) and atomic radius grows. Bonding pairs sit farther away, minimizing repulsion; lone pairs occupy pure s-orbitals while bonds form with almost pure p-orbitals (~90°): H2O (104.5°) > H2S (92.1°) > H2Se (90.6°).',
    reactions: [
      'Hybridization Shift: sp³ in Water ⟶ Pure p-orbital bonding in H2S and H2Se (Drago Rule)',
      'Bond Angle Trend: ∠H-O-H (104.5°) > ∠H-S-H (92.1°) > ∠H-Se-H (90.6°)'
    ],
    procedure: [
      '1. Open HomoLumo Studio 3D CAD interface.',
      '2. Select Oxygen atom, add two Hydrogen atoms with single bonds to construct Water (H2O).',
      '3. Measure initial unoptimized ∠H-O-H bond angle using the Angle Measurement tool.',
      '4. Execute Geometry Optimization to compute ground-state equilibrium structure.',
      '5. Record optimized ∠H-O-H bond angle and SCF energy.',
      '6. Repeat the protocol for Hydrogen Sulfide (H2S) and Hydrogen Selenide (H2Se).',
      '7. Compare theoretical vs computed bond angle shrinkage.'
    ],
    observations: [
      '1. H2O: Bond angle without optimization = 109.5°; Optimized bond angle = 104.5°',
      '2. H2S: Bond angle without optimization = 109.5°; Optimized bond angle = 92.1°',
      '3. H2Se: Bond angle without optimization = 109.5°; Optimized bond angle = 90.6°'
    ],
    formulae: 'Bond Angle Trend: ∠H-O-H (104.5°) > ∠H-S-H (92.1°) > ∠H-Se-H (90.6°)\nPeriodic Correlation: Central atom electronegativity decrease (3.44 ⟶ 2.58 ⟶ 2.55) diminishes bond-pair repulsion.',
    precautions: [
      'Ensure automatic bond assignment is active during molecule construction.',
      'Confirm energy convergence criteria before reading optimized bond angles.'
    ],
    thingsToObserve: 'Dramatic angle collapse from 104.5° down to near 90° as central atom changes from O to S to Se.',
    utility: 'Fundamental to understanding hydrogen bonding in water (anomalous boiling point, density maximum at 4°C) vs toxic volatile heavier hydrides.',
    targetSmiles: 'O',
    compoundName: 'Water (H2O) & Chalcogen Dihydrides'
  },
  {
    id: 'exp-9',
    num: '09',
    title: 'Molecular Modeling, Geometry Optimization and Electron Density Distribution',
    category: 'Quantum Chemistry & Conformational Analysis',
    manualPage: 'Pages 26–27',
    aim: 'To perform 3D molecular modeling, potential energy surface geometry optimization, Self-Consistent Field (SCF) energy determination, and electron density mapping of Ethylene, Butane, and Benzene using computational techniques.',
    reagents: [
      'Computational Chemistry Modeling Suite (ArgusLab / HomoLumo Studio)',
      'Molecular topology datasets for alkene, aliphatic, and aromatic hydrocarbons'
    ],
    apparatus: [
      'HomoLumo 3D CAD Viewport with Blender PBR Shading',
      'Geometry Optimizer Engine',
      'Topology & Electron Density Inspector'
    ],
    principle: 'Molecular modeling utilizes classical molecular mechanics force fields and quantum Hartree-Fock / DFT methods to explore the Potential Energy Surface (PES) and locate global minimum energy conformations: Ethylene (C2H4) adopts a rigid planar sp² framework with localized π-electron density above and below the C=C double bond; Butane (C4H10) undergoes rotation around C2-C3 σ-bond, where anti-periplanar (180°) is the global minimum compared to higher-energy gauche (60°) and eclipsed (0°) conformers; Benzene (C6H6) forms a planar D6h hexagonal ring with completely delocalized aromatic π-electron clouds and equalized C-C bond lengths (1.399 Å).',
    reactions: [
      'Ethylene: Planar sp² hybrid, localized π-bond, ∠H-C-H = 117.4°',
      'Butane: sp³ tetrahedral conformers: Anti (180°) < Gauche (60°) < Eclipsed (0°)',
      'Benzene: D6h symmetric aromatic resonance, equalized C-C = 1.399 Å, 6 delocalized π electrons'
    ],
    procedure: [
      '1. Launch HomoLumo 3D Studio.',
      '2. Build Ethylene (C2H4) using double bond connector; verify planar sp² geometry.',
      '3. Build Butane (C4H10); measure dihedral angle ∠C1-C2-C3-C4 and compare anti vs gauche conformer energies.',
      '4. Build Benzene (C6H6); clean geometry and verify planar hexagonal ring topology.',
      '5. Run Geometry Optimization to obtain converged SCF ground state electronic energies.',
      '6. Inspect 3D electron cloud distribution and verify aromatic delocalization.'
    ],
    observations: [
      'Ethylene: Planar geometry, 5 bonds, localized π-electron density.',
      'Butane: Anti-conformation exhibits minimum torsional strain at 180° dihedral angle.',
      'Benzene: Planar ring with 12 equalized bonds, fully delocalized toroidal electron density.'
    ],
    formulae: 'SCF Electronic Ground State Energy: E_total = E_nuclear + E_electronic (Hartree / kcal/mol)\nBond Topology: Bond counts, lengths, valence angles, and dihedral angles.',
    precautions: [
      'Avoid trapped local energy minima by cleaning 3D geometry prior to full optimization.',
      'Confirm complete molecular symmetry (D6h for benzene) post-optimization.'
    ],
    thingsToObserve: 'Planar aromatic delocalization in Benzene vs flexible conformational rotation in Butane.',
    utility: 'Essential for rational drug design, pharmacophore screening, predicting electrophilic aromatic reactivity, and polymer engineering.',
    targetSmiles: 'c1ccccc1',
    compoundName: 'Benzene (C6H6) / Ethylene / Butane'
  },
  {
    id: 'exp-10',
    num: '10',
    title: 'Computational Visualization of HOMO and LUMO Energy Levels (Mini Project)',
    category: 'Frontier Molecular Orbital (FMO) Theory & Volumetric 3D Isosurface',
    manualPage: 'Page 28 & Syllabus Item 13 & 15',
    aim: 'To calculate, visualize, and analyze the Frontier Molecular Orbitals (HOMO & LUMO), bandgap energy (ΔE), Pearson chemical hardness, and 3D wave-function electron lobes of conjugated and aromatic molecules using computational quantum chemistry techniques (Compulsory Mini Project).',
    reagents: [
      'HomoLumo Quantum Volumetric Visualizer',
      'Marching Cubes 3D Isosurface Engine',
      'Conjugated and Aromatic Test Molecules (Benzene, Phenol, Pyridine, 1,3-Butadiene)'
    ],
    apparatus: [
      'HomoLumo Studio Quantum Calculation Console',
      '3D Orbitals Viewport',
      'Isosurface Threshold Controller'
    ],
    principle: 'Frontier Molecular Orbital (FMO) theory (Fukui) explains that chemical reactivity, electronic transitions, and charge transfer are governed by the frontier orbitals: HOMO (Highest Occupied Molecular Orbital) represents electron-donating nucleophilic capacity, while LUMO (Lowest Unoccupied Molecular Orbital) represents electron-accepting electrophilic capacity. The energy gap ΔE = E_LUMO - E_HOMO governs optical excitation wavelength (λ = 1240 / ΔE nm), electrical conductivity, and chemical stability. Large HOMO-LUMO gap indicates high kinetic stability and chemical hardness (Pearson HSAB theory), while a narrow gap denotes high reactivity.',
    reactions: [
      'HOMO ⟶ LUMO Optical Transition: ΔE = E_LUMO - E_HOMO (eV)',
      'Chemical Hardness: η = (E_LUMO - E_HOMO) / 2',
      'Chemical Softness: S = 1 / (2η)',
      'Electronegativity: χ = -(E_HOMO + E_LUMO) / 2'
    ],
    procedure: [
      '1. In HomoLumo Studio, load aromatic/conjugated test molecule (Benzene, Phenol, or 1,3-Butadiene).',
      '2. Execute Quantum Energy Calculation to solve for frontier orbital eigenvalues.',
      '3. Toggle HOMO 3D Isosurface to observe positive phase (blue) and negative phase (red) wave-function lobes.',
      '4. Toggle LUMO 3D Isosurface to observe nodal planes and orbital phase inversions.',
      '5. Adjust isovalue threshold (0.02 - 0.05) and transparency to inspect spatial electron distribution.',
      '6. Calculate Pearson hardness (η), chemical softness (S), and UV-Vis absorption wavelength.'
    ],
    observations: [
      'Benzene HOMO Energy: ~ -9.24 eV; LUMO Energy: ~ 0.40 eV; Bandgap ΔE ≈ 9.64 eV (hard molecule).',
      'Nodal Planes: Notice the increase in nodal planes from HOMO to LUMO.'
    ],
    formulae: 'Bandgap: ΔE = E_LUMO - E_HOMO (eV)\nChemical Hardness (η) = (E_LUMO - E_HOMO) / 2\nChemical Softness (S) = 1 / (2η)\nAbsorption Wavelength: λ = 1240 / ΔE nm',
    precautions: [
      'Select appropriate isovalue to prevent orbital clipping or noisy lobe artifacts.',
      'Ensure molecule geometry is fully optimized before orbital calculation.'
    ],
    thingsToObserve: 'Phase inversion across nodal planes; spatial concentration of LUMO on electron-deficient centers vs HOMO on electron-rich π-systems.',
    utility: 'Core computational tool for designing organic solar cells, OLED emitters, conducting polymers, and predicting Diels-Alder pericyclic reaction stereochemistry.',
    targetSmiles: 'c1ccccc1',
    compoundName: 'Benzene (HOMO-LUMO Reference)'
  }
];
