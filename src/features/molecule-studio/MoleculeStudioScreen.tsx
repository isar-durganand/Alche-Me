/**
 * Alche-Me — 3D Molecule Studio & HOMO-LUMO Quantum Frontier Laboratory
 * Fully responsive, optimized Zero-Scroll Studio Deck inspired by HomoLumo:
 * - 3Dmol WebGL engine with instant zoomTo() centering & full 6-DOF drag/pan controls
 * - Comprehensive HOMO-LUMO Frontier Orbital Analyzer (Pearson HSAB, Band Gap, Hardness, Energy Ladder)
 * - Curated 25+ verified molecule presets from MRIIRS syllabus & quantum benchmarks
 * - Interactive 3D Builder with VSEPR force-field physics relaxation and valence octet checks
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
  ShieldAlert
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { CURATED_MOLECULES } from './moleculeData';
import { 
  AtomNode, 
  BondEdge, 
  DisplayStyle, 
  ELEMENT_REGISTRY, 
  ElementSymbol, 
  MeasurementMode, 
  MeasurementResult, 
  MoleculeStructure, 
  OrbitalType 
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
  relaxVseprForces 
} from './vseprPhysics';
import { MoleculeViewer3D } from './MoleculeViewer3D';
import { OrbitalPanel } from './OrbitalPanel';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';

export const MoleculeStudioScreen: React.FC = () => {
  // Active Preset & Mode
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('water');
  const [activeTab, setActiveTab] = useState<'homolumo' | 'directory' | 'measure' | 'builder'>('homolumo');

  // Display & 3Dmol Configuration
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>('ballAndStick');
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // HOMO-LUMO Quantum State
  const [orbitalType, setOrbitalType] = useState<OrbitalType>('HOMO');
  const [orbitalIsoval, setOrbitalIsoval] = useState<number>(0.04);
  const [orbitalOpacity, setOrbitalOpacity] = useState<number>(0.80);

  // Measurement State
  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>('none');
  const [selectedAtomIndices, setSelectedAtomIndices] = useState<number[]>([]);
  const [measurementHistory, setMeasurementHistory] = useState<MeasurementResult[]>([]);

  // 3D Builder State
  const [isBuilderActive, setIsBuilderActive] = useState<boolean>(false);
  const [builderAtoms, setBuilderAtoms] = useState<AtomNode[]>([
    { id: 'b-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 },
  ]);
  const [builderBonds, setBuilderBonds] = useState<BondEdge[]>([]);
  const [builderSelectedElement, setBuilderSelectedElement] = useState<ElementSymbol>('C');
  const [builderSavedMessage, setBuilderSavedMessage] = useState<string | null>(null);

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

  // ==========================================
  // ATOM CLICK & MEASUREMENT LOGIC
  // ==========================================
  const handleAtomSelect = (atomIndex: number) => {
    if (measurementMode === 'none') {
      if (isBuilderActive) {
        // In builder mode, attach chosen element to clicked atom
        handleAddAtomAttachedTo(atomIndex);
      }
      return;
    }

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

    // Reset picks if max reached
    const maxPicks = measurementMode === 'distance' ? 2 : measurementMode === 'angle' ? 3 : 4;
    if (next.length >= maxPicks) {
      setSelectedAtomIndices([]);
    } else {
      setSelectedAtomIndices(next);
    }
  };

  // ==========================================
  // BUILDER METHODS
  // ==========================================
  const handleAddAtomAttachedTo = (hostIndex: number) => {
    const host = builderAtoms[hostIndex];
    if (!host) return;

    soundEngine.playTap();
    const newIdx = builderAtoms.length;
    const offset = 1.35;
    const newAtom: AtomNode = {
      id: `b-${newIdx}`,
      index: newIdx,
      symbol: builderSelectedElement,
      x: host.x + (Math.random() - 0.5) * offset * 1.5,
      y: host.y + offset,
      z: host.z + (Math.random() - 0.5) * offset,
    };

    const newBond: BondEdge = {
      id: `bond-${Date.now()}`,
      from: host.id,
      to: newAtom.id,
      order: 1,
    };

    const updatedA = [...builderAtoms, newAtom];
    const updatedB = [...builderBonds, newBond];
    const relaxed = relaxVseprForces(updatedA, updatedB, 30);
    setBuilderAtoms(relaxed);
    setBuilderBonds(updatedB);
  };

  const handleAutoSaturateH = () => {
    soundEngine.playFlameWhoosh();
    const res = autoSaturateHydrogens(builderAtoms, builderBonds);
    const relaxed = relaxVseprForces(res.updatedAtoms, res.updatedBonds, 50);
    setBuilderAtoms(relaxed);
    setBuilderBonds(res.updatedBonds);
    soundEngine.playSuccess();
  };

  const handleRelaxForces = () => {
    soundEngine.playFlameWhoosh();
    const relaxed = relaxVseprForces(builderAtoms, builderBonds, 70);
    setBuilderAtoms(relaxed);
    soundEngine.playSuccess();
  };

  const handleClearBuilder = () => {
    soundEngine.playTap();
    setBuilderAtoms([{ id: 'b-0', index: 0, symbol: 'C', x: 0, y: 0, z: 0 }]);
    setBuilderBonds([]);
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
                3D Molecule Studio & HOMO-LUMO Lab
              </h1>
              <Badge variant="accent" size="sm">Fukui Quantum FMO</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              100% IUPAC Geometry • Left-click: 360° Rotate • <span className="text-[#00C2D1] font-bold">Right-click / Drag: Center Anywhere</span>
            </p>
          </div>
        </div>

        {/* Quick Presets Pills */}
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
        <div className="lg:col-span-8 flex flex-col h-full min-h-0">
          <MoleculeViewer3D
            rawXyz={currentRawXyz}
            atoms={currentAtoms}
            displayStyle={displayStyle}
            onDisplayStyleChange={setDisplayStyle}
            measurementMode={measurementMode}
            onMeasurementModeChange={setMeasurementMode}
            selectedAtomIndices={selectedAtomIndices}
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
          />
        </div>

        {/* Right Column (32% width): Scientific Tool Station Deck */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-0 rounded-2xl border-2 border-slate-200/90 bg-white shadow-xs overflow-hidden">
          {/* Station Mode Switcher Tabs */}
          <div className="p-2 border-b-2 border-slate-100 bg-slate-50/80 grid grid-cols-4 gap-1 shrink-0">
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
          </div>

          {/* Tab Content Body (Scrollable with Zero Page Scroll) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* TAB 1: HOMO-LUMO QUANTUM FRONTIER LAB */}
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

            {/* TAB 2: MOLECULE DIRECTORY & VSEPR PASSPORT */}
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

                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    Ref: {activeCurated.provenance}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REAL-TIME MEASUREMENTS */}
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

            {/* TAB 4: 3D MOLECULAR BUILDER */}
            {activeTab === 'builder' && (
              <div className="space-y-4 animate-in fade-in">
                {/* Active Element Palette */}
                <div className="space-y-2">
                  <span className="text-xs font-montserrat font-extrabold text-slate-700 block">
                    Choose Element to Attach (Click Atom on Canvas):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['C', 'H', 'O', 'N', 'Cl', 'F', 'Br', 'I', 'S', 'P', 'B', 'Pt', 'Fe'] as ElementSymbol[]).map((sym) => {
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
                          className={`px-2.5 py-1 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSel
                              ? 'border-[#00C2D1] bg-teal-50 text-[#0B1F2A] shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/20"
                            style={{ backgroundColor: el.hexColor }}
                          />
                          <span className="font-montserrat font-bold text-xs">{sym}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Builder Fast Chemistry Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Wand2 className="w-3.5 h-3.5" />}
                    onClick={handleAutoSaturateH}
                    title="Satisfy open valences with Hydrogens"
                  >
                    Auto-H
                  </Button>
                  <Button
                    variant="gold"
                    size="sm"
                    leftIcon={<Zap className="w-3.5 h-3.5" />}
                    onClick={handleRelaxForces}
                    title="VSEPR energy relaxation"
                  >
                    Relax 3D
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
                    onClick={handleClearBuilder}
                    title="Reset builder"
                  >
                    Clear
                  </Button>
                </div>

                {/* Live Octet & Stability Banner */}
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
                      Mass: {builderValidation.molarMass} g/mol • All octet valences satisfied!
                    </p>
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
          </div>
        </div>
      </div>
    </div>
  );
};
