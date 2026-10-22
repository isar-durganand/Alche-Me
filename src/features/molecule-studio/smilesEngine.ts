/**
 * Alche-Me — SMILES, XYZ, & MDL Molfile Interoperability Engine
 * Supports standard chemical data exchange matching MolDraw (moldraw.com) and ArgusLab:
 * - Robust SMILES Parser (linear chains, branching parentheses, ring closures 1-9, aromatic c/n/o, double/triple bonds)
 * - SMILES Generator (graph traversal with branching & cycle detection)
 * - XYZ Parser & Exporter (standard Cartesian Ångströms with auto-bond perception)
 * - MDL Molfile (V2000) Exporter
 */

import { AtomNode, BondEdge, ELEMENT_REGISTRY, ElementSymbol } from './types';
import { relaxVseprForces, autoSaturateHydrogens } from './vseprPhysics';

// ==========================================
// SMILES PARSER
// ==========================================

interface ParsedSmileAtom {
  symbol: ElementSymbol;
  isAromatic: boolean;
  hCount?: number;
  charge?: number;
}

/**
 * Parse a standard SMILES string into 3D atoms and bonds
 */
export function parseSmiles(smilesInput: string): { atoms: AtomNode[]; bonds: BondEdge[] } {
  const smiles = smilesInput.trim();
  if (!smiles) {
    return {
      atoms: [{ id: 'b-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 }],
      bonds: [],
    };
  }

  const atoms: AtomNode[] = [];
  const bonds: BondEdge[] = [];
  const ringClosures: Record<number, { atomId: string; bondOrder: 1 | 2 | 3 }> = {};

  let currentAtomId: string | null = null;
  const branchStack: string[] = [];
  let nextBondOrder: 1 | 2 | 3 = 1;
  let atomCounter = 0;

  let i = 0;
  while (i < smiles.length) {
    const ch = smiles[i];

    // Branching: '(' pushes current atom to stack, ')' pops
    if (ch === '(') {
      if (currentAtomId) branchStack.push(currentAtomId);
      i++;
      continue;
    }
    if (ch === ')') {
      if (branchStack.length > 0) {
        currentAtomId = branchStack.pop() || null;
      }
      i++;
      continue;
    }

    // Explicit Bond Order: '=' for double, '#' for triple, '-' for single
    if (ch === '=') {
      nextBondOrder = 2;
      i++;
      continue;
    }
    if (ch === '#') {
      nextBondOrder = 3;
      i++;
      continue;
    }
    if (ch === '-') {
      nextBondOrder = 1;
      i++;
      continue;
    }

    // Ring Closures (digits 1-9)
    if (ch >= '1' && ch <= '9') {
      const ringNum = parseInt(ch, 10);
      if (currentAtomId) {
        if (ringClosures[ringNum]) {
          // Close ring with bond
          const target = ringClosures[ringNum];
          bonds.push({
            id: `b-ring-${ringNum}-${Date.now()}-${bonds.length}`,
            from: currentAtomId,
            to: target.atomId,
            order: target.bondOrder || nextBondOrder,
          });
          delete ringClosures[ringNum];
        } else {
          // Open ring
          ringClosures[ringNum] = {
            atomId: currentAtomId,
            bondOrder: nextBondOrder,
          };
        }
      }
      nextBondOrder = 1;
      i++;
      continue;
    }

    // Bracketed Atom e.g. [NH4+], [OH-], [Pt]
    if (ch === '[') {
      const closeIdx = smiles.indexOf(']', i);
      if (closeIdx !== -1) {
        const bracketContent = smiles.substring(i + 1, closeIdx);
        // Match element symbol in brackets
        const elMatch = bracketContent.match(/[A-Z][a-z]?/);
        const sym = (elMatch ? elMatch[0] : 'C') as ElementSymbol;

        const newId = `smi-${atomCounter}`;
        // Procedural 3D coordinates along spiral
        const theta = atomCounter * 1.05;
        const radius = 1.45 * Math.sqrt(atomCounter + 1);
        const z = (atomCounter % 3 - 1) * 0.45;

        const newAtom: AtomNode = {
          id: newId,
          index: atomCounter,
          symbol: ELEMENT_REGISTRY[sym] ? sym : 'C',
          x: Math.round(Math.cos(theta) * radius * 1000) / 1000,
          y: Math.round(Math.sin(theta) * radius * 1000) / 1000,
          z: Math.round(z * 1000) / 1000,
        };

        atoms.push(newAtom);

        if (currentAtomId) {
          bonds.push({
            id: `b-smi-${bonds.length}`,
            from: currentAtomId,
            to: newId,
            order: nextBondOrder,
          });
        }

        currentAtomId = newId;
        nextBondOrder = 1;
        atomCounter++;
        i = closeIdx + 1;
        continue;
      }
    }

    // Standard Organic Subset & Aromatic Atoms (B, C, N, O, P, S, F, Cl, Br, I, c, n, o, s, p)
    let sym: ElementSymbol = 'C';
    let isAromatic = false;
    let len = 1;

    // Two-letter halogens: Cl, Br
    if (smiles.substring(i, i + 2) === 'Cl') {
      sym = 'Cl';
      len = 2;
    } else if (smiles.substring(i, i + 2) === 'Br') {
      sym = 'Br';
      len = 2;
    } else if (ch === 'c') {
      sym = 'C';
      isAromatic = true;
    } else if (ch === 'n') {
      sym = 'N';
      isAromatic = true;
    } else if (ch === 'o') {
      sym = 'O';
      isAromatic = true;
    } else if (ch === 's') {
      sym = 'S';
      isAromatic = true;
    } else if (ch === 'p') {
      sym = 'P';
      isAromatic = true;
    } else if (['C', 'N', 'O', 'S', 'P', 'F', 'I', 'B', 'H'].includes(ch)) {
      sym = ch as ElementSymbol;
    } else {
      // Skip unknown character
      i++;
      continue;
    }

    const newId = `smi-${atomCounter}`;
    const theta = atomCounter * 1.15;
    const dist = 1.45 * Math.sqrt(atomCounter + 1);
    const zOffset = (atomCounter % 4 - 1.5) * 0.35;

    const newAtom: AtomNode = {
      id: newId,
      index: atomCounter,
      symbol: sym,
      x: Math.round(Math.cos(theta) * dist * 1000) / 1000,
      y: Math.round(Math.sin(theta) * dist * 1000) / 1000,
      z: Math.round(zOffset * 1000) / 1000,
    };
    atoms.push(newAtom);

    if (currentAtomId) {
      let bOrder = nextBondOrder;
      // In aromatic rings without explicit bonds, alternating single/double or aromatic 1.5
      if (isAromatic && bOrder === 1 && atomCounter % 2 === 1) {
        bOrder = 2;
      }
      bonds.push({
        id: `b-smi-${bonds.length}`,
        from: currentAtomId,
        to: newId,
        order: bOrder,
      });
    }

    currentAtomId = newId;
    nextBondOrder = 1;
    atomCounter++;
    i += len;
  }

  if (atoms.length === 0) {
    return {
      atoms: [{ id: 'b-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 }],
      bonds: [],
    };
  }

  // Auto-saturate hydrogens for complete valence matching desktop software
  const saturated = autoSaturateHydrogens(atoms, bonds);

  // Relax 3D coordinates via VSEPR force-field for natural conformation
  const relaxedAtoms = relaxVseprForces(saturated.updatedAtoms, saturated.updatedBonds, 60);

  return {
    atoms: relaxedAtoms,
    bonds: saturated.updatedBonds,
  };
}

// ==========================================
// SMILES GENERATOR
// ==========================================

export function generateSmiles(atoms: AtomNode[], bonds: BondEdge[]): string {
  if (atoms.length === 0) return '';
  if (atoms.length === 1) return atoms[0].symbol;

  // Filter out explicit Hydrogens to produce standard clean skeletal SMILES
  const heavyAtoms = atoms.filter((a) => a.symbol !== 'H');
  if (heavyAtoms.length === 0) {
    return atoms.map((a) => a.symbol).join('');
  }

  const visited = new Set<string>();
  const ringMap = new Map<string, number>();
  let nextRingNum = 1;

  // Adjacency graph
  const adj: Record<string, { targetId: string; order: 1 | 2 | 3 }[]> = {};
  for (const a of heavyAtoms) adj[a.id] = [];
  for (const b of bonds) {
    const fromHeavy = heavyAtoms.some((a) => a.id === b.from);
    const toHeavy = heavyAtoms.some((a) => a.id === b.to);
    if (fromHeavy && toHeavy) {
      adj[b.from as string]?.push({ targetId: b.to as string, order: b.order });
      adj[b.to as string]?.push({ targetId: b.from as string, order: b.order });
    }
  }

  let result = '';

  const dfs = (atomId: string, parentId: string | null) => {
    visited.add(atomId);
    const atom = atoms.find((a) => a.id === atomId);
    if (!atom) return;

    result += atom.symbol;

    const neighbors = adj[atomId] || [];
    const unvisitedNeighbors: { targetId: string; order: 1 | 2 | 3 }[] = [];

    for (const nb of neighbors) {
      if (nb.targetId === parentId) continue;
      if (visited.has(nb.targetId)) {
        // Back edge (cycle)
        const edgeKey = [atomId, nb.targetId].sort().join('-');
        if (!ringMap.has(edgeKey)) {
          const ringId = nextRingNum++;
          ringMap.set(edgeKey, ringId);
          result += ringId.toString();
        } else {
          result += ringMap.get(edgeKey)!.toString();
        }
      } else {
        unvisitedNeighbors.push(nb);
      }
    }

    for (let idx = 0; idx < unvisitedNeighbors.length; idx++) {
      const nb = unvisitedNeighbors[idx];
      if (visited.has(nb.targetId)) continue;

      const bondChar = nb.order === 2 ? '=' : nb.order === 3 ? '#' : '';
      const isBranch = idx < unvisitedNeighbors.length - 1;

      if (isBranch) result += '(';
      result += bondChar;
      dfs(nb.targetId, atomId);
      if (isBranch) result += ')';
    }
  };

  // Start with first heavy atom
  dfs(heavyAtoms[0].id, null);

  // If disconnected fragments exist, append them with '.'
  for (const a of heavyAtoms) {
    if (!visited.has(a.id)) {
      result += '.';
      dfs(a.id, null);
    }
  }

  return result || atoms[0].symbol;
}

// ==========================================
// XYZ PARSER & EXPORTER
// ==========================================

export function parseXyz(xyzText: string): { atoms: AtomNode[]; bonds: BondEdge[] } {
  const lines = xyzText.trim().split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) {
    return { atoms: [], bonds: [] };
  }

  let startIndex = 0;
  // Check if first line is atom count
  if (/^\d+$/.test(lines[0])) {
    startIndex = 2; // Line 0: count, Line 1: comment/title
  }

  const atoms: AtomNode[] = [];
  let idx = 0;

  for (let i = startIndex; i < lines.length; i++) {
    const parts = lines[i].split(/\s+/);
    if (parts.length >= 4) {
      const sym = parts[0] as ElementSymbol;
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);

      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        atoms.push({
          id: `xyz-${idx}`,
          index: idx,
          symbol: sym,
          x: Math.round(x * 1000) / 1000,
          y: Math.round(y * 1000) / 1000,
          z: Math.round(z * 1000) / 1000,
        });
        idx++;
      }
    }
  }

  // Auto-perceive bonds using covalent radii summation
  const bonds: BondEdge[] = [];
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const a1 = atoms[i];
      const a2 = atoms[j];
      const el1 = ELEMENT_REGISTRY[a1.symbol] || ELEMENT_REGISTRY['C'];
      const el2 = ELEMENT_REGISTRY[a2.symbol] || ELEMENT_REGISTRY['C'];

      const dx = a1.x - a2.x;
      const dy = a1.y - a2.y;
      const dz = a1.z - a2.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const maxBondDist = (el1.covalentRadius + el2.covalentRadius) * 1.25;
      const minBondDist = 0.55;

      if (dist >= minBondDist && dist <= maxBondDist) {
        // Approximate bond order based on distance
        let order: 1 | 2 | 3 = 1;
        if (a1.symbol !== 'H' && a2.symbol !== 'H') {
          const doubleCutoff = (el1.covalentRadius + el2.covalentRadius) * 0.95;
          const tripleCutoff = (el1.covalentRadius + el2.covalentRadius) * 0.85;
          if (dist < tripleCutoff) order = 3;
          else if (dist < doubleCutoff) order = 2;
        }

        bonds.push({
          id: `b-${i}-${j}`,
          from: a1.id,
          to: a2.id,
          order,
        });
      }
    }
  }

  return { atoms, bonds };
}

