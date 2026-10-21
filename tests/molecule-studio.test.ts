import { describe, it, expect } from 'vitest';
import { 
  calculateDistance, 
  calculateAngle, 
  calculateHillFormula, 
  calculateMolarMass, 
  validateMoleculeValence, 
  autoSaturateHydrogens, 
  relaxVseprForces 
} from '../src/features/molecule-studio/vseprPhysics';
import { CURATED_MOLECULES } from '../src/features/molecule-studio/moleculeData';
import { AtomNode, BondEdge, ELEMENT_REGISTRY } from '../src/features/molecule-studio/types';

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
});
