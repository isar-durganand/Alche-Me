import { describe, it, expect } from 'vitest';
import { 
  calculateDistance, 
  calculateAngle, 
  calculateAngleDetails,
  calculateHillFormula, 
  calculateMolarMass, 
  validateMoleculeValence, 
  autoSaturateHydrogens, 
  stripAllHydrogens,
  relaxVseprForces 
} from '../src/features/molecule-studio/vseprPhysics';
import { FRAGMENT_TEMPLATES, insertFragment } from '../src/features/molecule-studio/fragmentTemplates';
import { parseSmiles, generateSmiles, parseXyz, exportToXyz, exportToMolfile } from '../src/features/molecule-studio/smilesEngine';
import { MOLECULE_CHALLENGES, validateChallengeCompletion } from '../src/features/molecule-studio/moleculeChallenges';
import { CURATED_MOLECULES } from '../src/features/molecule-studio/moleculeData';
import { AtomNode, BondEdge, ELEMENT_REGISTRY, getElementData } from '../src/features/molecule-studio/types';
import { convert2DTo3D, convert3DTo2D } from '../src/features/molecule-studio/sketcher3dBridge';

describe('Alche-Me — 3D Molecule Studio & VSEPR Physics Engine', () => {
  it('should accurately calculate Euclidean distances in 3D Ångströms', () => {
    const p1 = { x: 0, y: 0, z: 0 };
    const p2 = { x: 1, y: 1, z: 1 };
    expect(calculateDistance(p1, p2)).toBeCloseTo(Math.sqrt(3), 4);

    const a1 = { x: -0.757, y: -0.469, z: 0 };
    const a2 = { x: 0.757, y: -0.469, z: 0 };
    expect(calculateDistance(a1, a2)).toBeCloseTo(1.514, 3);
  });

  it('should accurately calculate VSEPR bond angles via dot product', () => {
    // 90 degree perpendicular vectors
    const arm1 = { x: 1, y: 0, z: 0 };
    const center = { x: 0, y: 0, z: 0 };
    const arm2 = { x: 0, y: 1, z: 0 };
    expect(calculateAngle(arm1, center, arm2)).toBeCloseTo(90.0, 1);

    // 180 degree linear vectors
    const lin1 = { x: -1.16, y: 0, z: 0 };
    const lin2 = { x: 1.16, y: 0, z: 0 };
    expect(calculateAngle(lin1, center, lin2)).toBeCloseTo(180.0, 1);

    // Water H-O-H angle in CURATED_MOLECULES
    const water = CURATED_MOLECULES.find((m) => m.id === 'water' || m.id === 'h2o')!;
    const h1 = water.atoms.find((a) => a.symbol === 'H')!;
    const o = water.atoms.find((a) => a.symbol === 'O')!;
    const h2 = water.atoms.filter((a) => a.symbol === 'H')[1]!;
    const angle = calculateAngle(h1, o, h2);
    expect(angle).toBeGreaterThan(104.0);
    expect(angle).toBeLessThan(105.0);
  });

  it('should format chemical formulas strictly according to the Hill System', () => {
    // Water: H first (no Carbon) -> H₂O
    expect(calculateHillFormula([{ symbol: 'H' }, { symbol: 'H' }, { symbol: 'O' }])).toBe('H₂O');

    // Methane: Carbon first, then Hydrogen -> CH₄
    expect(
      calculateHillFormula([
        { symbol: 'H' }, { symbol: 'C' }, { symbol: 'H' }, { symbol: 'H' }, { symbol: 'H' }
      ])
    ).toBe('CH₄');

    // Ethanol: C₂H₆O
    expect(
      calculateHillFormula([
        { symbol: 'C' }, { symbol: 'C' },
        { symbol: 'H' }, { symbol: 'H' }, { symbol: 'H' }, { symbol: 'H' }, { symbol: 'H' }, { symbol: 'H' },
        { symbol: 'O' }
      ])
    ).toBe('C₂H₆O');
  });

  it('should calculate accurate molar masses from IUPAC standard atomic weights', () => {
    // Water H2O = 2*1.008 + 15.999 = 18.015
    const waterMass = calculateMolarMass([{ symbol: 'H' }, { symbol: 'H' }, { symbol: 'O' }]);
    expect(waterMass).toBeCloseTo(18.015, 2);

    // Carbon Dioxide CO2 = 12.011 + 2*15.999 = 44.009
    const co2Mass = calculateMolarMass([{ symbol: 'C' }, { symbol: 'O' }, { symbol: 'O' }]);
    expect(co2Mass).toBeCloseTo(44.01, 2);
  });

  it('should validate octet rules and flag hypervalent valence violations', () => {
    // Valid Methane
    const ch4Atoms: AtomNode[] = [
      { id: 'c', index: 0, symbol: 'C', x: 0, y: 0, z: 0 },
      { id: 'h1', index: 1, symbol: 'H', x: 1, y: 0, z: 0 },
      { id: 'h2', index: 2, symbol: 'H', x: -1, y: 0, z: 0 },
      { id: 'h3', index: 3, symbol: 'H', x: 0, y: 1, z: 0 },
      { id: 'h4', index: 4, symbol: 'H', x: 0, y: -1, z: 0 },
    ];
    const ch4Bonds: BondEdge[] = [
      { id: 'b1', from: 'c', to: 'h1', order: 1 },
      { id: 'b2', from: 'c', to: 'h2', order: 1 },
      { id: 'b3', from: 'c', to: 'h3', order: 1 },
      { id: 'b4', from: 'c', to: 'h4', order: 1 },
    ];
    const validRes = validateMoleculeValence(ch4Atoms, ch4Bonds);
    expect(validRes.isValid).toBe(true);
    expect(validRes.warnings.length).toBe(0);

    // Hypervalent Carbon (5 bonds - illegal Texas Carbon)
    const texasCarbonBonds: BondEdge[] = [
      ...ch4Bonds,
      { id: 'b5', from: 'c', to: 'h4', order: 1 }, // 5th bond
    ];
    const invalidRes = validateMoleculeValence(ch4Atoms, texasCarbonBonds);
    expect(invalidRes.isValid).toBe(false);
    expect(invalidRes.warnings.some((w) => w.includes('Octet violation'))).toBe(true);
  });

  it('should automatically saturate hydrogen valences for isolated and bonded atoms', () => {
    const isolatedCarbon: AtomNode[] = [{ id: 'c', index: 0, symbol: 'C', x: 0, y: 0, z: 0 }];
    const res = autoSaturateHydrogens(isolatedCarbon, []);
    expect(res.addedCount).toBe(4);
    expect(res.updatedAtoms.length).toBe(5);
    expect(res.updatedBonds.length).toBe(4);
  });

  it('should strip all hydrogen atoms to reveal clean skeletal framework', () => {
    const ethanol: AtomNode[] = [
      { id: 'c1', index: 0, symbol: 'C', x: 0, y: 0, z: 0 },
      { id: 'c2', index: 1, symbol: 'C', x: 1.5, y: 0, z: 0 },
      { id: 'o1', index: 2, symbol: 'O', x: 2.2, y: 1.2, z: 0 },
      { id: 'h1', index: 3, symbol: 'H', x: -0.5, y: 0, z: 0 },
      { id: 'h2', index: 4, symbol: 'H', x: 0, y: 1.0, z: 0 },
      { id: 'h3', index: 5, symbol: 'H', x: 0, y: -1.0, z: 0 },
    ];
    const bonds: BondEdge[] = [
      { id: 'b1', from: 'c1', to: 'c2', order: 1 },
      { id: 'b2', from: 'c2', to: 'o1', order: 1 },
      { id: 'b3', from: 'c1', to: 'h1', order: 1 },
      { id: 'b4', from: 'c1', to: 'h2', order: 1 },
      { id: 'b5', from: 'c1', to: 'h3', order: 1 },
    ];
    const stripped = stripAllHydrogens(ethanol, bonds);
    expect(stripped.removedCount).toBe(3);
    expect(stripped.updatedAtoms.length).toBe(3);
    expect(stripped.updatedAtoms.every((a) => a.symbol !== 'H')).toBe(true);
    expect(stripped.updatedBonds.length).toBe(2);
  });

  it('should insert fragment templates and attach to host atoms accurately', () => {
    expect(FRAGMENT_TEMPLATES.length).toBeGreaterThanOrEqual(10);
    const benzene = FRAGMENT_TEMPLATES.find((t) => t.id === 'benzene')!;
    expect(benzene).toBeDefined();
    expect(benzene.atoms.length).toBe(12); // 6 C + 6 H
    expect(benzene.bonds.length).toBe(12);

    const baseCarbon: AtomNode[] = [{ id: 'host-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 }];
    const attached = insertFragment(baseCarbon, [], benzene, 0);
    expect(attached.newAtoms.length).toBe(13); // 1 host + 12 benzene
    expect(attached.newBonds.length).toBe(13); // 12 benzene + 1 link bond
    expect(attached.newBonds.some((b) => b.from === 'host-0')).toBe(true);
  });

  it('should parse and generate SMILES strings for organic structures', () => {
    // Ethanol CCO
    const parsedEthanol = parseSmiles('CCO');
    expect(parsedEthanol.atoms.length).toBeGreaterThan(0);
    const heavyAtoms = parsedEthanol.atoms.filter((a) => a.symbol !== 'H');
    expect(heavyAtoms.length).toBe(3);
    expect(heavyAtoms.map((a) => a.symbol).sort()).toEqual(['C', 'C', 'O']);

    // Benzene aromatic ring c1ccccc1
    const parsedBenzene = parseSmiles('c1ccccc1');
    const bHeavy = parsedBenzene.atoms.filter((a) => a.symbol !== 'H');
    expect(bHeavy.length).toBe(6);

    // SMILES generator
    const smi = generateSmiles(parsedEthanol.atoms, parsedEthanol.bonds);
    expect(smi).toBeTruthy();
    expect(smi.includes('C')).toBe(true);
    expect(smi.includes('O')).toBe(true);
  });

  it('should support XYZ and MDL Molfile export formats matching standard CAD specifications', () => {
    const testAtoms: AtomNode[] = [
      { id: 'c1', index: 0, symbol: 'C', x: 0.0, y: 0.0, z: 0.0 },
      { id: 'o1', index: 1, symbol: 'O', x: 1.2, y: 0.0, z: 0.0 },
    ];
    const testBonds: BondEdge[] = [{ id: 'b1', from: 'c1', to: 'o1', order: 2 }];

    // XYZ format
    const xyz = exportToXyz(testAtoms, 'Carbon monoxide test');
    expect(xyz.startsWith('2\nCarbon monoxide test')).toBe(true);
    const parsedXyz = parseXyz(xyz);
    expect(parsedXyz.atoms.length).toBe(2);
    expect(parsedXyz.atoms[0].symbol).toBe('C');
    expect(parsedXyz.atoms[1].symbol).toBe('O');

    // Molfile V2000
    const molfile = exportToMolfile(testAtoms, testBonds, 'Carbon monoxide');
    expect(molfile.includes('V2000')).toBe(true);
    expect(molfile.includes('M  END')).toBe(true);
  });

  it('should relax 3D coordinates via VSEPR force-field physics without generating NaNs', () => {
    const unrelaxed: AtomNode[] = [
      { id: 'c1', index: 0, symbol: 'C', x: 0, y: 0, z: 0 },
      { id: 'c2', index: 1, symbol: 'C', x: 0.1, y: 0.1, z: 0 }, // Unnaturally squished
    ];
    const bonds: BondEdge[] = [{ id: 'b1', from: 'c1', to: 'c2', order: 1 }];

    const relaxed = relaxVseprForces(unrelaxed, bonds, 40);
    expect(relaxed.length).toBe(2);

    const dist = calculateDistance(relaxed[0], relaxed[1]);
    expect(isNaN(dist)).toBe(false);
    expect(dist).toBeGreaterThan(1.0); // Expanded toward equilibrium covalent distance
  });

  it('should verify dataset integrity across all curated molecules', () => {
    expect(CURATED_MOLECULES.length).toBeGreaterThanOrEqual(15);

    for (const mol of CURATED_MOLECULES) {
      expect(mol.id).toBeTruthy();
      expect(mol.name).toBeTruthy();
      expect(mol.formula).toBeTruthy();
      expect(mol.geometry).toBeTruthy();
      expect(mol.molarMass).toBeGreaterThan(0);
      expect(mol.atoms.length).toBeGreaterThan(0);
      expect(mol.bonds.length).toBeGreaterThan(0);

      // Verify each atom has registered symbol and coordinates
      for (const a of mol.atoms) {
        expect(ELEMENT_REGISTRY[a.symbol]).toBeDefined();
        expect(isNaN(a.x)).toBe(false);
        expect(isNaN(a.y)).toBe(false);
        expect(isNaN(a.z)).toBe(false);
      }
    }
  });

  it('should calculate angle details and bisector vectors for on-canvas label placement', () => {
    const a1 = { x: 0.0, y: 0.7572, z: -0.4692 };
    const center = { x: 0.0, y: 0.0, z: 0.1173 };
    const a2 = { x: 0.0, y: -0.7572, z: -0.4692 };

    const details = calculateAngleDetails(a1, center, a2, 0.75);
    expect(details.angle).toBeCloseTo(104.5, 1);
    expect(isNaN(details.bisector.x)).toBe(false);
    expect(isNaN(details.bisector.y)).toBe(false);
    expect(isNaN(details.bisector.z)).toBe(false);
    expect(isNaN(details.labelPosition.x)).toBe(false);
    expect(isNaN(details.labelPosition.y)).toBe(false);
    expect(isNaN(details.labelPosition.z)).toBe(false);
  });

  it('should dynamically resolve any of the 118 periodic table elements', () => {
    // Standard common elements
    const c = getElementData('C');
    expect(c.symbol).toBe('C');
    expect(c.atomicNumber).toBe(6);

    // Precious metal Gold (Au, Z=79)
    const au = getElementData('Au');
    expect(au.symbol).toBe('Au');
    expect(au.atomicNumber).toBe(79);
    expect(au.covalentRadius).toBeGreaterThan(1.0);

    // Actinide Uranium (U, Z=92)
    const u = getElementData('U');
    expect(u.symbol).toBe('U');
    expect(u.atomicNumber).toBe(92);

    // Superheavy element Oganesson (Og, Z=118)
    const og = getElementData('Og');
    expect(og.symbol).toBe('Og');
    expect(og.atomicNumber).toBe(118);
  });

  it('should validate curriculum challenge completion for game levels', () => {
    expect(MOLECULE_CHALLENGES.length).toBeGreaterThanOrEqual(6);
    const waterChallenge = MOLECULE_CHALLENGES.find((c) => c.id === 'challenge-water')!;
    expect(waterChallenge).toBeDefined();

    const studentWaterAtoms: AtomNode[] = [
      { id: 'o', index: 0, symbol: 'O', x: 0.0, y: 0.0, z: 0.1173 },
      { id: 'h1', index: 1, symbol: 'H', x: 0.0, y: 0.7572, z: -0.4692 },
      { id: 'h2', index: 2, symbol: 'H', x: 0.0, y: -0.7572, z: -0.4692 },
    ];
    const studentWaterBonds: BondEdge[] = [
      { id: 'b1', from: 'o', to: 'h1', order: 1 },
      { id: 'b2', from: 'o', to: 'h2', order: 1 },
    ];

    // Case 1: Incomplete (No angle measurement yet)
    const incompleteRes = validateChallengeCompletion(
      studentWaterAtoms,
      studentWaterBonds,
      [],
      waterChallenge
    );
    expect(incompleteRes.isFormulaMatch).toBe(true);
    expect(incompleteRes.isAngleMeasured).toBe(false);
    expect(incompleteRes.isComplete).toBe(false);

    // Case 2: Complete with valid measured angle (104.5°)
    const completeRes = validateChallengeCompletion(
      studentWaterAtoms,
      studentWaterBonds,
      [
        {
          id: 'm1',
          type: 'angle',
          atomIndices: [1, 0, 2],
          atomSymbols: ['H', 'O', 'H'],
          value: 104.5,
          unit: '°',
          label: 'H1—O1—H2',
        },
      ],
      waterChallenge
    );
    expect(completeRes.isFormulaMatch).toBe(true);
    expect(completeRes.isAngleMeasured).toBe(true);
    expect(completeRes.isComplete).toBe(true);

    // Case 3: CO2 challenge requiring double bonds
    const co2Challenge = MOLECULE_CHALLENGES.find((c) => c.id === 'challenge-co2')!;
    const singleBondedCO2: BondEdge[] = [
      { id: 'b1', from: 'c', to: 'o1', order: 1 }, // single bond instead of double!
      { id: 'b2', from: 'c', to: 'o2', order: 1 },
    ];
    const co2Atoms: AtomNode[] = [
      { id: 'c', index: 0, symbol: 'C', x: 0, y: 0, z: 0 },
      { id: 'o1', index: 1, symbol: 'O', x: -1.16, y: 0, z: 0 },
      { id: 'o2', index: 2, symbol: 'O', x: 1.16, y: 0, z: 0 },
    ];
    const co2FailRes = validateChallengeCompletion(
      co2Atoms,
      singleBondedCO2,
      [{ id: 'm1', type: 'angle', atomIndices: [1, 0, 2], atomSymbols: ['O', 'C', 'O'], value: 180, unit: '°', label: 'Angle' }],
      co2Challenge
    );
    expect(co2FailRes.isBondsMatch).toBe(false);
    expect(co2FailRes.isComplete).toBe(false);
  });

  it('should seamlessly convert 2D skeletal sketcher graph to 3D VSEPR structure', () => {
    const atoms2D = [
      { id: 'c1', symbol: 'C', x: 200, y: 200 },
      { id: 'c2', symbol: 'C', x: 240, y: 200 },
    ];
    const bonds2D = [
      { id: 'b1', from: 'c1', to: 'c2', order: 1 as const },
    ];

    const res3D = convert2DTo3D(atoms2D, bonds2D, true);
    // Should auto-saturate with Hydrogens (Ethane C2H6)
    expect(res3D.formula).toBe('C₂H₆');
    expect(res3D.atoms.length).toBe(8); // 2 Carbons + 6 Hydrogens
    expect(res3D.rawMolfile).toContain('M  END');

    // Convert back from 3D to 2D
    const res2D = convert3DTo2D(res3D.atoms, res3D.bonds);
    // Heavy atoms preserved (C1 and C2)
    expect(res2D.atoms.length).toBe(2);
    expect(res2D.bonds.length).toBe(1);
  });

  it('should include Phenanthrene benchmark structure matching MolView standard', () => {
    const phenanthrene = CURATED_MOLECULES.find((m) => m.id === 'phenanthrene');
    expect(phenanthrene).toBeDefined();
    expect(phenanthrene?.formula).toBe('C₁₄H₁₀');
    expect(phenanthrene?.atoms.length).toBe(24);
  });
});
