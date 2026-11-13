/**
 * Alche-Me — MolView 2D Chemical Sketcher Types
 * Standard MDL / ChemDraw 2D graph representation.
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface Atom2D {
  id: string;
  x: number;
  y: number;
  symbol: string;
  charge?: number; // e.g. +1, -1
}

export interface Bond2D {
  id: string;
  from: string; // Atom2D id
  to: string;   // Atom2D id
  order: 1 | 2 | 3;
  stereo?: 'none' | 'wedge' | 'dash';
}

export type SketcherTool =
  | 'select'
  | 'erase'
  | 'atom'
  | 'singleBond'
  | 'doubleBond'
  | 'tripleBond'
  | 'wedgeBond'
  | 'chain'
  | 'benzene'
  | 'cyclohexane'
  | 'cyclopentane'
  | 'cyclopropane'
  | 'chargePlus'
  | 'chargeMinus';

export interface SketcherHistoryState {
  atoms: Atom2D[];
  bonds: Bond2D[];
}
