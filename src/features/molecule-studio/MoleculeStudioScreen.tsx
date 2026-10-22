/**
 * Alche-Me — MolView-Standard 3D Molecular Studio & 2D Sketcher
 * Built from scratch to replicate and exceed MolView (app.molview.com):
 * - Split-Screen Layout: 2D ChemDraw-grade vector sketcher (Left) + 3D WebGL viewer on pitch black (Right)
 * - Authentic Top Header: Logo, Menus (Save, View, Model, Challenges), Center Search Bar, Gamified Level HUD
 * - Full 18-Column IUPAC Periodic Table Palette Modal matching Screenshot 2
 * - Real-time 2D-to-3D VSEPR Embedding Bridge & Energy Minimization (⚡ Lightning button)
 * - Curriculum Challenge Engine: Draw compound + measure bond angle on canvas = win level + XP fanfare
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Atom, 
  Search, 
  Download, 
  Trash2, 
  Save, 
  Layers, 
  Sparkles, 
  Trophy, 
  ChevronDown, 
  Maximize2, 
  RotateCw, 
  Zap, 
  CheckCircle2, 
  Award,
  Grid,
  FileText,
  HelpCircle,
  X,
  PanelLeft
} from 'lucide-react';
import { ChemicalSketcher2D } from './ChemicalSketcher2D';
import { MoleculeViewer3D } from './MoleculeViewer3D';
import { PeriodicTableModal } from './PeriodicTableModal';
import { Atom2D, Bond2D } from './types2d';
import { convert2DTo3D, convert3DTo2D } from './sketcher3dBridge';
import { CURATED_MOLECULES } from './moleculeData';
import { MOLECULE_CHALLENGES, MoleculeChallenge, validateChallengeCompletion } from './moleculeChallenges';
import { AtomNode, BondEdge, DisplayStyle, MeasurementMode, MeasurementResult, SurfaceStyle } from './types';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';
import { relaxVseprForces, calculateHillFormula, autoSaturateHydrogens, stripAllHydrogens } from './vseprPhysics';
import { exportToMolfile } from './smilesEngine';
import { NavRoute } from '../../components/layout/AppShell';

interface MoleculeStudioScreenProps {
  onNavigate?: (route: NavRoute) => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const MoleculeStudioScreen: React.FC<MoleculeStudioScreenProps> = ({ 
  onNavigate,
  sidebarOpen = true,
  onToggleSidebar
}) => {
  // 1. Core Molecular State (2D Sketcher & 3D WebGL)
  const [atoms2D, setAtoms2D] = useState<Atom2D[]>([]);
  const [bonds2D, setBonds2D] = useState<Bond2D[]>([]);
  const [atoms3D, setAtoms3D] = useState<AtomNode[]>([]);
  const [bonds3D, setBonds3D] = useState<BondEdge[]>([]);
  const [rawMolfile, setRawMolfile] = useState<string>('');
  const [rawXyz, setRawXyz] = useState<string>('0\n\n');
  const [formula, setFormula] = useState<string>('Ø');
  const [compoundName, setCompoundName] = useState<string>('Untitled Structure');

  // 2. Active Drawing Element & Palette State
  const [activeElement, setActiveElement] = useState<string>('C');
  const [showPeriodicTable, setShowPeriodicTable] = useState<boolean>(false);

  // 3. Viewport & Layout Mode: 'split' (default MolView 50/50) | '2d' | '3d'
  const [viewMode, setViewMode] = useState<'split' | '2d' | '3d'>('split');
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>('ballAndStick');
  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>('none');
  const [selected3DAtomIndices, setSelected3DAtomIndices] = useState<number[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementResult[]>([]);
  const [showLabels, setShowLabels] = useState<boolean>(false);

  // 4. Search Bar State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState<boolean>(false);

  // 5. Header Dropdown Menus
  const [openMenu, setOpenMenu] = useState<'save' | 'view' | 'model' | 'challenges' | null>(null);

  // 6. Curriculum Game Levels & Challenge Engine
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const activeChallenge: MoleculeChallenge = MOLECULE_CHALLENGES[currentChallengeIndex];
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>([]);
  const [showChallengeModal, setShowChallengeModal] = useState<boolean>(false);
  const [victoryNotification, setVictoryNotification] = useState<string | null>(null);

  // Auto-Sync 2D sketcher changes into 3D
  const sync2DTo3D = useCallback((current2DAtoms: Atom2D[], current2DBonds: Bond2D[], runRelaxation: boolean = false) => {
    if (current2DAtoms.length === 0) {
      setAtoms3D([]);
      setBonds3D([]);
      setRawMolfile('');
      setRawXyz('0\n\n');
      setFormula('Ø');
      return;
    }

    // Always auto-saturate with hydrogens for the 3D model, exactly like MolView standard
    const res = convert2DTo3D(current2DAtoms, current2DBonds, true);
    setAtoms3D(res.atoms);
    setBonds3D(res.bonds);
    setRawMolfile(res.rawMolfile);
    setRawXyz(res.rawXyz);
    setFormula(res.formula);
  }, []);

  // Handle 2D sketcher edits
  const handleSketcherChange = (new2DAtoms: Atom2D[], new2DBonds: Bond2D[]) => {
    setAtoms2D(new2DAtoms);
    setBonds2D(new2DBonds);
    sync2DTo3D(new2DAtoms, new2DBonds);
  };

  // Explicit Energy Minimization (Clean 3D / VSEPR Force Field)
  const handleEnergyMinimization = () => {
    if (atoms3D.length === 0) return;
    soundEngine.playSuccess();
    const relaxed = relaxVseprForces(atoms3D, bonds3D, 80);
    const res = convert2DTo3D(atoms2D, bonds2D, true); // add H and relax
    setAtoms3D(relaxed);
    setRawMolfile(res.rawMolfile);
  };

  // Auto-Fill Hydrogens (+H)
  const handleAutoAddHydrogens = () => {
    soundEngine.playSuccess();
    const res = convert2DTo3D(atoms2D, bonds2D, true);
    setAtoms3D(res.atoms);
    setBonds3D(res.bonds);
    setRawMolfile(res.rawMolfile);
    setRawXyz(res.rawXyz);
    setFormula(res.formula);
  };

  // Strip Hydrogens (-H)
  const handleStripHydrogens = () => {
    soundEngine.playTap();
    const stripped = stripAllHydrogens(atoms3D, bonds3D);
    setAtoms3D(stripped.updatedAtoms);
    setBonds3D(stripped.updatedBonds);
    const res2d = convert3DTo2D(stripped.updatedAtoms, stripped.updatedBonds);
    setAtoms2D(res2d.atoms);
    setBonds2D(res2d.bonds);
    sync2DTo3D(res2d.atoms, res2d.bonds);
  };

  // Load a molecule structure into both 2D and 3D viewports
  const loadMoleculePreset = (presetId: string) => {
    const target = CURATED_MOLECULES.find((m) => m.id === presetId);
    if (!target) return;
    soundEngine.playSuccess();
    setCompoundName(target.name);
    setFormula(target.formula);
    setAtoms3D(JSON.parse(JSON.stringify(target.atoms)));
    setBonds3D(JSON.parse(JSON.stringify(target.bonds)));
    setRawXyz(target.raw_xyz);

    // Convert 3D coordinates to clean 2D skeletal sketch
    const res2D = convert3DTo2D(target.atoms, target.bonds, 600, 600);
    setAtoms2D(res2D.atoms);
    setBonds2D(res2D.bonds);

    // Generate V2000 molfile directly from the target complete structure (WITH ALL HYDROGENS!)
    const targetMolfile = exportToMolfile(target.atoms, target.bonds);
    setRawMolfile(targetMolfile);

    setSearchDropdownOpen(false);
    setSearchQuery('');
    setOpenMenu(null);
  };

  // Initial load: Load Phenanthrene (the exact molecule from Screenshot 1!) or Water
  useEffect(() => {
    loadMoleculePreset('phenanthrene');
  }, []);

  // Filtered search results
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return CURATED_MOLECULES.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.formula.toLowerCase().includes(q) ||
        (m.iupacName && m.iupacName.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [searchQuery]);

  // Handle 3D Atom Selection & Measurement
  const handle3DAtomSelect = (atomIndex: number) => {
    soundEngine.playTap();
    let next = [...selected3DAtomIndices];
    if (next.includes(atomIndex)) {
      next = next.filter((i) => i !== atomIndex);
    } else {
      next.push(atomIndex);
      // For angle measurement, maximum 3 atoms
      if (measurementMode === 'angle' && next.length > 3) {
        next = [next[1], next[2], atomIndex];
      }
    }
    setSelected3DAtomIndices(next);

    // Calculate angle if 3 atoms selected
    if (measurementMode === 'angle' && next.length === 3) {
      const a1 = atoms3D[next[0]];
      const vertex = atoms3D[next[1]];
      const a2 = atoms3D[next[2]];
      if (a1 && vertex && a2) {
        const v1 = { x: a1.x - vertex.x, y: a1.y - vertex.y, z: a1.z - vertex.z };
        const v2 = { x: a2.x - vertex.x, y: a2.y - vertex.y, z: a2.z - vertex.z };
        const l1 = Math.hypot(v1.x, v1.y, v1.z) || 1;
        const l2 = Math.hypot(v2.x, v2.y, v2.z) || 1;
        const dot = (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z) / (l1 * l2);
        const clamped = Math.max(-1, Math.min(1, dot));
        const angleDeg = Math.round(((Math.acos(clamped) * 180) / Math.PI) * 10) / 10;

        const newMeasurement: MeasurementResult = {
          id: `m-${Date.now()}`,
          type: 'angle',
          atomIndices: next,
          atomSymbols: [a1.symbol, vertex.symbol, a2.symbol],
          value: angleDeg,
          unit: '°',
          label: `${a1.symbol}${next[0] + 1}—${vertex.symbol}${next[1] + 1}—${a2.symbol}${next[2] + 1} Angle`,
        };
        setMeasurements([newMeasurement]);
      }
    }
  };

  // Evaluate Level Challenge Completion
  const challengeValidation = useMemo(() => {
    return validateChallengeCompletion(atoms3D, bonds3D, measurements, activeChallenge);
  }, [atoms3D, bonds3D, measurements, activeChallenge]);

  // Claim Win for Challenge Level
  const handleClaimLevelWin = () => {
    if (!challengeValidation.isComplete) return;
    soundEngine.playSuccess();
    progressAdapter.addXp(activeChallenge.xpReward);
    if (!completedChallengeIds.includes(activeChallenge.id)) {
      setCompletedChallengeIds((prev) => [...prev, activeChallenge.id]);
    }
    setVictoryNotification(`Level ${activeChallenge.level} Complete! +${activeChallenge.xpReward} XP awarded!`);
    setTimeout(() => setVictoryNotification(null), 5000);

    // Advance to next level if available
    if (currentChallengeIndex < MOLECULE_CHALLENGES.length - 1) {
      setTimeout(() => {
        setCurrentChallengeIndex((idx) => idx + 1);
        setMeasurements([]);
        setSelected3DAtomIndices([]);
      }, 1500);
    }
  };

  // Export handlers
  const handleExportMolfile = () => {
    soundEngine.playTap();
    const blob = new Blob([rawMolfile], { type: 'chemical/x-mdl-molfile' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${compoundName.toLowerCase().replace(/\s+/g, '_')}.mol`;
    a.click();
    URL.revokeObjectURL(url);
    setOpenMenu(null);
  };

  const handleExportXyz = () => {
    soundEngine.playTap();
    const blob = new Blob([rawXyz], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${compoundName.toLowerCase().replace(/\s+/g, '_')}.xyz`;
    a.click();
    URL.revokeObjectURL(url);
    setOpenMenu(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F3F4F6] text-slate-900 select-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP ALCHE-ME STUDIO HEADER BAR                                         */}
      {/* ========================================================================= */}
      <header className="h-12 border-b border-slate-300 bg-white px-2 sm:px-3 flex items-center justify-between shrink-0 shadow-xs z-30">
        {/* Left: Sidebar Toggle + Alche-Me Brand + Menus */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title={sidebarOpen ? "Collapse Navigation Sidebar" : "Expand Navigation Sidebar"}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer mr-0.5"
            >
              <PanelLeft className="w-4 h-4 text-slate-700" />
            </button>
          )}

          {/* Genuine Alche-Me Brand Header */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => loadMoleculePreset('phenanthrene')}>
            <img
              src="/assets/branding/Alche-Me Logo.png"
              alt="Alche-Me Logo"
              className="w-7 h-7 object-contain drop-shadow-xs"
            />
            <div className="flex flex-col leading-none">
              <span className="font-montserrat font-extrabold text-sm tracking-tight text-[#0B1F2A]">
                ALCHE-ME
              </span>
              <span className="text-[9px] font-montserrat font-bold uppercase tracking-wider text-[#00C2D1]">
                Molecule Studio
              </span>
            </div>
          </div>

          {/* Menus Dropdown Triggers */}
          <div className="hidden md:flex items-center gap-1 text-xs font-montserrat font-semibold text-slate-700">
            {/* Save Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'save' ? null : 'save')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span>Save</span>
              </button>
              {openMenu === 'save' && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-40">
                  <button
                    onClick={handleExportMolfile}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>MDL Molfile (.mol)</span>
                  </button>
                  <button
                    onClick={handleExportXyz}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Cartesian XYZ (.xyz)</span>
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={() => {
                      soundEngine.playTap();
                      setAtoms2D([]);
                      setBonds2D([]);
                      sync2DTo3D([], []);
                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Canvas</span>
                  </button>
                </div>
              )}
            </div>

            {/* View Mode Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>View</span>
              </button>
              {openMenu === 'view' && (
                <div className="absolute left-0 top-full mt-1 w-44 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-40">
                  <button
                    onClick={() => { setViewMode('split'); setOpenMenu(null); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                      viewMode === 'split' ? 'font-bold text-sky-600 bg-sky-50' : ''
                    }`}
                  >
                    <span>Split (2D + 3D)</span>
                    {viewMode === 'split' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => { setViewMode('2d'); setOpenMenu(null); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                      viewMode === '2d' ? 'font-bold text-sky-600 bg-sky-50' : ''
                    }`}
                  >
                    <span>2D Sketcher Only</span>
                    {viewMode === '2d' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => { setViewMode('3d'); setOpenMenu(null); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                      viewMode === '3d' ? 'font-bold text-sky-600 bg-sky-50' : ''
                    }`}
                  >
                    <span>3D Model Only</span>
                    {viewMode === '3d' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Model Style Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'model' ? null : 'model')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                <span>Model</span>
              </button>
              {openMenu === 'model' && (
                <div className="absolute left-0 top-full mt-1 w-44 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-40">
                  {(['ballAndStick', 'spaceFilling', 'licorice', 'wireframe'] as DisplayStyle[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => { setDisplayStyle(st); setOpenMenu(null); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                        displayStyle === st ? 'font-bold text-sky-600 bg-sky-50' : ''
                      }`}
                    >
                      <span>{st === 'ballAndStick' ? 'Ball and Stick' : st === 'spaceFilling' ? 'Spacefill (CPK)' : st === 'licorice' ? 'Stick' : 'Wireframe'}</span>
                      {displayStyle === st && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Curriculum Game Challenges Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'challenges' ? null : 'challenges')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-all cursor-pointer text-amber-700 bg-amber-50 border border-amber-200/80"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Level {activeChallenge.level}: {activeChallenge.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-amber-500" />
              </button>
              {openMenu === 'challenges' && (
                <div className="absolute left-0 top-full mt-1 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-40 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Curriculum Challenges
                  </div>
                  {MOLECULE_CHALLENGES.map((ch, idx) => {
                    const isCurrent = idx === currentChallengeIndex;
                    const isCompleted = completedChallengeIds.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setCurrentChallengeIndex(idx);
                          setMeasurements([]);
                          setSelected3DAtomIndices([]);
                          setOpenMenu(null);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                          isCurrent ? 'bg-amber-50/80 text-amber-900 font-bold' : ''
                        }`}
                      >
                        <div>
                          <div>Level {ch.level}: {ch.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Target: {ch.targetAngle}° (±{ch.angleTolerance}°)</div>
                        </div>
                        {isCompleted && <Award className="w-4 h-4 text-emerald-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center: MolView Rounded Pill Molecule Search Bar */}
        <div className="relative w-64 sm:w-80 lg:w-96">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchDropdownOpen(true);
              }}
              onFocus={() => setSearchDropdownOpen(true)}
              placeholder="Search (e.g. Water, Phenanthrene, Benzene)..."
              className="w-full pl-3.5 pr-8 py-1.5 text-xs rounded-full border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-slate-800 font-montserrat shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

          {/* Search Dropdown Matches */}
          {searchDropdownOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xl py-1 z-50 max-h-64 overflow-y-auto">
              {searchResults.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => loadMoleculePreset(m.id)}
                  className="w-full px-3.5 py-2 text-left hover:bg-sky-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-800">{m.name}</span>
                    <span className="ml-2 font-mono text-sky-600 font-semibold">{m.formula}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-tight">{m.geometry}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Gamified Level Verification & Win Trigger */}
        <div className="flex items-center gap-2">
          {/* Target Angle & Match Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
            <span className="font-bold text-slate-600">Level {activeChallenge.level}:</span>
            <span className="font-mono text-sky-600 font-bold">{activeChallenge.formula}</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-amber-600 font-bold">{activeChallenge.targetAngle}°</span>
          </div>

          {/* Verify & Claim Win Button */}
          <button
            type="button"
            onClick={handleClaimLevelWin}
            disabled={!challengeValidation.isComplete}
            title={challengeValidation.feedback}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-montserrat font-extrabold transition-all cursor-pointer shadow-xs ${
              challengeValidation.isComplete
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-500 animate-pulse'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-80'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Verify & Win</span>
          </button>

          {/* Return to Hub */}
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('hub')}
              className="ml-1 px-3 py-1.5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-montserrat font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              title="Return to Alche-Me Adventure Hub"
            >
              <span>← Hub</span>
            </button>
          )}
        </div>
      </header>

      {/* Victory Fanfare Toast Notification */}
      {victoryNotification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-montserrat font-extrabold shadow-2xl border-2 border-white flex items-center gap-3 animate-in bounce-in">
          <Award className="w-6 h-6 text-slate-950" />
          <span>{victoryNotification}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN SPLIT VIEWPORT (Left: 2D Sketcher, Right: 3D Model on Black)       */}
      {/* ========================================================================= */}
      <div className="flex-1 w-full h-full flex flex-col md:flex-row relative overflow-hidden">
        {/* Left 50%: 2D Chemical Sketcher */}
        {(viewMode === 'split' || viewMode === '2d') && (
          <div className={`${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'} h-full flex flex-col relative`}>
            <ChemicalSketcher2D
              atoms={atoms2D}
              bonds={bonds2D}
              onChange={handleSketcherChange}
              activeElement={activeElement}
              onSelectElement={setActiveElement}
              onOpenPeriodicTable={() => setShowPeriodicTable(true)}
              onAutoAddHydrogens={handleAutoAddHydrogens}
              onStripHydrogens={handleStripHydrogens}
            />
          </div>
        )}

        {/* Right 50%: 3D WebGL Molecular Viewer (Pure Obsidian Black) */}
        {(viewMode === 'split' || viewMode === '3d') && (
          <div className={`${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'} h-full flex flex-col relative bg-[#000000]`}>
            <MoleculeViewer3D
              rawMolfile={rawMolfile}
              rawXyz={rawXyz}
              atoms={atoms3D}
              bonds={bonds3D}
              displayStyle={displayStyle}
              onDisplayStyleChange={setDisplayStyle}
              measurementMode={measurementMode}
              onMeasurementModeChange={setMeasurementMode}
              selectedAtomIndices={selected3DAtomIndices}
              onAtomSelect={handle3DAtomSelect}
              showLabels={showLabels}
              onToggleLabels={() => setShowLabels(!showLabels)}
              orbitalType="NONE"
              activeMeasurement={measurements[0] || null}
              formula={formula}
              compoundName={compoundName}
              backgroundColor="#000000"
              onSyncFrom2D={() => sync2DTo3D(atoms2D, bonds2D, true)}
              onClean3D={handleEnergyMinimization}
            />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. FULL 118-ELEMENT PERIODIC TABLE MODAL matching Screenshot 2           */}
      {/* ========================================================================= */}
      <PeriodicTableModal
        isOpen={showPeriodicTable}
        onClose={() => setShowPeriodicTable(false)}
        selectedElement={activeElement}
        onSelectElement={(sym) => {
          setActiveElement(sym);
          setShowPeriodicTable(false);
        }}
      />
    </div>
  );
};
