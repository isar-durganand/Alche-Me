/**
 * Alche-Me — 2D Chemical Sketcher to 3D Molecular Graphics Bridge
 * Converts 2D planar graph (ChemDraw/MolView) to 3D Cartesian coordinates with
 * VSEPR force-field relaxation, stereochemical embedding, and MDL V2000 Molfile generation.
 */

import { Atom2D, Bond2D } from './types2d';
import { AtomNode, BondEdge, getElementData } from './types';
import { exportToMolfile, exportToXyz } from './smilesEngine';
import { relaxVseprForces, autoSaturateHydrogens, calculateHillFormula } from './vseprPhysics';

const BOND_LENGTH_ANGSTROMS = 1.45; // Standard C-C / C-N bond length in Å
const STANDARD_2D_BOND_PX = 42.0;    // Standard 2D bond length in pixels

/**
 * Converts 2D sketcher atoms and bonds into fully realized 3D coordinates with VSEPR geometry
 */
export function convert2DTo3D(
  atoms2D: Atom2D[],
  bonds2D: Bond2D[],
  autoH: boolean = true
): {
  atoms: AtomNode[];
  bonds: BondEdge[];
  rawMolfile: string;
  rawXyz: string;
  formula: string;
} {
  if (atoms2D.length === 0) {
    return {
      atoms: [],
      bonds: [],
      rawMolfile: '',
      rawXyz: '0\n\n',
      formula: 'Ø',
    };
  }

  // Calculate center of 2D bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const a of atoms2D) {
    if (a.x < minX) minX = a.x;
    if (a.x > maxX) maxX = a.x;
    if (a.y < minY) minY = a.y;
    if (a.y > maxY) maxY = a.y;
  }
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  // Calculate scale factor from 2D pixel distances to 3D Angstroms
  let scale = BOND_LENGTH_ANGSTROMS / STANDARD_2D_BOND_PX;
  if (bonds2D.length > 0) {
    let totalDist = 0;
    let count = 0;
    for (const b of bonds2D) {
      const a1 = atoms2D.find((a) => a.id === b.from);
      const a2 = atoms2D.find((a) => a.id === b.to);
      if (a1 && a2) {
        const d = Math.hypot(a1.x - a2.x, a1.y - a2.y);
        if (d > 5) {
          totalDist += d;
          count++;
        }
      }
    }
    if (count > 0) {
      const avgPx = totalDist / count;
      scale = BOND_LENGTH_ANGSTROMS / Math.max(20, avgPx);
    }
  }

  // Initial 3D mapping with slight z-displacement for sp3 puckering
  const initialAtoms: AtomNode[] = atoms2D.map((a, idx) => {
    // Invert Y so upward in 2D is positive Y in 3D
    const x = Math.round((a.x - midX) * scale * 1000) / 1000;
    const y = Math.round(-(a.y - midY) * scale * 1000) / 1000;
    
    // Check degree: If connected to >2 single bonds, add small alternating z to seed tetrahedral folding
    const connBonds = bonds2D.filter((b) => b.from === a.id || b.to === a.id);
    const hasDoubleOrTriple = connBonds.some((b) => b.order >= 2);
    let z = 0;
    if (!hasDoubleOrTriple && connBonds.length >= 3) {
      z = (idx % 2 === 0 ? 0.35 : -0.35);
    }

    return {
      id: a.id,
      index: idx,
      symbol: a.symbol,
      x,
      y,
      z,
    };
  });

  const initialBonds: BondEdge[] = bonds2D.map((b, idx) => ({
    id: b.id || `b3d-${idx}`,
    from: b.from,
    to: b.to,
    order: b.order,
  }));

  // Auto-saturate Hydrogens if requested
  let atomsWithH = initialAtoms;
  let bondsWithH = initialBonds;

  if (autoH) {
    const saturated = autoSaturateHydrogens(initialAtoms, initialBonds);
    atomsWithH = saturated.updatedAtoms;
    bondsWithH = saturated.updatedBonds;
  }

  // Relax using VSEPR force-field (60 passes)
  const relaxedAtoms = relaxVseprForces(atomsWithH, bondsWithH, 60);

  // Generate V2000 Molfile (SDF) and XYZ strings
  const rawMolfile = exportToMolfile(relaxedAtoms, bondsWithH);
  const rawXyz = exportToXyz(relaxedAtoms);
  const formula = calculateHillFormula(relaxedAtoms);

  return {
    atoms: relaxedAtoms,
    bonds: bondsWithH,
    rawMolfile,
    rawXyz,
    formula,
  };
}

/**
 * Projects a 3D molecule onto a 2D plane for the chemical sketcher
 */
export function convert3DTo2D(
  atoms3D: AtomNode[],
  bonds3D: BondEdge[],
  targetCanvasWidth: number = 600,
  targetCanvasHeight: number = 600
): {
  atoms: Atom2D[];
  bonds: Bond2D[];
} {
  if (atoms3D.length === 0) {
    return { atoms: [], bonds: [] };
  }

  // Filter out explicit Hydrogens if attached to heavy atoms (standard 2D skeletal representation)
  // Keep hydrogens only if isolated or essential (e.g. water H-O-H, methane CH4)
  const heavyCount = atoms3D.filter((a) => a.symbol !== 'H').length;
  let visible3DAtoms = atoms3D;
  let visible3DBonds = bonds3D;

  if (heavyCount >= 2) {
    visible3DAtoms = atoms3D.filter((a) => a.symbol !== 'H');
    const validIds = new Set(visible3DAtoms.map((a) => a.id));
    visible3DBonds = bonds3D.filter((b) => validIds.has(String(b.from)) && validIds.has(String(b.to)));
  }

  // Find 3D bounding box in XY plane
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const a of visible3DAtoms) {
    if (a.x < minX) minX = a.x;
    if (a.x > maxX) maxX = a.x;
    if (a.y < minY) minY = a.y;
    if (a.y > maxY) maxY = a.y;
  }
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  const spanX = Math.max(2.0, maxX - minX);
  const spanY = Math.max(2.0, maxY - minY);
  const fitScale = Math.min(
    (targetCanvasWidth * 0.6) / spanX,
    (targetCanvasHeight * 0.6) / spanY,
    STANDARD_2D_BOND_PX / BOND_LENGTH_ANGSTROMS
  );

  const canvasCenterX = targetCanvasWidth / 2;
  const canvasCenterY = targetCanvasHeight / 2;

  const atoms2D: Atom2D[] = visible3DAtoms.map((a) => ({
    id: a.id,
    symbol: a.symbol,
    x: Math.round(canvasCenterX + (a.x - midX) * fitScale),
    y: Math.round(canvasCenterY - (a.y - midY) * fitScale), // invert Y back to 2D screen coords
  }));

  const bonds2D: Bond2D[] = visible3DBonds.map((b) => ({
    id: b.id,
    from: String(b.from),
    to: String(b.to),
    order: b.order,
  }));

  return { atoms: atoms2D, bonds: bonds2D };
}
