/**
 * Alche-Me — 3D Molecule Studio & HOMO-LUMO Quantum Frontier Laboratory
 * Fully responsive, optimized Zero-Scroll Studio Deck inspired by HomoLumo, ArgusLab, and MolDraw:
 * - 3Dmol WebGL engine with instant zoomTo() centering & full 6-DOF drag/pan controls
 * - 3D Builder with VSEPR force-field physics relaxation, fragment palettes, and valence octet checks
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
  ChevronRight, 
  ArrowRight,
  BookOpen,
  Search,
  Sliders,
  ShieldAlert,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Share2,
  FileCode,
  Atom,
  Scissors
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
  SurfaceStyle 
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
  relaxVseprForces 
} from './vseprPhysics';
import { FRAGMENT_TEMPLATES, FragmentTemplate, insertFragment } from './fragmentTemplates';
import { parseSmiles, generateSmiles, parseXyz, exportToXyz, exportToMolfile } from './smilesEngine';
import { MoleculeViewer3D } from './MoleculeViewer3D';
import { OrbitalPanel } from './OrbitalPanel';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';

export const MoleculeStudioScreen: React.FC = () => {
  // Active Preset & Tab: 3D Builder FIRST, HOMO-LUMO LAST
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('water');
  const [activeTab, setActiveTab] = useState<'builder' | 'directory' | 'measure' | 'homolumo'>('builder');

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
  const [builderSelectedElement, setBuilderSelectedElement] = useState<ElementSymbol>('C');
  const [builderToolMode, setBuilderToolMode] = useState<BuilderToolMode>('addAtom');
  const [builderBondOrder, setBuilderBondOrder] = useState<1 | 2 | 3>(1);
  const [selectedBuilderAtomIndex, setSelectedBuilderAtomIndex] = useState<number | null>(null);
  const [bondFirstAtomIndex, setBondFirstAtomIndex] = useState<number | null>(null);
  const [builderSavedMessage, setBuilderSavedMessage] = useState<string | null>(null);

  // Chemical Data IO State (SMILES / XYZ / Molfile)
  const [showIoDrawer, setShowIoDrawer] = useState<boolean>(false);
  const [ioTab, setIoTab] = useState<'smiles' | 'xyz' | 'mol'>('smiles');
  const [smilesInputText, setSmilesInputText] = useState<string>('CCO');
  const [xyzInputText, setXyzInputText] = useState<string>('');
  const [ioNotification, setIoNotification] = useState<string | null>(null);

  // Search filter for presets
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Currently Active Molecule Definition
  const activeCurated = useMemo(() => {
    return CURATED_MOLECULES.find((m) => m.id === selectedMoleculeId) || CURATED_MOLECULES[0];
  }, [selectedMoleculeId]);

  // Current active raw XYZ string for 3Dmol
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

  // Current SMILES string for active molecule
  const currentSmiles = useMemo(() => {
    if (isBuilderActive) {
      return generateSmiles(builderAtoms, builderBonds);
    }
    return generateSmiles(activeCurated.atoms, activeCurated.bonds);
  }, [isBuilderActive, builderAtoms, builderBonds, activeCurated]);

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
    setTimeout(() => setIoNotification(null), 3000);
  };

  // ==========================================
  // ATOM CLICK & TOOL INTERACTION LOGIC
  // ==========================================
  const handleAtomSelect = (atomIndex: number) => {
    // 1. Measurement mode overrides builder actions
    if (measurementMode !== 'none') {
      handleMeasurementPick(atomIndex);
      return;
    }

    // 2. Builder Mode Actions
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
  // BUILDER TOOL ACTIONS (ArgusLab & MolDraw)
  // ==========================================

  // 1. Sprout Atom attached to clicked atom
  const handleAddAtomAttachedTo = (hostIndex: number) => {
    const host = builderAtoms[hostIndex];
    if (!host) return;

    soundEngine.playTap();
    const newIdx = builderAtoms.length;
    const offset = 1.45;
    const newAtomId = `b-${Date.now()}-${newIdx}`;

    const newAtom: AtomNode = {
      id: newAtomId,
      index: newIdx,
      symbol: builderSelectedElement,
      x: host.x + (Math.random() - 0.5) * offset,
      y: host.y + offset,
      z: host.z + (Math.random() - 0.5) * offset,
    };

    const newBond: BondEdge = {
      id: `bond-${Date.now()}-${builderBonds.length}`,
      from: host.id,
      to: newAtomId,
      order: builderBondOrder,
    };

    const updatedA = [...builderAtoms, newAtom];
    const updatedB = [...builderBonds, newBond];
    const relaxed = relaxVseprForces(updatedA, updatedB, 35);
    setBuilderAtoms(relaxed);
    setBuilderBonds(updatedB);
    setSelectedBuilderAtomIndex(newIdx);
  };

  // 2. Draw / Cycle Bond between 2 atoms
  const handleBondToolPick = (atomIndex: number) => {
    if (bondFirstAtomIndex === null) {
      soundEngine.playTap();
      setBondFirstAtomIndex(atomIndex);
      return;
    }

    if (bondFirstAtomIndex === atomIndex) {
      // Deselect if same atom clicked
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
    // Check if bond already exists
    const existingIndex = builderBonds.findIndex(
      (b) => (b.from === a1.id && b.to === a2.id) || (b.from === a2.id && b.to === a1.id)
    );

    let nextBonds = [...builderBonds];
    if (existingIndex !== -1) {
      // Cycle order: 1 -> 2 -> 3 -> Delete
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
      // Create new bond
      nextBonds.push({
        id: `bond-${Date.now()}-${builderBonds.length}`,
        from: a1.id,
        to: a2.id,
        order: builderBondOrder,
      });
      triggerIoNotification(`Bond created (${builderBondOrder === 3 ? '≡' : builderBondOrder === 2 ? '=' : '—'})`);
    }

    const relaxed = relaxVseprForces(builderAtoms, nextBonds, 30);
    setBuilderAtoms(relaxed);
    setBuilderBonds(nextBonds);
    setBondFirstAtomIndex(null);
  };

  // 3. Mutate / Replace Element
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

  // 4. Erase Atom and connected bonds
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

  // 5. Add Free Floating Atom
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
      x: maxX + 1.85,
      y: (Math.random() - 0.5) * 1.2,
      z: (Math.random() - 0.5) * 1.2,
    };
    setBuilderAtoms([...builderAtoms, newAtom]);
    setSelectedBuilderAtomIndex(newIdx);
    triggerIoNotification(`Added free ${builderSelectedElement} atom`);
  };

  // 6. Template Fragment Insertion
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

  // 7. Auto-Saturate Hydrogens
  const handleAutoSaturateH = () => {
    soundEngine.playFlameWhoosh();
    const res = autoSaturateHydrogens(builderAtoms, builderBonds);
    const relaxed = relaxVseprForces(res.updatedAtoms, res.updatedBonds, 50);
    setBuilderAtoms(relaxed);
    setBuilderBonds(res.updatedBonds);
    soundEngine.playSuccess();
    triggerIoNotification(`Valences saturated (+${res.addedCount} Hydrogens)`);
  };

  // 8. Strip All Hydrogens (Skeletal framework mode)
  const handleStripHydrogens = () => {
    soundEngine.playTap();
    const res = stripAllHydrogens(builderAtoms, builderBonds);
    const relaxed = relaxVseprForces(res.updatedAtoms, res.updatedBonds, 30);
    setBuilderAtoms(relaxed);
    setBuilderBonds(res.updatedBonds);
    triggerIoNotification(`Stripped ${res.removedCount} Hydrogens (Skeletal mode)`);
  };

  // 9. Clean 3D Structure & Energy Minimization (ArgusLab Force Field)
  const handleClean3D = () => {
    soundEngine.playFlameWhoosh();
    const relaxed = relaxVseprForces(builderAtoms, builderBonds, 80);
    setBuilderAtoms(relaxed);
    soundEngine.playSuccess();
    triggerIoNotification(`VSEPR Force-Field Minimized (80 passes)`);
  };

  // 10. Clear Builder
  const handleClearBuilder = () => {
    soundEngine.playTap();
    setBuilderAtoms([{ id: 'b-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 }]);
    setBuilderBonds([]);
    setSelectedBuilderAtomIndex(null);
    setBondFirstAtomIndex(null);
    triggerIoNotification(`Canvas reset to single Carbon atom`);
  };

  // 11. Load Preset directly into Builder
  const handleLoadPresetToBuilder = (presetId?: string) => {
    const target = CURATED_MOLECULES.find((m) => m.id === (presetId || selectedMoleculeId));
    if (!target) return;
    soundEngine.playTap();
    setBuilderAtoms(JSON.parse(JSON.stringify(target.atoms)));
    setBuilderBonds(JSON.parse(JSON.stringify(target.bonds)));
    setIsBuilderActive(true);
    setActiveTab('builder');
    setSelectedBuilderAtomIndex(null);
    setBondFirstAtomIndex(null);
    triggerIoNotification(`Loaded ${target.name} (${target.formula}) into 3D Builder`);
  };

  // ==========================================
  // DATA IMPORT / EXPORT (SMILES / XYZ / MOL)
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

          {/* Builder Instruction Toast Banner */}
          {isBuilderActive && (
            <div className="absolute top-16 left-4 z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-200 shadow-sm text-[11px] font-montserrat text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00C2D1]" />
                {builderToolMode === 'addAtom' && (
                  <span>Tool: <strong>Attach {builderSelectedElement}</strong> (Click atom on canvas)</span>
                )}
                {builderToolMode === 'drawBond' && (
                  <span>
                    {bondFirstAtomIndex === null
                      ? 'Tool: Click 1st atom to connect/change bond'
                      : `Selected Atom #${bondFirstAtomIndex + 1} — now click 2nd atom`}
                  </span>
                )}
                {builderToolMode === 'replaceElement' && (
                  <span>Tool: <strong>Mutate to {builderSelectedElement}</strong> (Click atom to transform)</span>
                )}
                {builderToolMode === 'erase' && (
                  <span className="text-rose-600 font-bold">Tool: Click atom to erase</span>
                )}
                {builderToolMode === 'select' && (
                  <span>Tool: Select atom to inspect / attach fragment</span>
                )}
              </div>
            </div>
          )}

          {/* Floating IO Toast Notification */}
          {ioNotification && (
            <div className="absolute top-16 right-4 z-30 px-3.5 py-2 rounded-xl bg-[#0B1F2A] text-white text-xs font-montserrat font-bold shadow-lg animate-in fade-in flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00C2D1]" />
              <span>{ioNotification}</span>
            </div>
          )}
        </div>

        {/* Right Column (32% width): Scientific Tool Station Deck */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-0 rounded-2xl border-2 border-slate-200/90 bg-white shadow-xs overflow-hidden">
          {/* Station Mode Switcher Tabs: 3D BUILDER FIRST, HOMO-LUMO LAST */}
          <div className="p-2 border-b-2 border-slate-100 bg-slate-50/80 grid grid-cols-4 gap-1 shrink-0">
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
              <span className="text-[10px]">3D Builder</span>
            </button>

            {/* TAB 2: DIRECTORY */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setActiveTab('directory');
              }}
              className={`p-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer text-center flex flex-col items-center gap-1 ${
                activeTab === 'directory'
                  ? 'bg-white text-[#0B1F2A] shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-[#0B1F2A]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px]">Directory</span>
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
                  ? 'bg-white text-[#0B1F2A] shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-[#0B1F2A]'
              }`}
            >
              <Ruler className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px]">Measure</span>
            </button>

            {/* TAB 4: HOMO-LUMO (LAST!) */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setActiveTab('homolumo');
              }}
              className={`p-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer text-center flex flex-col items-center gap-1 ${
                activeTab === 'homolumo'
                  ? 'bg-white text-[#0B1F2A] shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-[#0B1F2A]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#00C2D1]" />
              <span className="text-[10px]">HOMO-LUMO</span>
            </button>
          </div>

          {/* Tab Content Body (Scrollable with Zero Page Scroll) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ========================================================= */}
            {/* TAB 1: 3D MOLECULAR BUILDER (ArgusLab & MolDraw Engine) */}
            {/* ========================================================= */}
            {activeTab === 'builder' && (
              <div className="space-y-4 animate-in fade-in">
                {/* 1. Drawing Tool Mode Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-montserrat font-extrabold text-slate-700">
                      Drawing Tool:
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {builderAtoms.length} atoms • {builderBonds.length} bonds
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { mode: 'addAtom', label: 'Attach', icon: Plus, title: 'Attach atom to clicked host' },
                      { mode: 'drawBond', label: 'Bond', icon: Share2, title: 'Connect 2 atoms / cycle order' },
                      { mode: 'replaceElement', label: 'Mutate', icon: RefreshCw, title: 'Replace atom element' },
                      { mode: 'erase', label: 'Erase', icon: Trash2, title: 'Erase atom & bonds' },
                      { mode: 'select', label: 'Select', icon: Focus, title: 'Select atom for templates' },
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

                {/* 2. Bond Order Selector */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-montserrat font-bold text-slate-600">
                    Bond Order:
                  </span>
                  <div className="flex items-center gap-1.5">
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
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          builderBondOrder === b.order
                            ? 'bg-[#00C2D1] text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Element Palette */}
                <div className="space-y-1.5">
                  <span className="text-xs font-montserrat font-extrabold text-slate-700 block">
                    Active Element Palette:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['C', 'H', 'O', 'N', 'Cl', 'F', 'Br', 'I', 'S', 'P', 'B', 'Si', 'Fe', 'Pt', 'Na', 'Ca'] as ElementSymbol[]).map((sym) => {
                      const el = ELEMENT_REGISTRY[sym];
                      const isSel = builderSelectedElement === sym;
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => {
                            soundEngine.playTap();
                            setBuilderSelectedElement(sym);
                          }}
                          className={`px-2 py-1 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSel
                              ? 'border-[#00C2D1] bg-teal-50 text-[#0B1F2A] shadow-xs font-bold'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: el?.hexColor || '#fff' }}
                          />
                          <span className="font-montserrat text-xs">{sym}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Template Fragments & Rings Palette (MolDraw / ArgusLab) */}
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-montserrat font-extrabold text-slate-700">
                      Fragment & Ring Templates:
                    </span>
                    {selectedBuilderAtomIndex !== null ? (
                      <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        Attaching to #{selectedBuilderAtomIndex + 1}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        Click template to add
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {FRAGMENT_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleInsertTemplate(tmpl)}
                        title={tmpl.description}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#00C2D1] hover:bg-teal-50/50 text-[11px] font-montserrat font-bold text-slate-700 transition-all cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        <span>{tmpl.name}</span>
                        <span className="text-[10px] font-mono text-[#00C2D1]">({tmpl.formula})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Fast Chemistry Actions (ArgusLab Force Field & Hydrogens) */}
                <div className="space-y-1.5">
                  <span className="text-xs font-montserrat font-extrabold text-slate-700 block">
                    Force-Field Physics & Clean-Up:
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

                {/* 6. Live Octet & Stability Banner */}
                <div
                  className={`p-3 rounded-xl border-2 text-xs font-montserrat ${
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

                {/* 7. SMILES, XYZ, & Molfile Interoperability Drawer */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
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
                      {/* Subtabs: SMILES / XYZ / MOL */}
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        {(['smiles', 'xyz', 'mol'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setIoTab(t)}
                            className={`flex-1 py-1 rounded-md text-[10px] font-montserrat font-bold uppercase transition-all cursor-pointer ${
                              ioTab === t
                                ? 'bg-[#00C2D1] text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {/* TAB: SMILES */}
                      {ioTab === 'smiles' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={smilesInputText}
                              onChange={(e) => setSmilesInputText(e.target.value)}
                              placeholder="Paste SMILES e.g. CCO, c1ccccc1..."
                              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-xs bg-white focus:outline-[#00C2D1]"
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

                      {/* TAB: XYZ */}
                      {ioTab === 'xyz' && (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={xyzInputText}
                            onChange={(e) => setXyzInputText(e.target.value)}
                            placeholder="Paste XYZ text format here..."
                            className="w-full p-2 rounded-lg border border-slate-200 font-mono text-[10px] bg-white focus:outline-[#00C2D1]"
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

                      {/* TAB: MOL */}
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
                  className="w-full"
                >
                  SAVE TO SCHOLAR JOURNAL (+50 XP)
                </Button>

                {builderSavedMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-montserrat font-bold animate-in fade-in flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{builderSavedMessage}</span>
                  </div>
                )}
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
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
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
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-[9px] text-slate-400 font-bold block">BOND ANGLE</span>
                      <span className="font-montserrat font-bold text-[#0B1F2A]">
                        {activeCurated.idealBondAngle}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200">
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
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
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

                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-[#0B1F2A] font-medium leading-relaxed">
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
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
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
    </div>
  );
};
