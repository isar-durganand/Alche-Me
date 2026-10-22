/**
 * Alche-Me — 3D Molecule Studio & HOMO-LUMO Quantum Frontier Laboratory
 * Fully responsive, optimized Zero-Scroll Studio Deck inspired by HomoLumo, ArgusLab, and MolDraw:
 * - 3Dmol WebGL engine with instant zoomTo() centering & full 6-DOF drag/pan controls
 * - 3D Builder with VSEPR force-field physics relaxation, fragment palettes, and valence octet checks
 * - Full 118 Periodic Table coverage with dedicated element picker modal
 * - Connect Bonds Suite with dropdowns, canvas click connection, and Auto-Bonding
 * - SMILES / XYZ / Molfile import & export interoperability
 * - Real-time bond distance, VSEPR angle, and dihedral torsion measurements
 * - Comprehensive HOMO-LUMO Frontier Orbital Analyzer (Pearson HSAB, Band Gap, Hardness, Energy Ladder)
 */

import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Sparkles, 
  Ruler, 
  Compass, 
  Wand2, 
  Focus, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Bookmark, 
  Zap, 
  BookOpen, 
  Search, 
  Copy, 
  Download, 
  Upload, 
  RefreshCw, 
  Share2, 
  Atom, 
  Scissors, 
  Grid, 
  Link, 
  Unlink, 
  ChevronDown, 
  ChevronUp,
  Trophy,
  Award
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { CURATED_MOLECULES } from './moleculeData';
import { 
  AtomNode, 
  BondEdge, 
  BuilderToolMode, 
  DisplayStyle, 
  ELEMENT_REGISTRY, 
  ElementSymbol, 
  MeasurementMode, 
  MeasurementResult, 
  MoleculeStructure, 
  OrbitalType, 
  SurfaceStyle, 
  getElementData 
} from './types';
import { 
  calculateAngle, 
  calculateDihedral, 
  calculateDistance, 
  calculateHillFormula, 
  calculateMolarMass, 
  convertAtomsToRawXyz, 
  validateMoleculeValence, 
  autoSaturateHydrogens, 
  stripAllHydrogens, 
  relaxVseprForces, 
  autoDetectBonds 
} from './vseprPhysics';
import { FRAGMENT_TEMPLATES, FragmentTemplate, insertFragment } from './fragmentTemplates';
import { parseSmiles, generateSmiles, parseXyz, exportToXyz, exportToMolfile } from './smilesEngine';
import { MOLECULE_CHALLENGES, MoleculeChallenge, validateChallengeCompletion } from './moleculeChallenges';
import { MoleculeViewer3D } from './MoleculeViewer3D';
import { OrbitalPanel } from './OrbitalPanel';
import { PeriodicTableElementPicker } from './PeriodicTableElementPicker';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';

