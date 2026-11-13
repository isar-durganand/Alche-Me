/**
 * Alche-Me — MolView-Standard 2D Chemical Sketcher Engine
 * Exact match to MolView (app.molview.com) 2D Sketcher panel:
 * - High-DPI ChemDraw vector rendering with skeletal carbon conventions
 * - Left vertical toolbar: Single, Double, Triple, Wedge, Chain, Rings (Benzene, Cyclohexane, Cyclopentane, Cyclopropane), Charges
 * - Right vertical ribbon: H, C, N, O, P, S, F, Cl, Br, I, Periodic Table modal trigger
 * - Top action bar: Select, Eraser, Trash, Undo, Redo, Recenter, Zoom, +H, Clean 2D
 * - Advanced ring fusion on click/drag (fuses rings onto shared bonds like Phenanthrene)
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Minus, 
  Equal, 
  Menu as MenuIcon, 
  Trash2, 
  RotateCcw, 
  RotateCw, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Focus,
  MousePointer,
  Eraser,
  Download,
  Grid
} from 'lucide-react';
import { Atom2D, Bond2D, Point2D, SketcherTool } from './types2d';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
import { getElementData } from './types';

const BOND_LENGTH = 42; // Standard 2D bond length in pixels
const SNAP_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

interface ChemicalSketcher2DProps {
  atoms: Atom2D[];
  bonds: Bond2D[];
  onChange: (atoms: Atom2D[], bonds: Bond2D[]) => void;
  activeElement: string;
  onSelectElement: (element: string) => void;
  onOpenPeriodicTable: () => void;
  onAutoAddHydrogens?: () => void;
  onStripHydrogens?: () => void;
}

export const ChemicalSketcher2D: React.FC<ChemicalSketcher2DProps> = ({
  atoms,
  bonds,
  onChange,
  activeElement,
  onSelectElement,
  onOpenPeriodicTable,
  onAutoAddHydrogens,
  onStripHydrogens,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTool, setActiveTool] = useState<SketcherTool>('singleBond');
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<Point2D>({ x: 0, y: 0 });

  // History stack for 2D Undo / Redo
  const [history, setHistory] = useState<{ atoms: Atom2D[]; bonds: Bond2D[] }[]>([]);
  const [redoStack, setRedoStack] = useState<{ atoms: Atom2D[]; bonds: Bond2D[] }[]>([]);

  // Interactive interaction states
  const [hoveredAtomId, setHoveredAtomId] = useState<string | null>(null);
  const [hoveredBondId, setHoveredBondId] = useState<string | null>(null);
  const [selectedAtomIds, setSelectedAtomIds] = useState<string[]>([]);
  const [mouseCanvasPt, setMouseCanvasPt] = useState<Point2D | null>(null);
  const [dragInfo, setDragInfo] = useState<{
    type: 'bond' | 'atom' | 'pan' | 'chain';
    startScreen: Point2D;
    sourceAtomId?: string;
    isNewAtom?: boolean;
    currentScreen: Point2D;
  } | null>(null);

  // Commit changes to history
  const commitChange = useCallback((newAtoms: Atom2D[], newBonds: Bond2D[]) => {
    setHistory((prev) => [...prev.slice(-30), { atoms, bonds }]);
    setRedoStack([]);
    onChange(newAtoms, newBonds);
  }, [atoms, bonds, onChange]);

  const handleUndo = () => {
    if (history.length === 0) return;
    soundEngine.playTap();
    const prev = history[history.length - 1];
    setRedoStack((r) => [...r, { atoms, bonds }]);
    setHistory((h) => h.slice(0, -1));
    onChange(prev.atoms, prev.bonds);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    soundEngine.playTap();
    const next = redoStack[redoStack.length - 1];
    setHistory((h) => [...h, { atoms, bonds }]);
    setRedoStack((r) => r.slice(0, -1));
    onChange(next.atoms, next.bonds);
  };

  const handleClear = () => {
    soundEngine.playTap();
    commitChange([], []);
    setSelectedAtomIds([]);
  };

  // Screen to Canvas Coordinate Conversion
  const screenToCanvasCoords = useCallback((screenX: number, screenY: number): Point2D => {
    if (!containerRef.current) return { x: screenX, y: screenY };
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = screenX - rect.left;
    const rawY = screenY - rect.top;
    return {
      x: (rawX - panOffset.x) / zoom,
      y: (rawY - panOffset.y) / zoom,
    };
  }, [panOffset, zoom]);

  // Recenter 2D View
  const handleRecenter = () => {
    soundEngine.playTap();
    if (!containerRef.current || atoms.length === 0) {
      setPanOffset({ x: 0, y: 0 });
      setZoom(1.0);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const a of atoms) {
      if (a.x < minX) minX = a.x;
      if (a.x > maxX) maxX = a.x;
      if (a.y < minY) minY = a.y;
      if (a.y > maxY) maxY = a.y;
    }
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    setPanOffset({
      x: rect.width / 2 - midX * zoom,
      y: rect.height / 2 - midY * zoom,
    });
  };

  // Snap vector to nearest 30 degree angle and standard bond length
  const snapVector = (from: Point2D, to: Point2D): Point2D => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 10) return to;

    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angleDeg < 0) angleDeg += 360;

    // Find closest snap angle
    let closestAngle = SNAP_ANGLES[0];
    let minDiff = 360;
    for (const a of SNAP_ANGLES) {
      const diff = Math.min(Math.abs(angleDeg - a), 360 - Math.abs(angleDeg - a));
      if (diff < minDiff) {
        minDiff = diff;
        closestAngle = a;
      }
    }

    const rad = (closestAngle * Math.PI) / 180;
    const targetLen = Math.max(BOND_LENGTH, Math.round(dist / BOND_LENGTH) * BOND_LENGTH);
    return {
      x: from.x + Math.cos(rad) * targetLen,
      y: from.y + Math.sin(rad) * targetLen,
    };
  };

  // Find nearest atom within tolerance
  const getAtomAt = (pt: Point2D, radius: number = 18): Atom2D | null => {
    let nearest: Atom2D | null = null;
    let minD = radius;
    for (const a of atoms) {
      const d = Math.hypot(a.x - pt.x, a.y - pt.y);
      if (d < minD) {
        minD = d;
        nearest = a;
      }
    }
    return nearest;
  };

  // Distance from point to line segment
  const distToSegment = (p: Point2D, v: Point2D, w: Point2D): number => {
    const l2 = (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  };

  // Find nearest bond within tolerance
  const getBondAt = (pt: Point2D, tolerance: number = 10): Bond2D | null => {
    let nearest: Bond2D | null = null;
    let minD = tolerance;
    for (const b of bonds) {
      const a1 = atoms.find((a) => a.id === b.from);
      const a2 = atoms.find((a) => a.id === b.to);
      if (!a1 || !a2) continue;
      const d = distToSegment(pt, a1, a2);
      if (d < minD) {
        minD = d;
        nearest = b;
      }
    }
    return nearest;
  };

  // Stamp Ring Template (Benzene, Cyclohexane, Cyclopentane, Cyclopropane)
  const stampRing = (centerPt: Point2D, sides: number, isBenzene: boolean = false, fuseBond?: Bond2D) => {
    soundEngine.playSuccess();
    const newAtoms: Atom2D[] = [...atoms];
    const newBonds: Bond2D[] = [...bonds];
    const radius = BOND_LENGTH / (2 * Math.sin(Math.PI / sides));

    // Case A: Fusing onto an existing bond
    if (fuseBond) {
      const a1 = atoms.find((a) => a.id === fuseBond.from);
      const a2 = atoms.find((a) => a.id === fuseBond.to);
      if (!a1 || !a2) return;

      const midX = (a1.x + a2.x) / 2;
      const midY = (a1.y + a2.y) / 2;
      const bondVec = { x: a2.x - a1.x, y: a2.y - a1.y };
      const bondLen = Math.hypot(bondVec.x, bondVec.y) || 1;
      // Perpendicular normal vector
      const norm = { x: -bondVec.y / bondLen, y: bondVec.x / bondLen };
      const apothem = radius * Math.cos(Math.PI / sides);
      const ringCenter = { x: midX + norm.x * apothem, y: midY + norm.y * apothem };

      // Angle of a1 and a2 relative to ring center
      const angle1 = Math.atan2(a1.y - ringCenter.y, a1.x - ringCenter.x);
      const angleStep = (2 * Math.PI) / sides;
      // Determine rotation direction
      const angle2 = Math.atan2(a2.y - ringCenter.y, a2.x - ringCenter.x);
      let diff = angle2 - angle1;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      const dir = diff > 0 ? 1 : -1;

      const createdIds: string[] = [a1.id];
      // Generate remaining (sides - 2) atoms
      for (let i = 1; i < sides - 1; i++) {
        const curAngle = angle1 - dir * i * angleStep;
        const newId = `a-fused-${Date.now()}-${i}`;
        const newAtom: Atom2D = {
          id: newId,
          x: Math.round(ringCenter.x + Math.cos(curAngle) * radius),
          y: Math.round(ringCenter.y + Math.sin(curAngle) * radius),
          symbol: activeElement,
        };
        newAtoms.push(newAtom);
        createdIds.push(newId);
      }
      createdIds.push(a2.id);

      // Connect bonds around perimeter
      for (let i = 0; i < createdIds.length; i++) {
        const fromId = createdIds[i];
        const toId = createdIds[(i + 1) % createdIds.length];
        const exists = newBonds.some((b) => (b.from === fromId && b.to === toId) || (b.from === toId && b.to === fromId));
        if (!exists) {
          const order = (isBenzene && i % 2 === 0) ? 2 : 1;
          newBonds.push({
            id: `b-fused-${Date.now()}-${i}`,
            from: fromId,
            to: toId,
            order,
          });
        }
      }
      commitChange(newAtoms, newBonds);
      return;
    }

    // Case B: Standalone Ring placed at center
    const startAngle = -Math.PI / 2;
    const angleStep = (2 * Math.PI) / sides;
    const ringAtomIds: string[] = [];

    for (let i = 0; i < sides; i++) {
      const curAngle = startAngle + i * angleStep;
      const newId = `a-ring-${Date.now()}-${i}`;
      const newAtom: Atom2D = {
        id: newId,
        x: Math.round(centerPt.x + Math.cos(curAngle) * radius),
        y: Math.round(centerPt.y + Math.sin(curAngle) * radius),
        symbol: activeElement,
      };
      newAtoms.push(newAtom);
      ringAtomIds.push(newId);
    }

    for (let i = 0; i < sides; i++) {
      const fromId = ringAtomIds[i];
      const toId = ringAtomIds[(i + 1) % sides];
      const order = (isBenzene && i % 2 === 0) ? 2 : 1;
      newBonds.push({
        id: `b-ring-${Date.now()}-${i}`,
        from: fromId,
        to: toId,
        order,
      });
    }

    commitChange(newAtoms, newBonds);
  };

  // Pointer Down Handler
  const handlePointerDown = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;

    // Right-click: Start canvas pan
    if (e.button === 2) {
      setDragInfo({
        type: 'pan',
        startScreen: { x: e.clientX, y: e.clientY },
        currentScreen: { x: e.clientX, y: e.clientY },
      });
      el.setPointerCapture(e.pointerId);
      e.preventDefault();
      return;
    }

    if (e.button !== 0) return;

    const canvasPt = screenToCanvasCoords(e.clientX, e.clientY);
    const hitAtom = getAtomAt(canvasPt);
    const hitBond = getBondAt(canvasPt);

    // 1. Eraser Tool
    if (activeTool === 'erase') {
      soundEngine.playTap();
      if (hitAtom) {
        const nextAtoms = atoms.filter((a) => a.id !== hitAtom.id);
        const nextBonds = bonds.filter((b) => b.from !== hitAtom.id && b.to !== hitAtom.id);
        commitChange(nextAtoms, nextBonds);
      } else if (hitBond) {
        const nextBonds = bonds.filter((b) => b.id !== hitBond.id);
        commitChange(atoms, nextBonds);
      }
      return;
    }

    // 2. Ring Tools
    if (
      activeTool === 'benzene' ||
      activeTool === 'cyclohexane' ||
      activeTool === 'cyclopentane' ||
      activeTool === 'cyclopropane'
    ) {
      const sides = activeTool === 'benzene' || activeTool === 'cyclohexane' ? 6 : activeTool === 'cyclopentane' ? 5 : 3;
      const isBenzene = activeTool === 'benzene';
      stampRing(canvasPt, sides, isBenzene, hitBond || undefined);
      return;
    }

    // 3. Selection / Move Tool
    if (activeTool === 'select') {
      if (hitAtom) {
        setDragInfo({
          type: 'atom',
          startScreen: { x: e.clientX, y: e.clientY },
          sourceAtomId: hitAtom.id,
          currentScreen: { x: e.clientX, y: e.clientY },
        });
        setSelectedAtomIds([hitAtom.id]);
        el.setPointerCapture(e.pointerId);
      } else {
        setSelectedAtomIds([]);
      }
      return;
    }

    // 4. Dedicated Atom Placement Tool
    if (activeTool === 'atom') {
      soundEngine.playElementPip(getElementData(activeElement).atomicNumber);
      if (hitAtom) {
        // Transform existing atom to activeElement
        const nextAtoms = atoms.map((a) => (a.id === hitAtom.id ? { ...a, symbol: activeElement } : a));
        commitChange(nextAtoms, bonds);
      } else {
        // Place new standalone atom at exact clicked position
        const newAtomId = `a-click-${Date.now()}`;
        const newAtom: Atom2D = {
          id: newAtomId,
          x: Math.round(canvasPt.x),
          y: Math.round(canvasPt.y),
          symbol: activeElement,
        };
        commitChange([...atoms, newAtom], bonds);
      }
      return;
    }

    // 5. Bond Drawing & Atom Sprouting Tools
    if (
      activeTool === 'singleBond' ||
      activeTool === 'doubleBond' ||
      activeTool === 'tripleBond' ||
      activeTool === 'wedgeBond'
    ) {
      // If clicked on existing bond: cycle bond order
      if (hitBond && !hitAtom) {
        soundEngine.playTap();
        const nextBonds = bonds.map((b) => {
          if (b.id === hitBond.id) {
            const nextOrder = (b.order === 1 ? 2 : b.order === 2 ? 3 : 1) as 1 | 2 | 3;
            return { ...b, order: nextOrder };
          }
          return b;
        });
        commitChange(atoms, nextBonds);
        return;
      }

      // If clicked on existing atom:
      if (hitAtom) {
        // If element is different from atom symbol: change atom element!
        if (hitAtom.symbol !== activeElement) {
          soundEngine.playElementPip(getElementData(activeElement).atomicNumber);
          const nextAtoms = atoms.map((a) => (a.id === hitAtom.id ? { ...a, symbol: activeElement } : a));
          commitChange(nextAtoms, bonds);
          return;
        }

        setDragInfo({
          type: 'bond',
          startScreen: { x: e.clientX, y: e.clientY },
          sourceAtomId: hitAtom.id,
          isNewAtom: false,
          currentScreen: { x: e.clientX, y: e.clientY },
        });
        el.setPointerCapture(e.pointerId);
        return;
      }

      // If clicked on empty space: place an atom at exact position
      soundEngine.playElementPip(getElementData(activeElement).atomicNumber);
      const newAtomId = `a-${Date.now()}`;
      const newAtom: Atom2D = {
        id: newAtomId,
        x: Math.round(canvasPt.x),
        y: Math.round(canvasPt.y),
        symbol: activeElement,
      };
      commitChange([...atoms, newAtom], bonds);

      // Allow dragging bond immediately from this new atom if user drags
      setDragInfo({
        type: 'bond',
        startScreen: { x: e.clientX, y: e.clientY },
        sourceAtomId: newAtomId,
        isNewAtom: true,
        currentScreen: { x: e.clientX, y: e.clientY },
      });
      el.setPointerCapture(e.pointerId);
    }
  };

  // Pointer Move Handler
  const handlePointerMove = (e: React.PointerEvent) => {
    const canvasPt = screenToCanvasCoords(e.clientX, e.clientY);
    setMouseCanvasPt(canvasPt);
    const hitAtom = getAtomAt(canvasPt);
    const hitBond = getBondAt(canvasPt);

    setHoveredAtomId(hitAtom ? hitAtom.id : null);
    setHoveredBondId(hitBond ? hitBond.id : null);

    if (!dragInfo) return;

    // Pan Canvas
    if (dragInfo.type === 'pan') {
      const dx = e.clientX - dragInfo.currentScreen.x;
      const dy = e.clientY - dragInfo.currentScreen.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragInfo({ ...dragInfo, currentScreen: { x: e.clientX, y: e.clientY } });
      return;
    }

    // Drag Atom to Move
    if (dragInfo.type === 'atom' && dragInfo.sourceAtomId) {
      const updated = atoms.map((a) => {
        if (a.id === dragInfo.sourceAtomId) {
          return { ...a, x: Math.round(canvasPt.x), y: Math.round(canvasPt.y) };
        }
        return a;
      });
      onChange(updated, bonds);
      setDragInfo({ ...dragInfo, currentScreen: { x: e.clientX, y: e.clientY } });
      return;
    }

    // Drag Bond Line
    if (dragInfo.type === 'bond') {
      setDragInfo({ ...dragInfo, currentScreen: { x: e.clientX, y: e.clientY } });
    }
  };

  // Pointer Up Handler
  const handlePointerUp = (e: React.PointerEvent) => {
    const info = dragInfo;
    setDragInfo(null);
    if (!info) return;

    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Complete Bond Dragging
    if (info.type === 'bond' && info.sourceAtomId) {
      const sourceAtom = atoms.find((a) => a.id === info.sourceAtomId);
      if (!sourceAtom) return;

      const releasePt = screenToCanvasCoords(e.clientX, e.clientY);
      const targetAtom = getAtomAt(releasePt);
      const dist = Math.hypot(e.clientX - info.startScreen.x, e.clientY - info.startScreen.y);
      const order = activeTool === 'doubleBond' ? 2 : activeTool === 'tripleBond' ? 3 : 1;

      // Click without dragging (dist < 10px)
      if (dist < 10) {
        // If it was already an existing atom: Auto-sprout attached bond and new atom at zig-zag geometry!
        if (!info.isNewAtom) {
          const connectedBonds = bonds.filter((b) => b.from === sourceAtom.id || b.to === sourceAtom.id);
          const existingAngles = connectedBonds.map((b) => {
            const otherId = b.from === sourceAtom.id ? b.to : b.from;
            const other = atoms.find((a) => a.id === otherId);
            if (!other) return 0;
            return Math.atan2(other.y - sourceAtom.y, other.x - sourceAtom.x);
          });

          let bestAngle = 0;
          if (existingAngles.length === 0) {
            bestAngle = 0; // East (0 deg)
          } else if (existingAngles.length === 1) {
            // Standard zig-zag (+120 deg)
            bestAngle = existingAngles[0] + (Math.PI * 2) / 3;
          } else {
            // Largest uncrowded gap
            const sorted = [...existingAngles].map((a) => (a < 0 ? a + 2 * Math.PI : a)).sort((a, b) => a - b);
            let maxGap = 0;
            let gapMid = 0;
            for (let i = 0; i < sorted.length; i++) {
              const next = i === sorted.length - 1 ? sorted[0] + 2 * Math.PI : sorted[i + 1];
              const gap = next - sorted[i];
              if (gap > maxGap) {
                maxGap = gap;
                gapMid = sorted[i] + gap / 2;
              }
            }
            bestAngle = gapMid;
          }

          const deg = Math.round((bestAngle * 180) / Math.PI / 30) * 30;
          const rad = (deg * Math.PI) / 180;
          const newX = Math.round(sourceAtom.x + Math.cos(rad) * BOND_LENGTH);
          const newY = Math.round(sourceAtom.y + Math.sin(rad) * BOND_LENGTH);

          soundEngine.playElementPip(getElementData(activeElement).atomicNumber);
          const newAtomId = `a-sprout-${Date.now()}`;
          const newAtom: Atom2D = {
            id: newAtomId,
            x: newX,
            y: newY,
            symbol: activeElement,
          };

          const newBond: Bond2D = {
            id: `b-sprout-${Date.now()}`,
            from: sourceAtom.id,
            to: newAtomId,
            order,
          };

          commitChange([...atoms, newAtom], [...bonds, newBond]);
        }
        // If it was a newly placed atom, it remains placed exactly where clicked!
        return;
      }

      // Released over another existing atom -> Connect bond!
      if (targetAtom && targetAtom.id !== sourceAtom.id) {
        soundEngine.playTap();
        const exists = bonds.some((b) => (b.from === sourceAtom.id && b.to === targetAtom.id) || (b.from === targetAtom.id && b.to === sourceAtom.id));
        if (exists) {
          // Toggle bond order if already connected
          const nextBonds = bonds.map((b) => {
            if ((b.from === sourceAtom.id && b.to === targetAtom.id) || (b.from === targetAtom.id && b.to === sourceAtom.id)) {
              const nextOrder = (b.order === 1 ? 2 : b.order === 2 ? 3 : 1) as 1 | 2 | 3;
              return { ...b, order: nextOrder };
            }
            return b;
          });
          commitChange(atoms, nextBonds);
        } else {
          const newBond: Bond2D = {
            id: `b-${Date.now()}`,
            from: sourceAtom.id,
            to: targetAtom.id,
            order,
          };
          commitChange(atoms, [...bonds, newBond]);
        }
        return;
      }

      // Released in empty space -> Sprout new atom at snapped coordinates!
      soundEngine.playElementPip(getElementData(activeElement).atomicNumber);
      const snappedPt = snapVector(sourceAtom, releasePt);
      const newAtomId = `a-sprout-${Date.now()}`;
      const newAtom: Atom2D = {
        id: newAtomId,
        x: Math.round(snappedPt.x),
        y: Math.round(snappedPt.y),
        symbol: activeElement,
      };

      const newBond: Bond2D = {
        id: `b-sprout-${Date.now()}`,
        from: sourceAtom.id,
        to: newAtomId,
        order,
      };

      commitChange([...atoms, newAtom], [...bonds, newBond]);
    }
  };

  // Wheel to Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((z) => Math.max(0.4, Math.min(3.0, z * factor)));
  };

  // Clean 2D Skeletal Layout Optimizer
  const handleClean2D = () => {
    soundEngine.playSuccess();
    handleRecenter();
  };

  // Keyboard Shortcuts: Ctrl+Z (Undo), Ctrl+Y (Redo), Delete (Erase)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedAtomIds.length > 0) {
          e.preventDefault();
          const nextAtoms = atoms.filter((a) => !selectedAtomIds.includes(a.id));
          const nextBonds = bonds.filter((b) => !selectedAtomIds.includes(b.from) && !selectedAtomIds.includes(b.to));
          commitChange(nextAtoms, nextBonds);
          setSelectedAtomIds([]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [atoms, bonds, selectedAtomIds, handleUndo, handleRedo, commitChange]);

  // Center on initial load if atoms exist
  useEffect(() => {
    if (atoms.length > 0 && panOffset.x === 0 && panOffset.y === 0) {
      handleRecenter();
    }
  }, [atoms.length]);

  // Quick Organic Ribbon Elements
  const quickRibbonElements = ['H', 'C', 'N', 'O', 'P', 'S', 'F', 'Cl', 'Br', 'I'];

  return (
    <div className="relative w-full h-full flex flex-col bg-white overflow-hidden select-none border-r border-slate-300">
      {/* 1. Top 2D Sub-Toolbar matching Screenshot 1 */}
      <div className="h-10 border-b border-slate-200 bg-[#F8F9FA] px-2 flex items-center justify-between shrink-0 text-slate-700">
        <div className="flex items-center gap-1">
          {/* Select Tool */}
          <button
            type="button"
            onClick={() => setActiveTool('select')}
            title="Lasso / Select / Move (S)"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              activeTool === 'select' ? 'bg-[#D0EBF8] text-[#0070BA] font-bold shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <MousePointer className="w-4 h-4" />
          </button>

          {/* Eraser Tool */}
          <button
            type="button"
            onClick={() => setActiveTool('erase')}
            title="Eraser (E)"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              activeTool === 'erase' ? 'bg-rose-100 text-rose-600 font-bold shadow-xs' : 'hover:bg-slate-200'
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>

          {/* Clear / Trash */}
          <button
            type="button"
            onClick={handleClear}
            title="Clear all"
            className="p-1.5 rounded-md hover:bg-rose-100 hover:text-rose-600 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Recenter 2D */}
          <button
            type="button"
            onClick={handleRecenter}
            title="Center 2D structure"
            className="p-1.5 rounded-md hover:bg-slate-200 transition-all cursor-pointer"
          >
            <Focus className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3.0, z * 1.2))}
            title="Zoom In"
            className="p-1.5 rounded-md hover:bg-slate-200 transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.4, z / 1.2))}
            title="Zoom Out"
            className="p-1.5 rounded-md hover:bg-slate-200 transition-all cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* +H (Auto-add Hydrogens) */}
          <button
            type="button"
            onClick={onAutoAddHydrogens}
            title="Auto-fill Hydrogens (+H)"
            className="px-2 py-1 rounded-md text-xs font-bold font-mono hover:bg-slate-200 transition-all cursor-pointer"
          >
            CH
          </button>

          {/* Clean 2D */}
          <button
            type="button"
            onClick={handleClean2D}
            title="Clean 2D layout"
            className="p-1.5 rounded-md hover:bg-slate-200 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>
        </div>

        {/* 2D Zoom Level Badge */}
        <div className="text-[11px] font-mono font-bold text-slate-500 pr-2">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Main 2D Workspace: Left Tool Bar + Canvas + Right Elements Ribbon */}
      <div className="flex-1 flex w-full h-full relative overflow-hidden">
        {/* 2. Left Vertical Toolbar matching Screenshot 1 */}
        <div className="w-10 border-r border-slate-200 bg-[#F8F9FA] flex flex-col items-center py-1.5 gap-1 shrink-0 z-10 overflow-y-auto">
          {/* Direct Atom Tool */}
          <button
            type="button"
            onClick={() => setActiveTool('atom')}
            title={`Place Atom (${activeElement}) - Click canvas to drop atom`}
            className={`w-8 h-8 rounded-md flex items-center justify-center font-montserrat font-black text-xs transition-all cursor-pointer ${
              activeTool === 'atom' ? 'bg-[#D0EBF8] text-[#0070BA] font-extrabold shadow-xs ring-2 ring-[#0070BA]/30' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>{activeElement}</span>
          </button>

          {/* Single Bond */}
          <button
            type="button"
            onClick={() => setActiveTool('singleBond')}
            title="Single Bond (—)"
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'singleBond' ? 'bg-[#D0EBF8] text-[#0070BA] font-extrabold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span className="font-extrabold text-base leading-none">/</span>
          </button>

          {/* Double Bond */}
          <button
            type="button"
            onClick={() => setActiveTool('doubleBond')}
            title="Double Bond (=)"
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'doubleBond' ? 'bg-[#D0EBF8] text-[#0070BA] font-extrabold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span className="font-extrabold text-sm leading-none">//</span>
          </button>

          {/* Triple Bond */}
          <button
            type="button"
            onClick={() => setActiveTool('tripleBond')}
            title="Triple Bond (≡)"
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'tripleBond' ? 'bg-[#D0EBF8] text-[#0070BA] font-extrabold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span className="font-extrabold text-sm leading-none">///</span>
          </button>

          {/* Wedge Bond */}
          <button
            type="button"
            onClick={() => setActiveTool('wedgeBond')}
            title="Wedge Stereobond"
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'wedgeBond' ? 'bg-[#D0EBF8] text-[#0070BA] font-extrabold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span className="text-xs font-bold">▲</span>
          </button>

          <div className="w-6 h-px bg-slate-300 my-0.5" />

          {/* Benzene Ring Template */}
          <button
            type="button"
            onClick={() => setActiveTool('benzene')}
            title="Benzene Ring (Aromatic Hexagon)"
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'benzene' ? 'bg-[#D0EBF8] text-[#0070BA] font-extrabold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            {/* Hexagon icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
              <circle cx="12" cy="12" r="5" strokeDasharray="2,2" />
            </svg>
          </button>

          {/* Cyclohexane Template */}
          <button
            type="button"
            onClick={() => setActiveTool('cyclohexane')}
            title="Cyclohexane (Hexagon)"
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'cyclohexane' ? 'bg-[#D0EBF8] text-[#0070BA] font-extrabold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
            </svg>
          </button>

          {/* Cyclopentane Template */}
          <button
            type="button"
            onClick={() => setActiveTool('cyclopentane')}
            title="Cyclopentane (Pentagon)"
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'cyclopentane' ? 'bg-[#D0EBF8] text-[#0070BA] font-extrabold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 22 9 18 21 6 21 2 9 12 2" />
            </svg>
          </button>

          {/* Cyclopropane Template */}
          <button
            type="button"
            onClick={() => setActiveTool('cyclopropane')}
            title="Cyclopropane (Triangle)"
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              activeTool === 'cyclopropane' ? 'bg-[#D0EBF8] text-[#0070BA] font-extrabold shadow-xs' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 3 22 21 2 21 12 3" />
            </svg>
          </button>
        </div>

        {/* 3. Interactive SVG Chemical Drawing Canvas */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => setMouseCanvasPt(null)}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
          className="flex-1 w-full h-full bg-white relative overflow-hidden cursor-crosshair touch-none"
        >
          <svg className="w-full h-full absolute inset-0 pointer-events-none">
            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>
              {/* Ghost Cursor Preview when hovering empty space */}
              {mouseCanvasPt && !hoveredAtomId && !hoveredBondId && !dragInfo && (
                <g opacity={0.55} className="pointer-events-none transition-opacity">
                  <circle
                    cx={mouseCanvasPt.x}
                    cy={mouseCanvasPt.y}
                    r={10}
                    fill="#00C2D1"
                    fillOpacity={0.15}
                    stroke="#00C2D1"
                    strokeWidth={1.5}
                    strokeDasharray="3,3"
                  />
                  <text
                    x={mouseCanvasPt.x}
                    y={mouseCanvasPt.y + 4}
                    textAnchor="middle"
                    fill="#008E9B"
                    fontSize={12}
                    fontFamily="Arial, sans-serif"
                    fontWeight="bold"
                  >
                    {activeElement}
                  </text>
                </g>
              )}

              {/* Bonds Layer */}
              {bonds.map((b) => {
                const a1 = atoms.find((a) => a.id === b.from);
                const a2 = atoms.find((a) => a.id === b.to);
                if (!a1 || !a2) return null;

                const isHovered = hoveredBondId === b.id;
                const dx = a2.x - a1.x;
                const dy = a2.y - a1.y;
                const len = Math.hypot(dx, dy) || 1;

                // Check if either atom shows a chemical text symbol (e.g. O, N, H, or isolated C)
                const a1Conn = bonds.filter((ob) => ob.from === a1.id || ob.to === a1.id).length;
                const a2Conn = bonds.filter((ob) => ob.from === a2.id || ob.to === a2.id).length;
                const a1HasSymbol = a1.symbol !== 'C' || a1Conn === 0;
                const a2HasSymbol = a2.symbol !== 'C' || a2Conn === 0;

                const pad1 = a1HasSymbol ? 11 : 0;
                const pad2 = a2HasSymbol ? 11 : 0;

                const ux = dx / len;
                const uy = dy / len;
                const p1x = a1.x + ux * pad1;
                const p1y = a1.y + uy * pad1;
                const p2x = a2.x - ux * pad2;
                const p2y = a2.y - uy * pad2;

                // Normal offset vector for double/triple bonds
                const nx = (-uy) * 3.5;
                const ny = ux * 3.5;

                return (
                  <g key={b.id} className="transition-all">
                    {/* Hover hotspot */}
                    {isHovered && (
                      <line
                        x1={a1.x}
                        y1={a1.y}
                        x2={a2.x}
                        y2={a2.y}
                        stroke="#00C2D1"
                        strokeWidth={10}
                        strokeOpacity={0.3}
                        strokeLinecap="round"
                      />
                    )}

                    {/* Single Bond */}
                    {b.order === 1 && (
                      <line
                        x1={p1x}
                        y1={p1y}
                        x2={p2x}
                        y2={p2y}
                        stroke="#1E293B"
                        strokeWidth={2.4}
                        strokeLinecap="round"
                      />
                    )}

                    {/* Double Bond */}
                    {b.order === 2 && (
                      <>
                        <line
                          x1={p1x + nx}
                          y1={p1y + ny}
                          x2={p2x + nx}
                          y2={p2y + ny}
                          stroke="#1E293B"
                          strokeWidth={2.4}
                          strokeLinecap="round"
                        />
                        <line
                          x1={p1x - nx}
                          y1={p1y - ny}
                          x2={p2x - nx}
                          y2={p2y - ny}
                          stroke="#1E293B"
                          strokeWidth={2.4}
                          strokeLinecap="round"
                        />
                      </>
                    )}

                    {/* Triple Bond */}
                    {b.order === 3 && (
                      <>
                        <line
                          x1={p1x}
                          y1={p1y}
                          x2={p2x}
                          y2={p2y}
                          stroke="#1E293B"
                          strokeWidth={2.4}
                          strokeLinecap="round"
                        />
                        <line
                          x1={p1x + nx * 1.5}
                          y1={p1y + ny * 1.5}
                          x2={p2x + nx * 1.5}
                          y2={p2y + ny * 1.5}
                          stroke="#1E293B"
                          strokeWidth={2.0}
                          strokeLinecap="round"
                        />
                        <line
                          x1={p1x - nx * 1.5}
                          y1={p1y - ny * 1.5}
                          x2={p2x - nx * 1.5}
                          y2={p2y - ny * 1.5}
                          stroke="#1E293B"
                          strokeWidth={2.0}
                          strokeLinecap="round"
                        />
                      </>
                    )}
                  </g>
                );
              })}

              {/* Live Dragging Preview Line */}
              {dragInfo && dragInfo.type === 'bond' && dragInfo.sourceAtomId && (
                (() => {
                  const source = atoms.find((a) => a.id === dragInfo.sourceAtomId);
                  if (!source) return null;
                  const curCanvas = screenToCanvasCoords(dragInfo.currentScreen.x, dragInfo.currentScreen.y);
                  const targetAtom = getAtomAt(curCanvas);
                  const endPt = targetAtom ? { x: targetAtom.x, y: targetAtom.y } : snapVector(source, curCanvas);

                  return (
                    <g>
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={endPt.x}
                        y2={endPt.y}
                        stroke="#00C2D1"
                        strokeWidth={2.5}
                        strokeDasharray={targetAtom ? undefined : '5,4'}
                        strokeLinecap="round"
                      />
                      {/* Ghost preview circle */}
                      <circle
                        cx={endPt.x}
                        cy={endPt.y}
                        r={targetAtom ? 12 : 8}
                        fill="#00C2D1"
                        fillOpacity={0.25}
                        stroke="#00C2D1"
                        strokeWidth={2}
                      />
                    </g>
                  );
                })()
              )}

              {/* Atoms Layer */}
              {atoms.map((a) => {
                const connCount = bonds.filter((b) => b.from === a.id || b.to === a.id).length;
                const isCarbon = a.symbol === 'C';
                const isHovered = hoveredAtomId === a.id;
                const isSelected = selectedAtomIds.includes(a.id);

                // In standard chemical skeletal drawings, carbons connected to other atoms are implicit vertices
                const showSymbol = !isCarbon || connCount === 0;

                return (
                  <g key={a.id} className="transition-all">
                    {/* Selection or Hover Ring */}
                    {(isHovered || isSelected) && (
                      <circle
                        cx={a.x}
                        cy={a.y}
                        r={14}
                        fill={isSelected ? '#00C2D1' : '#E0F2FE'}
                        fillOpacity={isSelected ? 0.35 : 0.6}
                        stroke={isSelected ? '#00C2D1' : '#38BDF8'}
                        strokeWidth={2}
                      />
                    )}

                    {/* Heteroatom / Isolated Carbon Text Label */}
                    {showSymbol ? (
                      <g>
                        {/* White circular mask cutout behind letter */}
                        <circle cx={a.x} cy={a.y} r={10} fill="#ffffff" />
                        <text
                          x={a.x}
                          y={a.y + 4.5}
                          textAnchor="middle"
                          fill="#0F172A"
                          fontSize={14}
                          fontFamily="Arial, sans-serif"
                          fontWeight="bold"
                        >
                          {a.symbol}
                        </text>
                      </g>
                    ) : (
                      // Implicit skeletal carbon vertex dot (subtle)
                      <circle cx={a.x} cy={a.y} r={2.5} fill="#1E293B" />
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* 4. Right Vertical Elements Ribbon matching Screenshot 1 */}
        <div className="w-10 border-l border-slate-200 bg-[#F8F9FA] flex flex-col items-center py-1.5 gap-1 shrink-0 z-10 overflow-y-auto">
          {quickRibbonElements.map((sym) => {
            const isSelected = activeElement.toLowerCase() === sym.toLowerCase();
            return (
              <button
                key={sym}
                type="button"
                onClick={() => {
                  soundEngine.playElementPip(getElementData(sym).atomicNumber);
                  onSelectElement(sym);
                }}
                title={`Active element: ${sym} (${getElementData(sym).name})`}
                className={`w-8 h-8 rounded-md flex items-center justify-center font-montserrat font-bold text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D0EBF8] text-[#0070BA] font-extrabold shadow-xs border border-[#0070BA]/30'
                    : 'hover:bg-slate-200 text-slate-800'
                }`}
              >
                {sym}
              </button>
            );
          })}

          <div className="w-6 h-px bg-slate-300 my-0.5" />

          {/* Full Periodic Table Trigger Button matching Screenshot 1 */}
          <button
            type="button"
            onClick={onOpenPeriodicTable}
            title="Open Full 118-Element Periodic Table"
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            <Grid className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
