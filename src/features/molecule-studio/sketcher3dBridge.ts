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

function resolveAtomId(ref: string | number, atoms: AtomNode[]): string {
  const str = String(ref);
  const byId = atoms.find((a) => a.id === str);
  if (byId) return byId.id;
  const num = Number(ref);
  if (!isNaN(num)) {
    const byIndex = atoms.find((a) => a.index === num) || atoms[num];
    if (byIndex) return byIndex.id;
  }
  return str;
}

/**
 * Projects a 3D molecule onto a 2D plane for the chemical sketcher.
 * Uses principal dispersion plane (XY, YZ, or XZ) to preserve true geometry.
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

  // In standard chemical skeletal drawings, hydrogens attached to carbons are implicit.
  // Hydrogens attached to heteroatoms (e.g. O-H in water/alcohols, N-H in amines) are preserved.
  const carbonIds = new Set(atoms3D.filter((a) => a.symbol === 'C').map((a) => a.id));
  const bondsWithCarbon = new Set(
    bonds3D
      .filter((b) => carbonIds.has(resolveAtomId(b.from, atoms3D)) || carbonIds.has(resolveAtomId(b.to, atoms3D)))
      .flatMap((b) => [resolveAtomId(b.from, atoms3D), resolveAtomId(b.to, atoms3D)])
  );

  let visible3DAtoms = atoms3D;
  if (carbonIds.size >= 1) {
    // Only omit H if attached to a Carbon atom
    visible3DAtoms = atoms3D.filter((a) => !(a.symbol === 'H' && bondsWithCarbon.has(a.id)));
  }

  // Determine principal projection plane (XY, YZ, or XZ) that maximizes spatial dispersion
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (const a of visible3DAtoms) {
    if (a.x < minX) minX = a.x;
    if (a.x > maxX) maxX = a.x;
    if (a.y < minY) minY = a.y;
    if (a.y > maxY) maxY = a.y;
    if (a.z < minZ) minZ = a.z;
    if (a.z > maxZ) maxZ = a.z;
  }

  const spanX = Math.max(0.01, maxX - minX);
  const spanY = Math.max(0.01, maxY - minY);
  const spanZ = Math.max(0.01, maxZ - minZ);

  const areaXY = spanX * spanY;
  const areaYZ = spanY * spanZ;
  const areaXZ = spanX * spanZ;

  let uCoord: (a: AtomNode) => number = (a) => a.x;
  let vCoord: (a: AtomNode) => number = (a) => a.y;
  let spanU = spanX, spanV = spanY;
  let midU = (minX + maxX) / 2, midV = (minY + maxY) / 2;

  if (areaYZ >= areaXY && areaYZ >= areaXZ) {
    uCoord = (a) => a.y;
    vCoord = (a) => a.z;
    spanU = spanY;
    spanV = spanZ;
    midU = (minY + maxY) / 2;
    midV = (minZ + maxZ) / 2;
  } else if (areaXZ >= areaXY && areaXZ >= areaYZ) {
    uCoord = (a) => a.x;
    vCoord = (a) => a.z;
    spanU = spanX;
    spanV = spanZ;
    midU = (minX + maxX) / 2;
    midV = (minZ + maxZ) / 2;
  }

  const fitScale = Math.min(
    (targetCanvasWidth * 0.6) / Math.max(1.8, spanU),
    (targetCanvasHeight * 0.6) / Math.max(1.8, spanV),
    STANDARD_2D_BOND_PX / BOND_LENGTH_ANGSTROMS
  );

  const canvasCenterX = targetCanvasWidth / 2;
  const canvasCenterY = targetCanvasHeight / 2;

  const atoms2D: Atom2D[] = visible3DAtoms.map((a) => ({
    id: a.id,
    symbol: a.symbol,
    x: Math.round(canvasCenterX + (uCoord(a) - midU) * fitScale),
    y: Math.round(canvasCenterY - (vCoord(a) - midV) * fitScale), // invert V back to 2D screen coords
  }));

  const validAtomIds = new Set(atoms2D.map((a) => a.id));

  const bonds2D: Bond2D[] = bonds3D
    .map((b) => ({
      id: b.id,
      from: resolveAtomId(b.from, atoms3D),
      to: resolveAtomId(b.to, atoms3D),
      order: b.order,
    }))
    .filter((b) => validAtomIds.has(b.from) && validAtomIds.has(b.to) && b.from !== b.to);

  return { atoms: atoms2D, bonds: bonds2D };
}