export function exportToXyz(atoms: AtomNode[], comment: string = 'Exported from Alche-Me 3D Studio'): string {
  const lines = [
    atoms.length.toString(),
    comment,
    ...atoms.map((a) => {
      const sym = a.symbol.padEnd(3);
      const x = a.x.toFixed(4).padStart(11);
      const y = a.y.toFixed(4).padStart(11);
      const z = a.z.toFixed(4).padStart(11);
      return `${sym}${x}${y}${z}`;
    }),
  ];
  return lines.join('\n');
}

// ==========================================
// MDL MOLFILE (V2000) EXPORTER
// ==========================================

export function exportToMolfile(atoms: AtomNode[], bonds: BondEdge[], name: string = 'Molecule'): string {
  const pad = (str: string | number, len: number, right: boolean = false) => {
    const s = str.toString();
    return right ? s.padEnd(len) : s.padStart(len);
  };

  const lines: string[] = [
    name,
    '  Alche-Me 3D Studio    V2000',
    'Standard IUPAC molecular structure',
    // Counts line: aaabbblllfffcccsssxxxrrrpppiiimmmvvvvvv
    `${pad(atoms.length, 3)}${pad(bonds.length, 3)}  0  0  0  0  0  0  0  0999 V2000`,
  ];

  // Atom block
  const atomIdIndexMap = new Map<string, number>();
  atoms.forEach((a, idx) => {
    atomIdIndexMap.set(a.id, idx + 1);
    const x = pad(a.x.toFixed(4), 10);
    const y = pad(a.y.toFixed(4), 10);
    const z = pad(a.z.toFixed(4), 10);
    const sym = pad(a.symbol, 3, true);
    lines.push(`${x}${y}${z} ${sym} 0  0  0  0  0  0  0  0  0  0  0  0`);
  });

  // Bond block: 111222ttt ...
  bonds.forEach((b) => {
    const fromIdx = atomIdIndexMap.get(b.from as string) || 1;
    const toIdx = atomIdIndexMap.get(b.to as string) || 2;
    lines.push(`${pad(fromIdx, 3)}${pad(toIdx, 3)}${pad(b.order, 3)}  0  0  0  0`);
  });

  lines.push('M  END');
  return lines.join('\n');
}