export const MoleculeStudioScreen: React.FC = () => {
  // Active Preset & Tab: 3D Builder FIRST, HOMO-LUMO LAST
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('water');
  const [activeTab, setActiveTab] = useState<'builder' | 'challenges' | 'directory' | 'measure' | 'homolumo'>('builder');

  // Display & 3Dmol Configuration
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>('ballAndStick');
  const [surfaceStyle, setSurfaceStyle] = useState<SurfaceStyle>('none');
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // HOMO-LUMO Quantum State: OFF by default
  const [orbitalType, setOrbitalType] = useState<OrbitalType>('NONE');
  const [orbitalIsoval, setOrbitalIsoval] = useState<number>(0.04);
  const [orbitalOpacity, setOrbitalOpacity] = useState<number>(0.80);

  // Measurement State
  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>('none');
  const [selectedAtomIndices, setSelectedAtomIndices] = useState<number[]>([]);
  const [measurementHistory, setMeasurementHistory] = useState<MeasurementResult[]>([]);

  // 3D Builder State: Active by default
  const [isBuilderActive, setIsBuilderActive] = useState<boolean>(true);
  const [builderAtoms, setBuilderAtoms] = useState<AtomNode[]>([
    { id: 'b-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 },
  ]);
  const [builderBonds, setBuilderBonds] = useState<BondEdge[]>([]);
  const [builderSelectedElement, setBuilderSelectedElement] = useState<string>('C');
  const [builderToolMode, setBuilderToolMode] = useState<BuilderToolMode>('addAtom');
  const [builderBondOrder, setBuilderBondOrder] = useState<1 | 2 | 3>(1);
  const [selectedBuilderAtomIndex, setSelectedBuilderAtomIndex] = useState<number | null>(0);
  const [bondFirstAtomIndex, setBondFirstAtomIndex] = useState<number | null>(null);

  // Connect Bond Dropdown States
  const [connectFromAtomIndex, setConnectFromAtomIndex] = useState<number>(0);
  const [connectToAtomIndex, setConnectToAtomIndex] = useState<number>(0);

  // Periodic Table Picker Modal
  const [showPeriodicPicker, setShowPeriodicPicker] = useState<boolean>(false);

  // Collapsible sections
  const [showAtomRoster, setShowAtomRoster] = useState<boolean>(false);
  const [showBondRoster, setShowBondRoster] = useState<boolean>(false);
  const [showIoDrawer, setShowIoDrawer] = useState<boolean>(false);

  // Chemical Data IO State (SMILES / XYZ / Molfile)
  const [ioTab, setIoTab] = useState<'smiles' | 'xyz' | 'mol'>('smiles');
  const [smilesInputText, setSmilesInputText] = useState<string>('CCO');
  const [xyzInputText, setXyzInputText] = useState<string>('');
  const [ioNotification, setIoNotification] = useState<string | null>(null);
  const [builderSavedMessage, setBuilderSavedMessage] = useState<string | null>(null);

  // Search filter for presets
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Currently Active Molecule Definition
  const activeCurated = useMemo(() => {
    return CURATED_MOLECULES.find((m) => m.id === selectedMoleculeId) || CURATED_MOLECULES[0];
  }, [selectedMoleculeId]);

  // Curriculum Challenge Levels State
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('challenge-water');
  const [challengeVictoryMessage, setChallengeVictoryMessage] = useState<string | null>(null);

  const selectedChallenge = useMemo(() => {
    return MOLECULE_CHALLENGES.find((c) => c.id === selectedChallengeId) || MOLECULE_CHALLENGES[0];
  }, [selectedChallengeId]);

  // Current active raw Molfile (V2000 with explicit bond connectivity & orders 1/2/3)
  const currentRawMolfile = useMemo(() => {
    if (isBuilderActive) {
      return exportToMolfile(builderAtoms, builderBonds, 'User Constructed Molecule');
    }
    return exportToMolfile(activeCurated.atoms, activeCurated.bonds, activeCurated.name);
  }, [isBuilderActive, builderAtoms, builderBonds, activeCurated]);

  // Current active raw XYZ string for 3Dmol (fallback)
  const currentRawXyz = useMemo(() => {
    if (isBuilderActive) {
      return convertAtomsToRawXyz(builderAtoms, 'User Constructed Molecule');
    }
    return activeCurated.raw_xyz;
  }, [isBuilderActive, builderAtoms, activeCurated]);

  // Current active atoms
  const currentAtoms = useMemo(() => {
    if (isBuilderActive) return builderAtoms;
    return activeCurated.atoms;
  }, [isBuilderActive, builderAtoms, activeCurated]);

  // Current validation for builder
  const builderValidation = useMemo(() => {
    return validateMoleculeValence(builderAtoms, builderBonds);
  }, [builderAtoms, builderBonds]);

  // Challenge live validation evaluation
  const challengeValidation = useMemo(() => {
    return validateChallengeCompletion(
      builderAtoms,
      builderBonds,
      measurementHistory,
      selectedChallenge
    );
  }, [builderAtoms, builderBonds, measurementHistory, selectedChallenge]);

  // Current SMILES string for active molecule
  const currentSmiles = useMemo(() => {
    if (isBuilderActive) {
      return generateSmiles(builderAtoms, builderBonds);
    }
    return generateSmiles(activeCurated.atoms, activeCurated.bonds);
  }, [isBuilderActive, builderAtoms, builderBonds, activeCurated]);

  // Selected element metadata
  const selectedElementData = useMemo(() => {
    return getElementData(builderSelectedElement);
  }, [builderSelectedElement]);

  // Filtered molecules directory
  const filteredMolecules = useMemo(() => {
    return CURATED_MOLECULES.filter((m) => {
      const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.geometry.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  // Notification helper
  const triggerIoNotification = (msg: string) => {
    setIoNotification(msg);
    setTimeout(() => setIoNotification(null), 3500);
  };

  // ==========================================
  // ATOM CLICK & TOOL INTERACTION LOGIC
  // ==========================================
  const handleAtomSelect = (atomIndex: number) => {
    if (measurementMode !== 'none') {
      handleMeasurementPick(atomIndex);
      return;
    }

    if (isBuilderActive) {
      if (builderToolMode === 'addAtom') {
        handleAddAtomAttachedTo(atomIndex);
      } else if (builderToolMode === 'drawBond') {
        handleBondToolPick(atomIndex);
      } else if (builderToolMode === 'replaceElement') {
        handleReplaceElement(atomIndex);
      } else if (builderToolMode === 'erase') {
        handleEraseAtom(atomIndex);
      } else if (builderToolMode === 'select') {
        soundEngine.playTap();
        setSelectedBuilderAtomIndex(selectedBuilderAtomIndex === atomIndex ? null : atomIndex);
      }
    } else {
      soundEngine.playTap();
      setSelectedAtomIndices([atomIndex]);
    }
  };

  // Empty canvas click handler: adds a free atom or clears selection
  const handleCanvasEmptyClick = () => {
    if (isBuilderActive) {
      if (builderToolMode === 'addAtom') {
        handleAddFreeAtom();
      } else {
        setSelectedBuilderAtomIndex(null);
        setBondFirstAtomIndex(null);
      }
    }
  };

  const handleMeasurementPick = (atomIndex: number) => {
    let next = [...selectedAtomIndices];
    if (next.includes(atomIndex)) {
      next = next.filter((i) => i !== atomIndex);
    } else {
      next.push(atomIndex);
    }

    if (measurementMode === 'distance' && next.length === 2) {
      const a1 = currentAtoms[next[0]];
      const a2 = currentAtoms[next[1]];
      if (a1 && a2) {
        const dist = calculateDistance(a1, a2);
        const result: MeasurementResult = {
          id: `dist-${Date.now()}`,
          type: 'distance',
          atomIndices: next,
          atomSymbols: [a1.symbol, a2.symbol],
          value: dist,
          unit: 'Å',
          label: `Bond Distance (${a1.symbol}${next[0] + 1}—${a2.symbol}${next[1] + 1})`,
        };
        setMeasurementHistory((prev) => [result, ...prev]);
        soundEngine.playSuccess();
      }
    } else if (measurementMode === 'angle' && next.length === 3) {
      const a1 = currentAtoms[next[0]];
      const a2 = currentAtoms[next[1]]; // center
      const a3 = currentAtoms[next[2]];
      if (a1 && a2 && a3) {
        const ang = calculateAngle(a1, a2, a3);
        const result: MeasurementResult = {
          id: `ang-${Date.now()}`,
          type: 'angle',
          atomIndices: next,
          atomSymbols: [a1.symbol, a2.symbol, a3.symbol],
          value: ang,
          unit: '°',
          label: `VSEPR Angle (${a1.symbol}${next[0] + 1}—${a2.symbol}${next[1] + 1}—${a3.symbol}${next[2] + 1})`,
        };
        setMeasurementHistory((prev) => [result, ...prev]);
        soundEngine.playSuccess();
      }
    } else if (measurementMode === 'dihedral' && next.length === 4) {
      const a1 = currentAtoms[next[0]];
      const a2 = currentAtoms[next[1]];
      const a3 = currentAtoms[next[2]];
      const a4 = currentAtoms[next[3]];
      if (a1 && a2 && a3 && a4) {
        const dih = calculateDihedral(a1, a2, a3, a4);
        const result: MeasurementResult = {
          id: `dih-${Date.now()}`,
          type: 'dihedral',
          atomIndices: next,
          atomSymbols: [a1.symbol, a2.symbol, a3.symbol, a4.symbol],
          value: dih,
          unit: '°',
          label: `Torsion (${a1.symbol}${next[0] + 1}—${a2.symbol}${next[1] + 1}—${a3.symbol}${next[2] + 1}—${a4.symbol}${next[3] + 1})`,
        };
        setMeasurementHistory((prev) => [result, ...prev]);
        soundEngine.playSuccess();
      }
    }

    const maxPicks = measurementMode === 'distance' ? 2 : measurementMode === 'angle' ? 3 : 4;
    if (next.length >= maxPicks) {
      setSelectedAtomIndices([]);
    } else {
      setSelectedAtomIndices(next);
    }
  };

  // ==========================================
  // DIRECT ATOM ADDITION & SPOUTING
  // ==========================================

  // Primary Button: Add chosen element to molecule (bonded to selected or placed at next position)
  const handleAddChosenElementDirect = () => {
    soundEngine.playTap();
    if (selectedBuilderAtomIndex !== null && builderAtoms[selectedBuilderAtomIndex]) {
      // Sprout attached to selected atom
      handleAddAtomAttachedTo(selectedBuilderAtomIndex);
    } else if (builderAtoms.length > 0) {
      // Attach to latest atom
      handleAddAtomAttachedTo(builderAtoms.length - 1);
    } else {
      // First atom
      setBuilderAtoms([{ id: 'b-0', index: 0, symbol: builderSelectedElement, x: 0, y: 0, z: 0 }]);
      setSelectedBuilderAtomIndex(0);
      triggerIoNotification(`Added initial ${builderSelectedElement} atom`);
    }
  };

  // Sprout Atom attached to a host atom
  const handleAddAtomAttachedTo = (hostIndex: number) => {
    const host = builderAtoms[hostIndex];
    if (!host) return;

    soundEngine.playTap();
    const newIdx = builderAtoms.length;
    const hostEl = getElementData(host.symbol);
    const newEl = getElementData(builderSelectedElement);
    const targetBondDist = (hostEl.covalentRadius + newEl.covalentRadius) * 1.25;

    // Calculate intelligent 3D offset pointing away from existing bonds
    const existingNeighbors = builderBonds
      .filter((b) => b.from === host.id || b.to === host.id)
      .map((b) => (b.from === host.id ? b.to : b.from));

    let offsetX = 0, offsetY = targetBondDist, offsetZ = 0;
    if (existingNeighbors.length > 0) {
      const neighborAtoms = builderAtoms.filter((a) => existingNeighbors.includes(a.id));
      let sumDx = 0, sumDy = 0, sumDz = 0;
      for (const nb of neighborAtoms) {
        sumDx += nb.x - host.x;
        sumDy += nb.y - host.y;
        sumDz += nb.z - host.z;
      }
      const len = Math.sqrt(sumDx * sumDx + sumDy * sumDy + sumDz * sumDz) || 1;
      // Invert direction and apply slight jitter to avoid collinear stagnation
      offsetX = (-sumDx / len) * targetBondDist + (Math.random() - 0.5) * 0.4;
      offsetY = (-sumDy / len) * targetBondDist + (Math.random() - 0.5) * 0.4;
      offsetZ = (-sumDz / len) * targetBondDist + (Math.random() - 0.5) * 0.4;
    } else {
      offsetX = (Math.random() - 0.5) * 0.5;
      offsetY = targetBondDist;
      offsetZ = (Math.random() - 0.5) * 0.5;
    }

    const newAtomId = `b-${Date.now()}-${newIdx}`;
    const newAtom: AtomNode = {
      id: newAtomId,
      index: newIdx,
      symbol: builderSelectedElement,
      x: Math.round((host.x + offsetX) * 1000) / 1000,
      y: Math.round((host.y + offsetY) * 1000) / 1000,
      z: Math.round((host.z + offsetZ) * 1000) / 1000,
    };

    const newBond: BondEdge = {
      id: `bond-${Date.now()}-${builderBonds.length}`,
      from: host.id,
      to: newAtomId,
      order: builderBondOrder,
    };

    const updatedA = [...builderAtoms, newAtom];
    const updatedB = [...builderBonds, newBond];
    const relaxed = relaxVseprForces(updatedA, updatedB, 30);
    setBuilderAtoms(relaxed);
    setBuilderBonds(updatedB);
    setSelectedBuilderAtomIndex(newIdx);
    triggerIoNotification(`Added ${builderSelectedElement} bonded to Atom #${hostIndex + 1}`);
  };

  // Add Free Floating Atom
  const handleAddFreeAtom = () => {
    soundEngine.playTap();
    const newIdx = builderAtoms.length;
    let maxX = 0;
    for (const a of builderAtoms) {
      if (a.x > maxX) maxX = a.x;
    }
    const newAtom: AtomNode = {
      id: `b-free-${Date.now()}-${newIdx}`,
      index: newIdx,
      symbol: builderSelectedElement,
      x: Math.round((maxX + 2.0) * 1000) / 1000,
      y: Math.round((Math.random() - 0.5) * 1.5 * 1000) / 1000,
      z: Math.round((Math.random() - 0.5) * 1.5 * 1000) / 1000,
    };
    setBuilderAtoms([...builderAtoms, newAtom]);
    setSelectedBuilderAtomIndex(newIdx);
    triggerIoNotification(`Added free ${builderSelectedElement} atom`);
  };

  // ==========================================
  // BOND CREATION & CONNECTION SUITE
  // ==========================================

  // 1. Connect Bond between 2 atoms from UI dropdowns
  const handleConnectBondsDropdown = () => {
    if (connectFromAtomIndex === connectToAtomIndex) {
      triggerIoNotification(`Select two different atoms to connect`);
      return;
    }
    const a1 = builderAtoms[connectFromAtomIndex];
    const a2 = builderAtoms[connectToAtomIndex];
    if (!a1 || !a2) return;

    soundEngine.playTap();
    const existingIndex = builderBonds.findIndex(
      (b) => (b.from === a1.id && b.to === a2.id) || (b.from === a2.id && b.to === a1.id)
    );

    let nextBonds = [...builderBonds];
    if (existingIndex !== -1) {
      nextBonds[existingIndex] = { ...nextBonds[existingIndex], order: builderBondOrder };
      triggerIoNotification(`Updated bond #${existingIndex + 1} to ${builderBondOrder === 3 ? 'Triple (≡)' : builderBondOrder === 2 ? 'Double (=)' : 'Single (—)'}`);
    } else {
      nextBonds.push({
        id: `bond-${Date.now()}-${builderBonds.length}`,
        from: a1.id,
        to: a2.id,
        order: builderBondOrder,
      });
      triggerIoNotification(`Connected ${a1.symbol}${connectFromAtomIndex + 1}—${a2.symbol}${connectToAtomIndex + 1}`);
    }

    const relaxed = relaxVseprForces(builderAtoms, nextBonds, 30);
    setBuilderAtoms(relaxed);
    setBuilderBonds(nextBonds);
  };

  // 2. Interactive Canvas Click Bond Tool (Atom 1 -> Atom 2)
  const handleBondToolPick = (atomIndex: number) => {
    if (bondFirstAtomIndex === null) {
      soundEngine.playTap();
      setBondFirstAtomIndex(atomIndex);
      return;
    }

    if (bondFirstAtomIndex === atomIndex) {
      setBondFirstAtomIndex(null);
      return;
    }

    const a1 = builderAtoms[bondFirstAtomIndex];
    const a2 = builderAtoms[atomIndex];
    if (!a1 || !a2) {
      setBondFirstAtomIndex(null);
      return;
    }

    soundEngine.playTap();
    const existingIndex = builderBonds.findIndex(
      (b) => (b.from === a1.id && b.to === a2.id) || (b.from === a2.id && b.to === a1.id)
    );

    let nextBonds = [...builderBonds];
    if (existingIndex !== -1) {
      const cur = nextBonds[existingIndex];
      if (cur.order === 1) {
        nextBonds[existingIndex] = { ...cur, order: 2 };
        triggerIoNotification(`Bond order increased to Double (=)`);
      } else if (cur.order === 2) {
        nextBonds[existingIndex] = { ...cur, order: 3 };
        triggerIoNotification(`Bond order increased to Triple (≡)`);
      } else {
        nextBonds.splice(existingIndex, 1);
        triggerIoNotification(`Bond removed`);
      }
    } else {
      nextBonds.push({
        id: `bond-${Date.now()}-${builderBonds.length}`,
        from: a1.id,
        to: a2.id,
        order: builderBondOrder,
      });
      triggerIoNotification(`Connected ${a1.symbol}${bondFirstAtomIndex + 1} with ${a2.symbol}${atomIndex + 1}`);
    }

    const relaxed = relaxVseprForces(builderAtoms, nextBonds, 30);
    setBuilderAtoms(relaxed);
    setBuilderBonds(nextBonds);
    setBondFirstAtomIndex(null);
  };

  // 3. Auto-Detect Bonds (Radii Overlap)
  const handleAutoDetectBonds = () => {
    soundEngine.playFlameWhoosh();
    const detected = autoDetectBonds(builderAtoms);
    setBuilderBonds(detected);
    const relaxed = relaxVseprForces(builderAtoms, detected, 40);
    setBuilderAtoms(relaxed);
    soundEngine.playSuccess();
    triggerIoNotification(`Auto-detected ${detected.length} bonds from 3D geometry!`);
  };

  // 4. Delete specific bond
  const handleDeleteBond = (bondId: string) => {
    soundEngine.playTap();
    const nextBonds = builderBonds.filter((b) => b.id !== bondId);
    setBuilderBonds(nextBonds);
    triggerIoNotification(`Deleted bond`);
  };

  // ==========================================
  // ELEMENT MUTATION & ATOM DELETION
  // ==========================================
  const handleReplaceElement = (atomIndex: number) => {
    soundEngine.playTap();
    const updated = builderAtoms.map((a, idx) => {
      if (idx === atomIndex) {
        return { ...a, symbol: builderSelectedElement };
      }
      return a;
    });
    setBuilderAtoms(updated);
    triggerIoNotification(`Atom #${atomIndex + 1} changed to ${builderSelectedElement}`);
  };

  const handleEraseAtom = (atomIndex: number) => {
    const target = builderAtoms[atomIndex];
    if (!target) return;

    soundEngine.playTap();
    const filteredAtoms = builderAtoms
      .filter((_, idx) => idx !== atomIndex)
      .map((a, idx) => ({ ...a, index: idx }));

    const filteredBonds = builderBonds.filter(
      (b) => b.from !== target.id && b.to !== target.id
    );

    if (filteredAtoms.length === 0) {
      setBuilderAtoms([{ id: 'b-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 }]);
      setBuilderBonds([]);
    } else {
      setBuilderAtoms(filteredAtoms);
      setBuilderBonds(filteredBonds);
    }
    setSelectedBuilderAtomIndex(null);
    triggerIoNotification(`Erased atom and its bonds`);
  };

  // ==========================================
  // TEMPLATES & CHEMISTRY CLEAN-UP
  // ==========================================
  const handleInsertTemplate = (template: FragmentTemplate) => {
    soundEngine.playTap();
    const res = insertFragment(
      builderAtoms, 
      builderBonds, 
      template, 
      selectedBuilderAtomIndex ?? undefined
    );
    const relaxed = relaxVseprForces(res.newAtoms, res.newBonds, 45);
    setBuilderAtoms(relaxed);
    setBuilderBonds(res.newBonds);
    setSelectedBuilderAtomIndex(null);
    triggerIoNotification(`Inserted ${template.name}`);
  };

  const handleAutoSaturateH = () => {
    soundEngine.playFlameWhoosh();
    const res = autoSaturateHydrogens(builderAtoms, builderBonds);
    const relaxed = relaxVseprForces(res.updatedAtoms, res.updatedBonds, 50);
    setBuilderAtoms(relaxed);
    setBuilderBonds(res.updatedBonds);
    soundEngine.playSuccess();
    triggerIoNotification(`Valences saturated (+${res.addedCount} Hydrogens)`);
  };

  const handleStripHydrogens = () => {
    soundEngine.playTap();
    const res = stripAllHydrogens(builderAtoms, builderBonds);
    const relaxed = relaxVseprForces(res.updatedAtoms, res.updatedBonds, 30);
    setBuilderAtoms(relaxed);
    setBuilderBonds(res.updatedBonds);
    triggerIoNotification(`Stripped ${res.removedCount} Hydrogens (Skeletal framework)`);
  };

  const handleClean3D = () => {
    soundEngine.playFlameWhoosh();
    const relaxed = relaxVseprForces(builderAtoms, builderBonds, 80);
    setBuilderAtoms(relaxed);
    soundEngine.playSuccess();
    triggerIoNotification(`VSEPR Force-Field Minimized (80 passes)`);
  };

  const handleClearBuilder = () => {
    soundEngine.playTap();
    setBuilderAtoms([{ id: 'b-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 }]);
    setBuilderBonds([]);
    setSelectedBuilderAtomIndex(0);
    setBondFirstAtomIndex(null);
    triggerIoNotification(`Canvas reset to single Carbon atom`);
  };

  const handleLoadPresetToBuilder = (presetId?: string) => {
    const target = CURATED_MOLECULES.find((m) => m.id === (presetId || selectedMoleculeId));
    if (!target) return;
    soundEngine.playTap();
    setBuilderAtoms(JSON.parse(JSON.stringify(target.atoms)));
    setBuilderBonds(JSON.parse(JSON.stringify(target.bonds)));
    setIsBuilderActive(true);
    setActiveTab('builder');
    setSelectedBuilderAtomIndex(0);
    setBondFirstAtomIndex(null);
    triggerIoNotification(`Loaded ${target.name} (${target.formula}) into 3D Builder`);
  };

  // ==========================================
  // DATA INTERCHANGE (SMILES / XYZ / MOL)
  // ==========================================
  const handleLoadSmiles = () => {
    if (!smilesInputText.trim()) return;
    soundEngine.playFlameWhoosh();
    const parsed = parseSmiles(smilesInputText.trim());
    setBuilderAtoms(parsed.atoms);
    setBuilderBonds(parsed.bonds);
    setIsBuilderActive(true);
    setActiveTab('builder');
    soundEngine.playSuccess();
    triggerIoNotification(`Loaded SMILES: ${smilesInputText.trim()}`);
  };

  const handleCopySmiles = () => {
    soundEngine.playTap();
    navigator.clipboard.writeText(currentSmiles).catch(() => {});
    triggerIoNotification(`SMILES copied to clipboard!`);
  };

  const handleLoadXyz = () => {
    if (!xyzInputText.trim()) return;
    soundEngine.playFlameWhoosh();
    const parsed = parseXyz(xyzInputText.trim());
    if (parsed.atoms.length > 0) {
      setBuilderAtoms(parsed.atoms);
      setBuilderBonds(parsed.bonds);
      setIsBuilderActive(true);
      setActiveTab('builder');
      soundEngine.playSuccess();
      triggerIoNotification(`Imported ${parsed.atoms.length} atoms from XYZ`);
    } else {
      triggerIoNotification(`Invalid XYZ text format`);
    }
  };

  const handleCopyXyz = () => {
    soundEngine.playTap();
    const xyz = exportToXyz(currentAtoms, isBuilderActive ? 'User Molecule' : activeCurated.name);
    navigator.clipboard.writeText(xyz).catch(() => {});
    triggerIoNotification(`XYZ text copied to clipboard!`);
  };

  const handleDownloadXyz = () => {
    soundEngine.playTap();
    const xyz = exportToXyz(currentAtoms, isBuilderActive ? 'User Molecule' : activeCurated.name);
    const blob = new Blob([xyz], { type: 'chemical/x-xyz' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(isBuilderActive ? 'custom_molecule' : activeCurated.id)}.xyz`;
    a.click();
    URL.revokeObjectURL(url);
    triggerIoNotification(`Downloaded .xyz file`);
  };

  const handleCopyMolfile = () => {
    soundEngine.playTap();
    const mol = exportToMolfile(
      currentAtoms, 
      isBuilderActive ? builderBonds : activeCurated.bonds, 
      isBuilderActive ? 'Custom Molecule' : activeCurated.name
    );
    navigator.clipboard.writeText(mol).catch(() => {});
    triggerIoNotification(`MDL Molfile (V2000) copied!`);
  };

  const handleSaveCustomToJournal = () => {
    if (!builderValidation.isValid) {
      soundEngine.playError();
      return;
    }
    soundEngine.playVictoryFanfare();
    progressAdapter.completeActivity(`custom_molecule_${Date.now()}`, 100, 50);
    setBuilderSavedMessage(`Saved ${builderValidation.formula} to Scholar Journal (+50 XP)!`);
    setTimeout(() => setBuilderSavedMessage(null), 4000);
  };

  const handleVerifyChallenge = () => {
    if (challengeValidation.isComplete) {
      soundEngine.playVictoryFanfare();
      progressAdapter.completeActivity(selectedChallenge.id, 100, selectedChallenge.xpReward);
      setChallengeVictoryMessage(`VICTORY! Completed Level ${selectedChallenge.level}: ${selectedChallenge.name} (+${selectedChallenge.xpReward} XP)!`);
      setTimeout(() => setChallengeVictoryMessage(null), 5000);
    } else {
      soundEngine.playError();
      triggerIoNotification(challengeValidation.feedback);
    }
  };

  const handleLoadChallengeStarter = (challenge: MoleculeChallenge) => {
    soundEngine.playTap();
    if (challenge.id === 'challenge-water') {
      setBuilderAtoms([{ id: 'b-0', index: 0, symbol: 'O', x: 0, y: 0, z: 0 }]);
      setBuilderBonds([]);
      setBuilderSelectedElement('H');
    } else if (challenge.id === 'challenge-co2') {
      setBuilderAtoms([{ id: 'b-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 }]);
      setBuilderBonds([]);
      setBuilderSelectedElement('O');
    } else if (challenge.id === 'challenge-ammonia') {
      setBuilderAtoms([{ id: 'b-0', index: 0, symbol: 'N', x: 0, y: 0, z: 0 }]);
      setBuilderBonds([]);
      setBuilderSelectedElement('H');
    } else if (challenge.id === 'challenge-methane') {
      setBuilderAtoms([{ id: 'b-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 }]);
      setBuilderBonds([]);
      setBuilderSelectedElement('H');
    } else if (challenge.id === 'challenge-ethene') {
      setBuilderAtoms([
        { id: 'b-0', index: 0, symbol: 'C', x: -0.67, y: 0, z: 0 },
        { id: 'b-1', index: 1, symbol: 'C', x: 0.67, y: 0, z: 0 },
      ]);
      setBuilderBonds([{ id: 'b-bond-0', from: 'b-0', to: 'b-1', order: 2 }]);
      setBuilderSelectedElement('H');
    } else if (challenge.id === 'challenge-benzene') {
      const tmpl = FRAGMENT_TEMPLATES.find((t) => t.id === 'benzene');
      if (tmpl) {
        const res = insertFragment([], [], tmpl);
        setBuilderAtoms(res.newAtoms);
        setBuilderBonds(res.newBonds);
      }
      setBuilderSelectedElement('C');
    }
    setIsBuilderActive(true);
    setActiveTab('builder');
    setSelectedBuilderAtomIndex(0);
    setBondFirstAtomIndex(null);
    triggerIoNotification(`Loaded Level ${challenge.level} starter for ${challenge.name}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden space-y-3 animate-in fade-in select-none">
      {/* Top Header Deck */}
      <header className="px-5 py-3 rounded-2xl border-2 border-slate-200/90 bg-white flex flex-wrap items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00C2D1] text-white flex items-center justify-center shadow-md shadow-teal-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-montserrat font-extrabold text-lg text-[#0B1F2A] leading-tight">
                3D Molecule Studio & Builder
              </h1>
              <Badge variant="accent" size="sm">ArgusLab & MolDraw Grade</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              100% IUPAC Geometry • Left-click: 360° Rotate • <span className="text-[#00C2D1] font-bold">Right-click / Drag: Center Anywhere</span>
            </p>
          </div>
        </div>

        {/* Quick Presets Pills & Builder Switch */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-montserrat font-bold text-slate-400 hidden sm:inline">
            Quick Preset:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-sm sm:max-w-md pb-1 sm:pb-0">
            {[
              { id: 'water', label: 'H₂O Water' },
              { id: 'ammonia', label: 'NH₃ Ammonia' },
              { id: 'methane', label: 'CH₄ Methane' },
              { id: 'ethene', label: 'C₂H₄ Ethene' },
              { id: 'benzene', label: 'C₆H₆ Benzene' },
              { id: 'aspirin', label: 'Aspirin' },
            ].map((p) => {
              const isSelected = !isBuilderActive && selectedMoleculeId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setIsBuilderActive(false);
                    setSelectedMoleculeId(p.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00C2D1] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Studio Deck: 2-Column Responsive Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Column (68% width): Full-Height 3D WebGL Canvas */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-0 relative">
          <MoleculeViewer3D
            rawMolfile={currentRawMolfile}
            rawXyz={currentRawXyz}
            atoms={currentAtoms}
            displayStyle={displayStyle}
            onDisplayStyleChange={setDisplayStyle}
            surfaceStyle={surfaceStyle}
            onSurfaceStyleChange={setSurfaceStyle}
            measurementMode={measurementMode}
            onMeasurementModeChange={setMeasurementMode}
            selectedAtomIndices={
              measurementMode !== 'none'
                ? selectedAtomIndices
                : isBuilderActive && selectedBuilderAtomIndex !== null
                ? [selectedBuilderAtomIndex]
                : isBuilderActive && bondFirstAtomIndex !== null
                ? [bondFirstAtomIndex]
                : []
            }
            onAtomSelect={handleAtomSelect}
            onCanvasEmptyClick={handleCanvasEmptyClick}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(!showLabels)}
            orbitalType={orbitalType}
            orbitalIsoval={orbitalIsoval}
            orbitalOpacity={orbitalOpacity}
            homoLobes={activeCurated.homoLobes}
            lumoLobes={activeCurated.lumoLobes}
            activeMeasurement={measurementHistory[0] || null}
            formula={isBuilderActive ? builderValidation.formula : activeCurated.formula}
            compoundName={isBuilderActive ? 'Custom Molecule' : activeCurated.name}
            activeToolMode={isBuilderActive ? builderToolMode : undefined}
          />

          {/* Builder Mode Floating Tool HUD Banner */}
          {isBuilderActive && (
            <div className="absolute top-16 left-4 z-20 pointer-events-none">
              <div className="px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-slate-200 shadow-md text-xs font-montserrat text-slate-700 flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: selectedElementData.hexColor }}
                />
                <span>
                  Active: <strong>{selectedElementData.symbol} ({selectedElementData.name})</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[#00C2D1] font-bold">
                  {selectedBuilderAtomIndex !== null
                    ? `Selected Atom #${selectedBuilderAtomIndex + 1}`
                    : 'Click atom to attach / select'}
                </span>
              </div>
            </div>
          )}

          {/* Floating IO Toast Notification */}
          {ioNotification && (
            <div className="absolute top-16 right-4 z-30 px-3.5 py-2 rounded-2xl bg-[#0B1F2A] text-white text-xs font-montserrat font-bold shadow-xl animate-in fade-in flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00C2D1]" />
              <span>{ioNotification}</span>
            </div>
          )}
        </div>

        {/* Right Column (32% width): Scientific Tool Station Deck */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-0 rounded-2xl border-2 border-slate-200/90 bg-white shadow-xs overflow-hidden">
          {/* Station Mode Switcher Tabs: 3D BUILDER FIRST, CHALLENGES SECOND, HOMO-LUMO LAST */}
          <div className="p-2 border-b-2 border-slate-100 bg-slate-50/80 grid grid-cols-5 gap-1 shrink-0">
            {/* TAB 1: 3D BUILDER (FIRST!) */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setIsBuilderActive(true);
                setActiveTab('builder');
              }}
              className={`p-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer text-center flex flex-col items-center gap-1 ${
                activeTab === 'builder'
                  ? 'bg-[#00C2D1] text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#0B1F2A]'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="text-[9px]">Builder</span>
            </button>

            {/* TAB 2: GAME LEVELS */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setIsBuilderActive(true);
                setActiveTab('challenges');
              }}
              className={`p-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer text-center flex flex-col items-center gap-1 ${
                activeTab === 'challenges'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#0B1F2A]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="text-[9px]">Levels</span>
            </button>

            {/* TAB 3: MEASURE */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setActiveTab('measure');
              }}
              className={`p-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer text-center flex flex-col items-center gap-1 ${
                activeTab === 'measure'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#0B1F2A]'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span className="text-[9px]">Measure</span>
            </button>

            {/* TAB 4: DIRECTORY */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setActiveTab('directory');
              }}
              className={`p-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer text-center flex flex-col items-center gap-1 ${
                activeTab === 'directory'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#0B1F2A]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="text-[9px]">Library</span>
            </button>

            {/* TAB 5: HOMO-LUMO (LAST!) */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setActiveTab('homolumo');
              }}
              className={`p-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer text-center flex flex-col items-center gap-1 ${
                activeTab === 'homolumo'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#0B1F2A]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[9px]">Quantum</span>
            </button>
          </div>

          {/* Tab Content Body (Scrollable with Zero Page Scroll) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ========================================================= */}
            {/* TAB 1: 3D MOLECULAR BUILDER (MolDraw & ArgusLab Grade) */}
            {/* ========================================================= */}
            {activeTab === 'builder' && (
              <div className="space-y-4 animate-in fade-in">
                {/* 1. DIRECT ACTION: Add Chosen Element to Molecule */}
                <div className="p-3.5 rounded-2xl bg-teal-50/70 border-2 border-teal-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-black/20"
                        style={{ backgroundColor: selectedElementData.hexColor }}
                      />
                      <span className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">
                        Active: {selectedElementData.symbol} ({selectedElementData.name})
                      </span>
                    </div>
                    <Badge variant="accent" size="sm">Z={selectedElementData.atomicNumber}</Badge>
                  </div>

                  {/* Primary Add Button (Guarantees user can add atom immediately!) */}
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={handleAddChosenElementDirect}
                    className="w-full font-montserrat font-extrabold shadow-sm"
                  >
                    + ADD {selectedElementData.symbol.toUpperCase()} ATOM TO MOLECULE
                  </Button>

                  {/* Full Periodic Table Picker Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setShowPeriodicPicker(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-white border-2 border-[#00C2D1] text-[#008E9B] hover:bg-teal-50 text-xs font-montserrat font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Grid className="w-4 h-4" />
                    <span>Browse Whole Periodic Table (All 118 Elements)</span>
                  </button>
                </div>

                {/* 2. Common Elements Fast Bar */}
                <div className="space-y-1.5">
                  <span className="text-xs font-montserrat font-extrabold text-slate-700 block">
                    Quick Organic & Inorganic Elements:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['C', 'H', 'O', 'N', 'Cl', 'F', 'Br', 'I', 'S', 'P', 'B', 'Si', 'Fe', 'Pt', 'Cu', 'Au', 'Na', 'Ca'].map((sym) => {
                      const data = getElementData(sym);
                      const isSel = builderSelectedElement.toLowerCase() === sym.toLowerCase();
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => {
                            soundEngine.playElementPip(data.atomicNumber);
                            setBuilderSelectedElement(sym);
                          }}
                          className={`px-2.5 py-1 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSel
                              ? 'border-[#00C2D1] bg-teal-50 text-[#0B1F2A] shadow-xs font-bold ring-1 ring-[#00C2D1]'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: data.hexColor }}
                          />
                          <span className="font-montserrat text-xs">{sym}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Connect Bonds Suite (Solves "not able to draw bond between them") */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-montserrat font-extrabold text-slate-700 flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5 text-[#00C2D1]" />
                      <span>Connect Atoms / Draw Bonds:</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {builderBonds.length} active bonds
                    </span>
                  </div>

                  {/* Connect From / To Dropdowns */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-montserrat font-bold text-slate-400 block mb-1">
                        FROM ATOM:
                      </label>
                      <select
                        value={connectFromAtomIndex}
                        onChange={(e) => setConnectFromAtomIndex(parseInt(e.target.value, 10))}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:outline-[#00C2D1]"
                      >
                        {builderAtoms.map((a, idx) => (
                          <option key={a.id} value={idx}>
                            #{idx + 1}: {a.symbol} ({a.x.toFixed(1)}, {a.y.toFixed(1)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-montserrat font-bold text-slate-400 block mb-1">
                        TO ATOM:
                      </label>
                      <select
                        value={connectToAtomIndex}
                        onChange={(e) => setConnectToAtomIndex(parseInt(e.target.value, 10))}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:outline-[#00C2D1]"
                      >
                        {builderAtoms.map((a, idx) => (
                          <option key={a.id} value={idx}>
                            #{idx + 1}: {a.symbol} ({a.x.toFixed(1)}, {a.y.toFixed(1)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bond Order Pills & Connect Action Button */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                      {([
                        { order: 1, label: 'Single (—)' },
                        { order: 2, label: 'Double (=)' },
                        { order: 3, label: 'Triple (≡)' },
                      ] as const).map((b) => (
                        <button
                          key={b.order}
                          type="button"
                          onClick={() => {
                            soundEngine.playTap();
                            setBuilderBondOrder(b.order);
                          }}
                          className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                            builderBondOrder === b.order
                              ? 'bg-[#00C2D1] text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Link className="w-3.5 h-3.5" />}
                      onClick={handleConnectBondsDropdown}
                      className="flex-1"
                    >
                      Connect
                    </Button>
                  </div>

                  {/* Auto-Detect Bonds Button */}
                  <button
                    type="button"
                    onClick={handleAutoDetectBonds}
                    className="w-full py-1.5 px-3 rounded-xl bg-white border border-slate-300 hover:border-[#00C2D1] hover:bg-teal-50/50 text-slate-700 text-xs font-montserrat font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    title="Automatically computes all chemical bonds based on covalent distance"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#00C2D1]" />
                    <span>Auto-Detect All Bonds (Radii Overlap)</span>
                  </button>
                </div>

                {/* 4. Canvas Drawing Tool Modes */}
                <div className="space-y-1.5">
                  <span className="text-xs font-montserrat font-extrabold text-slate-700 block">
                    Canvas Click Tool:
                  </span>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { mode: 'addAtom', label: 'Sprout', icon: Plus, title: 'Click atom to sprout new bonded atom' },
                      { mode: 'drawBond', label: 'Connect', icon: Share2, title: 'Click 1st atom then 2nd atom' },
                      { mode: 'replaceElement', label: 'Mutate', icon: RefreshCw, title: 'Click atom to mutate element' },
                      { mode: 'erase', label: 'Erase', icon: Trash2, title: 'Click atom to erase' },
                      { mode: 'select', label: 'Inspect', icon: Focus, title: 'Click atom to select' },
                    ].map((t) => {
                      const Icon = t.icon;
                      const isSel = builderToolMode === t.mode;
                      return (
                        <button
                          key={t.mode}
                          type="button"
                          onClick={() => {
                            soundEngine.playTap();
                            setBuilderToolMode(t.mode as BuilderToolMode);
                            setBondFirstAtomIndex(null);
                          }}
                          title={t.title}
                          className={`p-1.5 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            isSel
                              ? 'bg-[#00C2D1] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-[9px]">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Pre-Built Fragment & Ring Templates */}
                <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-montserrat font-extrabold text-slate-700">
                      Rings & Functional Templates:
                    </span>
                    {selectedBuilderAtomIndex !== null ? (
                      <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        Attaching to #{selectedBuilderAtomIndex + 1}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Click to insert</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {FRAGMENT_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleInsertTemplate(tmpl)}
                        title={tmpl.description}
                        className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-[#00C2D1] hover:bg-teal-50/50 text-[11px] font-montserrat font-bold text-slate-700 transition-all cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        <span>{tmpl.name}</span>
                        <span className="text-[10px] font-mono text-[#00C2D1]">({tmpl.formula})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Clean-up & Physics Relaxation Actions */}
                <div className="space-y-1.5">
                  <span className="text-xs font-montserrat font-extrabold text-slate-700 block">
                    VSEPR Physics & Geometry Optimization:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Zap className="w-3.5 h-3.5" />}
                      onClick={handleClean3D}
                      title="ArgusLab VSEPR force-field energy minimization (80 relaxation cycles)"
                    >
                      Clean 3D
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Wand2 className="w-3.5 h-3.5 text-teal-600" />}
                      onClick={handleAutoSaturateH}
                      title="Auto-saturate all unfilled valences with Hydrogens"
                    >
                      Auto-H
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Scissors className="w-3.5 h-3.5 text-amber-600" />}
                      onClick={handleStripHydrogens}
                      title="Remove all Hydrogens for clean skeletal backbone view"
                    >
                      Strip H
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
                      onClick={handleClearBuilder}
                      title="Reset canvas"
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {/* 7. Collapsible Atoms & Bonds Roster (Full Control) */}
                <div className="space-y-2">
                  {/* Atoms List Toggle */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowAtomRoster(!showAtomRoster)}
                      className="w-full p-2.5 flex items-center justify-between text-xs font-montserrat font-extrabold text-slate-700 bg-slate-50/70 hover:bg-slate-100 cursor-pointer"
                    >
                      <span>ATOMS ROSTER ({builderAtoms.length})</span>
                      {showAtomRoster ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {showAtomRoster && (
                      <div className="p-2 space-y-1.5 max-h-40 overflow-y-auto">
                        {builderAtoms.map((a, idx) => {
                          const elData = getElementData(a.symbol);
                          const isSel = selectedBuilderAtomIndex === idx;
                          return (
                            <div
                              key={a.id}
                              className={`p-1.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                                isSel
                                  ? 'border-[#00C2D1] bg-teal-50/80 font-bold'
                                  : 'border-slate-100 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-black/10"
                                  style={{ backgroundColor: elData.hexColor }}
                                />
                                <span className="font-montserrat font-extrabold text-[#0B1F2A]">
                                  #{idx + 1} {a.symbol}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({a.x.toFixed(2)}, {a.y.toFixed(2)}, {a.z.toFixed(2)})
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundEngine.playTap();
                                    setSelectedBuilderAtomIndex(idx);
                                  }}
                                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                >
                                  Pick
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReplaceElement(idx)}
                                  className="px-1.5 py-0.5 rounded-md text-[10px] bg-teal-100 hover:bg-teal-200 text-teal-800 cursor-pointer"
                                  title={`Mutate to ${builderSelectedElement}`}
                                >
                                  →{builderSelectedElement}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEraseAtom(idx)}
                                  className="p-1 rounded-md text-rose-500 hover:bg-rose-50 cursor-pointer"
                                  title="Delete Atom"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Bonds List Toggle */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowBondRoster(!showBondRoster)}
                      className="w-full p-2.5 flex items-center justify-between text-xs font-montserrat font-extrabold text-slate-700 bg-slate-50/70 hover:bg-slate-100 cursor-pointer"
                    >
                      <span>BONDS LIST ({builderBonds.length})</span>
                      {showBondRoster ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {showBondRoster && (
                      <div className="p-2 space-y-1.5 max-h-36 overflow-y-auto">
                        {builderBonds.length === 0 ? (
                          <div className="text-center py-2 text-xs text-slate-400">
                            No bonds drawn yet. Use Connect Bonds above!
                          </div>
                        ) : (
                          builderBonds.map((b, idx) => {
                            const a1 = builderAtoms.find((a) => a.id === b.from);
                            const a2 = builderAtoms.find((a) => a.id === b.to);
                            return (
                              <div
                                key={b.id}
                                className="p-1.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between text-xs font-mono"
                              >
                                <div className="flex items-center gap-1.5 font-montserrat font-bold">
                                  <span>#{idx + 1}:</span>
                                  <span>{a1 ? `${a1.symbol}#${a1.index + 1}` : 'Atom'}</span>
                                  <span className="text-[#00C2D1] font-bold">
                                    {b.order === 3 ? '≡' : b.order === 2 ? '=' : '—'}
                                  </span>
                                  <span>{a2 ? `${a2.symbol}#${a2.index + 1}` : 'Atom'}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBond(b.id)}
                                  className="p-1 rounded-md text-rose-500 hover:bg-rose-50 cursor-pointer"
                                  title="Remove Bond"
                                >
                                  <Unlink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 8. Live Octet & Stability Banner */}
                <div
                  className={`p-3.5 rounded-2xl border-2 text-xs font-montserrat ${
                    builderValidation.isValid
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-extrabold mb-1">
                    {builderValidation.isValid ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Stable Octet: {builderValidation.formula}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Valence Warnings</span>
                      </>
                    )}
                  </div>
                  {builderValidation.warnings.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                      {builderValidation.warnings.slice(0, 3).map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-emerald-700">
                      Mass: {builderValidation.molarMass} g/mol • SMILES: <code className="font-mono font-bold">{currentSmiles}</code>
                    </p>
                  )}
                </div>

                {/* 9. Data Interchange Drawer (SMILES / XYZ / Molfile) */}
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-montserrat font-extrabold text-slate-700">
                      Data Interchange (SMILES / XYZ / Molfile):
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowIoDrawer(!showIoDrawer)}
                      className="text-[11px] font-montserrat font-bold text-[#00C2D1] hover:underline cursor-pointer"
                    >
                      {showIoDrawer ? 'Hide' : 'Expand'}
                    </button>
                  </div>

                  {showIoDrawer && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 text-xs animate-in fade-in">
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        {(['smiles', 'xyz', 'mol'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setIoTab(t)}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-montserrat font-bold uppercase transition-all cursor-pointer ${
                              ioTab === t
                                ? 'bg-[#00C2D1] text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {ioTab === 'smiles' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={smilesInputText}
                              onChange={(e) => setSmilesInputText(e.target.value)}
                              placeholder="Paste SMILES e.g. CCO, c1ccccc1..."
                              className="flex-1 px-2.5 py-1.5 rounded-xl border border-slate-200 font-mono text-xs bg-white focus:outline-[#00C2D1]"
                            />
                            <Button variant="primary" size="sm" onClick={handleLoadSmiles}>
                              Load
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                            <span className="truncate max-w-[200px]">Current: {currentSmiles}</span>
                            <button
                              type="button"
                              onClick={handleCopySmiles}
                              className="text-[#00C2D1] hover:underline font-bold cursor-pointer flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                          </div>
                        </div>
                      )}

                      {ioTab === 'xyz' && (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={xyzInputText}
                            onChange={(e) => setXyzInputText(e.target.value)}
                            placeholder="Paste XYZ text format here..."
                            className="w-full p-2 rounded-xl border border-slate-200 font-mono text-[10px] bg-white focus:outline-[#00C2D1]"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <Button variant="secondary" size="sm" onClick={handleLoadXyz}>
                              Import XYZ
                            </Button>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={handleCopyXyz}
                                className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[10px] font-montserrat font-bold cursor-pointer"
                              >
                                Copy Text
                              </button>
                              <button
                                type="button"
                                onClick={handleDownloadXyz}
                                className="px-2 py-1 rounded-lg bg-[#00C2D1] text-white text-[10px] font-montserrat font-bold cursor-pointer shadow-xs"
                              >
                                Download .xyz
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {ioTab === 'mol' && (
                        <div className="space-y-2 text-center p-2">
                          <p className="text-[11px] text-slate-500">
                            MDL Molfile (V2000) standard compatible with ChemDraw and ArgusLab.
                          </p>
                          <Button variant="primary" size="sm" leftIcon={<Copy className="w-3.5 h-3.5" />} onClick={handleCopyMolfile} className="w-full">
                            Copy MDL Molfile (V2000) to Clipboard
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Save to Journal Action */}
                <Button
                  variant="gold"
                  size="md"
                  leftIcon={<Bookmark className="w-4 h-4" />}
                  onClick={handleSaveCustomToJournal}
                  disabled={!builderValidation.isValid}
                  className="w-full font-montserrat font-extrabold"
                >
                  SAVE TO SCHOLAR JOURNAL (+50 XP)
                </Button>

                {builderSavedMessage && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-montserrat font-bold animate-in fade-in flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{builderSavedMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: GAME LEVELS & CURRICULUM CHALLENGES */}
            {/* ========================================================= */}
            {activeTab === 'challenges' && (
              <div className="space-y-4 animate-in fade-in">
                {/* Challenge Selector Ribbon */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-montserrat font-extrabold text-slate-700 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Curriculum Drawing Challenges:</span>
                    </span>
                    <Badge variant="accent" size="sm">Level {selectedChallenge.level} of {MOLECULE_CHALLENGES.length}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {MOLECULE_CHALLENGES.map((ch) => {
                      const isSel = ch.id === selectedChallengeId;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            soundEngine.playTap();
                            setSelectedChallengeId(ch.id);
                          }}
                          className={`p-2 rounded-xl text-left border-2 transition-all cursor-pointer ${
                            isSel
                              ? 'border-[#00C2D1] bg-teal-50/80 shadow-xs ring-1 ring-[#00C2D1]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-slate-400 font-bold">L{ch.level}</div>
                          <div className="font-montserrat font-extrabold text-xs text-[#0B1F2A] truncate">
                            {ch.name}
                          </div>
                          <div className="text-[10px] font-mono font-bold text-[#00C2D1]">
                            {ch.targetAngle}°
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Challenge Quest Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/30 border-2 border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">
                          Level {selectedChallenge.level}: {selectedChallenge.name}
                        </h3>
                        <Badge variant="gold" size="sm">+{selectedChallenge.xpReward} XP</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedChallenge.description}
                      </p>
                    </div>
                  </div>

                  {/* Target Objectives Checklist */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-[10px] font-montserrat font-bold text-slate-400 block uppercase">
                        Target Formula
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-extrabold text-sm text-[#0B1F2A]">
                          {selectedChallenge.formula}
                        </span>
                        {challengeValidation.isFormulaMatch ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <span className="text-[10px] font-mono text-amber-600 font-bold">
                            Current: {builderValidation.formula || 'empty'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="text-[10px] font-montserrat font-bold text-slate-400 block uppercase">
                        Target Bond Angle
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-extrabold text-sm text-[#00C2D1]">
                          {selectedChallenge.targetAngle}° <span className="text-[10px] text-slate-400">(±{selectedChallenge.angleTolerance}°)</span>
                        </span>
                        {challengeValidation.isAngleMeasured ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {challengeValidation.measuredAngle ? `${challengeValidation.measuredAngle.toFixed(1)}°` : 'Measure in 3D'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hints */}
                  <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200 text-xs space-y-1">
                    <span className="text-[10px] font-montserrat font-extrabold text-slate-600 block">
                      Instructions & Hints:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                      {selectedChallenge.hints.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons: Starter + Verification */}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleLoadChallengeStarter(selectedChallenge)}
                      className="flex-1 font-montserrat font-bold text-xs"
                    >
                      Load Starter Setup
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Trophy className="w-4 h-4" />}
                      onClick={handleVerifyChallenge}
                      className="flex-1 font-montserrat font-extrabold text-xs shadow-sm"
                    >
                      Verify & Claim Win
                    </Button>
                  </div>

                  {challengeVictoryMessage && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs font-montserrat font-bold animate-in fade-in flex items-center gap-2.5 shadow-md">
                      <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 animate-bounce" />
                      <div className="flex-1">
                        <div>{challengeVictoryMessage}</div>
                        <div className="text-[10px] text-emerald-700 font-normal">Progress saved to Scholar Journal!</div>
                      </div>
                    </div>
                  )}

                  {!challengeValidation.isComplete && (
                    <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] font-montserrat flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{challengeValidation.feedback}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: MOLECULE DIRECTORY & VSEPR PASSPORT */}
            {/* ========================================================= */}
            {activeTab === 'directory' && (
              <div className="space-y-4 animate-in fade-in">
                {/* Search & Filter */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search formula, name, geometry..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-montserrat bg-slate-50 focus:bg-white focus:outline-[#00C2D1]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'vsepr', label: 'VSEPR' },
                      { id: 'organic', label: 'Organic' },
                      { id: 'engineering', label: 'Engineering' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          soundEngine.playTap();
                          setCategoryFilter(c.id);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-montserrat font-bold cursor-pointer ${
                          categoryFilter === c.id
                            ? 'bg-[#00C2D1] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Directory List */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {filteredMolecules.map((m) => {
                    const isSelected = !isBuilderActive && m.id === selectedMoleculeId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playTap();
                          setIsBuilderActive(false);
                          setSelectedMoleculeId(m.id);
                          setSelectedAtomIndices([]);
                        }}
                        className={`w-full p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#00C2D1] bg-teal-50/70 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-montserrat font-extrabold text-xs text-[#0B1F2A]">
                            {m.name}
                          </div>
                          <div className="text-[11px] font-mono font-bold text-[#00C2D1]">
                            {m.formula} • {m.geometry.split(' ')[0]}
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 font-bold">
                          {m.orbitals_summary.band_gap_ev.toFixed(1)} eV gap
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Molecule Scientific Passport */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-montserrat font-extrabold text-[#0B1F2A]">
                        {activeCurated.name} ({activeCurated.formula})
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activeCurated.iupacName}
                      </span>
                    </div>
                    <Badge variant="accent" size="sm">
                      {activeCurated.geometry.split(' ')[0]}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[9px] text-slate-400 font-bold block">BOND ANGLE</span>
                      <span className="font-montserrat font-bold text-[#0B1F2A]">
                        {activeCurated.idealBondAngle}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[9px] text-slate-400 font-bold block">DIPOLE MOMENT</span>
                      <span className="font-montserrat font-bold text-[#0B1F2A]">
                        {activeCurated.dipoleMoment}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeCurated.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-mono truncate">
                      Ref: {activeCurated.provenance}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Wand2 className="w-3.5 h-3.5" />}
                      onClick={() => handleLoadPresetToBuilder(activeCurated.id)}
                    >
                      Edit in Builder
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: REAL-TIME MEASUREMENTS (Distance / Angle / Dihedral) */}
            {/* ========================================================= */}
            {activeTab === 'measure' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-montserrat font-extrabold text-slate-700 block">
                    Choose Measurement Mode:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setMeasurementMode(measurementMode === 'distance' ? 'none' : 'distance');
                        setSelectedAtomIndices([]);
                      }}
                      className={`p-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        measurementMode === 'distance'
                          ? 'bg-[#00C2D1] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Distance (Å)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setMeasurementMode(measurementMode === 'angle' ? 'none' : 'angle');
                        setSelectedAtomIndices([]);
                      }}
                      className={`p-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        measurementMode === 'angle'
                          ? 'bg-[#F5B942] text-[#0B1F2A] shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Angle (°)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setMeasurementMode(measurementMode === 'dihedral' ? 'none' : 'dihedral');
                        setSelectedAtomIndices([]);
                      }}
                      className={`p-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        measurementMode === 'dihedral'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Dihedral (°)</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-[#0B1F2A] font-medium leading-relaxed">
                  {measurementMode === 'distance' && 'Click 2 atoms to measure exact Euclidean distance in Ångströms.'}
                  {measurementMode === 'angle' && 'Click 3 atoms (arm1, center vertex, arm2) to measure VSEPR bond angle in degrees.'}
                  {measurementMode === 'dihedral' && 'Click 4 atoms (A-B-C-D) to measure torsional dihedral angle across bond B-C.'}
                  {measurementMode === 'none' && 'Select a tool above, then click atoms on the 3D canvas.'}
                </div>

                {/* Measurement History Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-montserrat font-bold text-slate-500">
                    <span>RECORDED MEASUREMENTS:</span>
                    {measurementHistory.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMeasurementHistory([])}
                        className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {measurementHistory.length === 0 ? (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No measurements taken yet. Click atoms in the 3D viewer.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {measurementHistory.map((m) => (
                        <div
                          key={m.id}
                          className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs font-mono"
                        >
                          <span className="font-bold text-[#0B1F2A]">{m.label}</span>
                          <span className="font-extrabold text-[#00C2D1]">
                            {m.value.toFixed(3)} {m.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: HOMO-LUMO QUANTUM FRONTIER LAB (LAST TAB!) */}
            {/* ========================================================= */}
            {activeTab === 'homolumo' && (
              <OrbitalPanel
                orbitals={activeCurated.orbitals_summary}
                orbitalType={orbitalType}
                onOrbitalTypeChange={setOrbitalType}
                isoval={orbitalIsoval}
                onIsovalChange={setOrbitalIsoval}
                opacity={orbitalOpacity}
                onOpacityChange={setOrbitalOpacity}
                aiSummary={activeCurated.ai_summary || activeCurated.description}
              />
            )}
          </div>
        </div>
      </div>

      {/* Full 118 Periodic Table Element Modal */}
      <PeriodicTableElementPicker
        isOpen={showPeriodicPicker}
        onClose={() => setShowPeriodicPicker(false)}
        selectedElement={builderSelectedElement}
        onSelectElement={(symbol) => {
          setBuilderSelectedElement(symbol);
          triggerIoNotification(`Active building element set to ${symbol} (${getElementData(symbol).name})`);
        }}
      />
    </div>
  );
};
