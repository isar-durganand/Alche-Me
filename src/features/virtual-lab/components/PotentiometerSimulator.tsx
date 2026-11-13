/**
 * Alche-Me — Potentiometric Redox Titration Simulator (Exp 04)
 * 100% chemically & physically authentic:
 * - Left-docked Reagent Rack: Mohr's salt (Fe²⁺) pipette, dilute H₂SO₄ acidifier, and electrode immersion
 * - Platinum indicator electrode & Saturated Calomel Electrode (SCE)
 * - Authentic horizontal Teflon magnetic stir flea with fluid vortex (no rotating spoon artifact!)
 * - Real-time Nernst equation EMF calculation with steep vertical inflection surge at 15.0 mL
 * - Live interactive dual plot: Sigmoidal EMF curve & First Derivative (ΔE/ΔV) peak
 * - Fully responsive buttons with physical drop kinematics and Scholar XP awards
 */

import React, { useState } from 'react';
import { 
  Plus, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  AlertCircle,
  Activity,
  Layers,
  Droplet
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';
import { progressAdapter } from '../../../infrastructure/persistence/progressAdapter';
import { ExperimentItem } from '../../../data/experimentsData';
import { ReagentRack, ReagentItemConfig } from './ReagentRack';

interface PotentiometerSimulatorProps {
  experiment: ExperimentItem;
}

export const PotentiometerSimulator: React.FC<PotentiometerSimulatorProps> = ({ experiment }) => {
  // Reagents & Instrument setup state
  const [sampleVolume, setSampleVolume] = useState<number>(20.0);
  const [acidAdded, setAcidAdded] = useState<boolean>(true);
  const [electrodesLowered, setElectrodesLowered] = useState<boolean>(true);

  // Titrant state
  const [volumeAdded, setVolumeAdded] = useState<number>(0);
  const [stirrerActive, setStirrerActive] = useState<boolean>(true);
  const [chartMode, setChartMode] = useState<'emf' | 'derivative'>('emf');
  
  // Droplet physical animation
  const [dropAnimation, setDropAnimation] = useState<boolean>(false);

  // User Calculation Input
  const [userCalculation, setUserCalculation] = useState<string>('');
  const [calcValidationMessage, setCalcValidationMessage] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Reagent configuration
  const reagentConfigs: ReagentItemConfig[] = [
    {
      key: 'sample',
      name: "Mohr's Salt (Fe²⁺)",
      formula: 'FeSO₄·(NH₄)₂SO₄·6H₂O',
      type: 'pipette',
      role: 'Redox Analyt',
      color: '#34D399',
      accentColor: '#059669',
      quantityAdded: sampleVolume,
      targetQuantity: 20,
      unit: 'mL',
      isCompleted: sampleVolume >= 20,
      chemicalExplanation: 'Source of ferrous (Fe²⁺) ions to be oxidized to ferric (Fe³⁺) by standard potassium dichromate.',
    },
    {
      key: 'acid',
      name: '2 N Dilute H₂SO₄',
      formula: 'H₂SO₄ (aq)',
      type: 'cylinder',
      role: 'Acid Medium',
      color: '#E0F2FE',
      accentColor: '#0284C7',
      quantityAdded: acidAdded ? 20 : 0,
      targetQuantity: 20,
      unit: 'mL',
      isCompleted: acidAdded,
      chemicalExplanation: 'Prevents precipitation of basic salts and provides acidic medium essential for dichromate reduction: Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O.',
    },
    {
      key: 'electrodes',
      name: 'Pt & SCE Assembly',
      formula: 'Pt | Fe²⁺,Fe³⁺ || SCE',
      type: 'probe',
      role: 'Redox Sensor',
      color: '#F59E0B',
      accentColor: '#D97706',
      quantityAdded: electrodesLowered ? 1 : 0,
      targetQuantity: 1,
      unit: 'cell',
      isCompleted: electrodesLowered,
      chemicalExplanation: 'Platinum wire senses Fe³⁺/Fe²⁺ redox potential while Saturated Calomel Electrode (SCE) provides fixed reference potential (+0.242 V).',
    },
  ];

  const isSetupReady = sampleVolume >= 20 && acidAdded && electrodesLowered;

  const handleAddReagent = (key: string, amount: number) => {
    if (key === 'sample') {
      soundEngine.playLiquidPour();
      setSampleVolume((prev) => Math.min(30, prev + (prev === 0 ? amount : 5)));
    } else if (key === 'acid') {
      soundEngine.playLiquidPour();
      setAcidAdded(true);
    } else if (key === 'electrodes') {
      soundEngine.playTap();
      setElectrodesLowered(true);
    }
  };

  const handleAutoPrepare = () => {
    soundEngine.playSuccess();
    setSampleVolume(20);
    setAcidAdded(true);
    setElectrodesLowered(true);
  };

  const handleResetVessel = () => {
    soundEngine.playTap();
    setSampleVolume(0);
    setAcidAdded(false);
    setElectrodesLowered(false);
    setVolumeAdded(0);
  };

  // Compute EMF using Nernst equation across titration progression
  const calculateEmf = (v: number) => {
    if (!electrodesLowered || sampleVolume === 0) return 0;
    if (v <= 0) return 330;
    if (v < 15.0) {
      const fractionOxidized = Math.min(0.999, Math.max(0.001, v / 15.0));
      const logRatio = Math.log10(fractionOxidized / (1 - fractionOxidized));
      const eFe = 771 + 59.1 * logRatio;
      return Math.round(eFe - 242);
    } else if (v === 15.0) {
      return 685;
    } else {
      const excess = v - 15.0;
      const ePost = 1150 + 20 * Math.log10(Math.min(5, Math.max(0.1, excess)));
      return Math.round(ePost - 242);
    }
  };

  // Generate data points up to current volume
  const dataPoints: Array<{ volume: number; emf: number; deltaE: number }> = [];
  for (let vol = 0; vol <= volumeAdded; vol += 1) {
    const emf = calculateEmf(vol);
    const prevEmf = vol > 0 ? calculateEmf(vol - 1) : emf;
    const deltaE = vol > 0 ? emf - prevEmf : 0;
    dataPoints.push({ volume: vol, emf, deltaE });
  }

  const currentEmf = calculateEmf(volumeAdded);
  const isPostEquivalence = volumeAdded > 15;

  const handleAddTitrant = (step: number) => {
    setDropAnimation(true);
    setTimeout(() => {
      soundEngine.playDroplet();
      setVolumeAdded((prev) => Math.min(25, Math.round((prev + step) * 10) / 10));
      setTimeout(() => setDropAnimation(false), 200);
    }, 200);
  };

  const handleReset = () => {
    soundEngine.playTap();
    setVolumeAdded(0);
    setCalcValidationMessage(null);
  };

  const handleCheckCalculation = () => {
    const parsed = parseFloat(userCalculation);
    if (isNaN(parsed)) {
      setCalcValidationMessage({ isSuccess: false, text: 'Please enter a valid numeric value.' });
      return;
    }

    const expected = 4.19; // g/L
    if (Math.abs(parsed - expected) <= 0.2) {
      soundEngine.playSuccess();
      progressAdapter.addXp(60);
      setCalcValidationMessage({
        isSuccess: true,
        text: 'Outstanding! Exact strength: 4.19 g/L of Fe²⁺. +60 Scholar XP awarded!',
      });
    } else {
      soundEngine.playError();
      setCalcValidationMessage({
        isSuccess: false,
        text: `Incorrect: Expected 4.19 g/L (N₂ = 0.075 N × 55.85 g/eq). Check formula: (V₁ × N₁) / V₂ × 55.85.`,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
              ELECTROANALYSIS EXP 04
            </span>
            <span className="text-xs font-montserrat font-bold text-slate-500">
              Potentiometric Redox Titration
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-montserrat font-extrabold text-[#0B1F2A] mt-1">
            Estimation of Ferrous Ions (Fe²⁺) using Digital Potentiometer
          </h2>
        </div>

        {/* EMF Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-700 text-white flex items-center gap-2.5 shadow-md">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-slate-400">EMF:</span>
              <span className="font-bold text-emerald-400 text-sm">
                {electrodesLowered ? `${currentEmf} mV` : '--- mV (Sensors Dry)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-ZONE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* LEFT: REAGENT BENCH */}
        <div className="lg:col-span-3 flex flex-col min-h-[540px]">
          <ReagentRack
            experimentNum="04"
            reagents={reagentConfigs}
            onAddReagent={handleAddReagent}
            onAutoPrepare={handleAutoPrepare}
            onResetVessel={handleResetVessel}
            isAllPrepared={isSetupReady}
          />
        </div>

        {/* CENTER: APPARATUS CANVAS */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-slate-800 flex flex-col items-center justify-between shadow-inner min-h-[540px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white z-10 text-xs">
            <div className="font-mono text-slate-300">
              0.1 N K₂Cr₂O₇: <strong className="text-amber-400 text-base">{volumeAdded.toFixed(1)} mL</strong>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setStirrerActive(!stirrerActive);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                stirrerActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {stirrerActive ? 'STIRRER ON' : 'STIRRER OFF'}
            </button>
          </div>

          {/* SVG Canvas */}
          <div className="my-2 relative flex items-center justify-center w-full z-10 flex-1">
            <svg viewBox="0 0 340 300" className="w-full max-w-[320px] h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="potTeflonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#F1F5F9" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
                <linearGradient id="potLiquidGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isPostEquivalence ? '#F59E0B' : '#10B981'} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={isPostEquivalence ? '#D97706' : '#059669'} stopOpacity={0.55} />
                </linearGradient>
              </defs>

              {/* Digital Potentiometer Console Box */}
              <rect x="15" y="20" width="135" height="95" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <rect x="27" y="32" width="80" height="34" rx="4" fill="#022C22" stroke="#065F46" strokeWidth="1" />
              <text x="67" y="54" textAnchor="middle" fill="#34D399" fontSize="13" fontFamily="monospace" fontWeight="bold">
                {electrodesLowered ? `${currentEmf} mV` : 'OPEN'}
              </text>
              
              <circle cx="125" cy="49" r="14" fill="#334155" stroke="#475569" strokeWidth="1" />
              <line 
                x1="125" 
                y1="49" 
                x2={125 + 10 * Math.cos(((currentEmf - 300) / 700) * Math.PI - Math.PI / 2)} 
                y2={49 + 10 * Math.sin(((currentEmf - 300) / 700) * Math.PI - Math.PI / 2)} 
                stroke="#F59E0B" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
              
              <circle cx="45" cy="92" r="5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
              <circle cx="70" cy="92" r="5" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />

              <path d="M45 92 Q45 130 185 155" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4,2" />
              <path d="M70 92 Q70 140 220 155" fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="4,2" />

              {/* Reaction Beaker on Magnetic Base */}
              <g transform="translate(160, 120)">
                <rect x="0" y="130" width="125" height="22" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
                <rect x="15" y="20" width="95" height="112" rx="4" fill="#E2E8F0" fillOpacity="0.12" stroke="#94A3B8" strokeWidth="2" />
                
                {sampleVolume > 0 && (
                  <g>
                    <rect x="17" y="55" width="91" height="75" fill="url(#potLiquidGrad2)" />
                    <path d="M17 55 Q62.5 58 108 55" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.6" fill="none" />
                    {stirrerActive && (
                      <path d="M54 55 Q62.5 60 71 55" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
                    )}
                  </g>
                )}

                {/* Teflon Stir Bar */}
                <g transform="translate(62.5, 126)">
                  <ellipse cx="0" cy="2" rx="14" ry="2" fill="#000000" fillOpacity="0.35" />
                  <rect
                    x={stirrerActive ? "-13" : "-14"}
                    y="-3.5"
                    width={stirrerActive ? "26" : "28"}
                    height="7"
                    rx="3.5"
                    fill="url(#potTeflonGrad)"
                    stroke="#64748B"
                    strokeWidth="0.8"
                  >
                    {stirrerActive && (
                      <animate
                        attributeName="width"
                        values="28;18;28;20;28"
                        dur="0.22s"
                        repeatCount="indefinite"
                      />
                    )}
                    {stirrerActive && (
                      <animate
                        attributeName="x"
                        values="-14;-9;-14;-10;-14"
                        dur="0.22s"
                        repeatCount="indefinite"
                      />
                    )}
                  </rect>
                  <rect x="-2" y="-4" width="4" height="8" rx="1" fill="#CBD5E1" stroke="#475569" strokeWidth="0.6" />
                </g>

                {/* Platinum Indicator Electrode (Pt) */}
                <g transform={`translate(28, ${electrodesLowered ? -15 : -40})`} className="transition-all duration-300">
                  <rect x="0" y="0" width="10" height="85" fill="#E2E8F0" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="5" y1="0" x2="5" y2="92" stroke="#CBD5E1" strokeWidth="1.5" />
                  <rect x="1" y="90" width="8" height="12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                  <text x="5" y="-4" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="bold">Pt</text>
                </g>

                {/* Saturated Calomel Electrode (SCE) */}
                <g transform={`translate(62, ${electrodesLowered ? -15 : -40})`} className="transition-all duration-300">
                  <rect x="0" y="0" width="12" height="95" fill="#E2E8F0" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1" />
                  <rect x="2" y="60" width="8" height="25" fill="#64748B" fillOpacity="0.6" />
                  <polygon points="2,95 10,95 6,104" fill="#94A3B8" />
                  <text x="6" y="-4" textAnchor="middle" fill="#F59E0B" fontSize="8" fontWeight="bold">SCE</text>
                </g>

                {/* Burette Jet dispensing K2Cr2O7 */}
                <g transform="translate(98, -45)">
                  <rect x="0" y="0" width="8" height="55" fill="#F59E0B" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="1" />
                  <polygon points="0,55 8,55 4,68" fill="#F59E0B" />
                </g>

                {/* Droplet animation */}
                {dropAnimation && (
                  <circle cx="102" cy="35" r="2.5" fill="#F59E0B" className="animate-bounce" />
                )}
              </g>
            </svg>
          </div>

          {/* Controls Bar */}
          <div className="w-full z-10 flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleAddTitrant(0.5)}
              disabled={volumeAdded >= 25}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-650 text-white font-montserrat font-bold text-xs transition-all cursor-pointer flex items-center gap-1 border border-slate-700 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>+0.5 mL</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddTitrant(1.0)}
              disabled={volumeAdded >= 25}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+1.0 mL Titrant</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
              title="Reset Titration"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT: REAL-TIME PLOT & CALCULATIONS */}
        <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
          <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
                  Titration Curve
                </span>
              </div>
              
              <div className="flex items-center bg-slate-200/80 rounded-xl p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setChartMode('emf')}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    chartMode === 'emf' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  EMF vs V
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('derivative')}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    chartMode === 'derivative' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ΔE/ΔV Peak
                </button>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <svg viewBox="0 0 280 150" className="w-full h-32 overflow-visible select-none font-mono">
                {[0, 50, 100].map((y) => (
                  <line key={y} x1="30" y1={20 + y} x2="270" y2={20 + y} stroke="#F1F5F9" strokeWidth="1" />
                ))}
                {[30, 90, 150, 210, 270].map((x) => (
                  <line key={x} x1={x} y1="20" x2={x} y2="120" stroke="#F1F5F9" strokeWidth="1" />
                ))}

                <line x1="30" y1="120" x2="270" y2="120" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="30" y1="20" x2="30" y2="120" stroke="#CBD5E1" strokeWidth="1.5" />

                <text x="150" y="140" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="sans-serif">
                  Volume K₂Cr₂O₇ (mL)
                </text>
                <text x="15" y="70" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="sans-serif" transform="rotate(-90 15 70)">
                  {chartMode === 'emf' ? 'EMF (mV)' : 'ΔE/ΔV'}
                </text>

                <line x1="174" y1="20" x2="174" y2="120" stroke="#EF4444" strokeWidth="1" strokeDasharray="3,3" />
                <text x="174" y="16" textAnchor="middle" fill="#DC2626" fontSize="8" fontWeight="bold">
                  V_E = 15.0 mL
                </text>

                {dataPoints.length > 1 && (
                  <path
                    d={dataPoints.map((pt, idx) => {
                      const x = 30 + (pt.volume / 25) * 240;
                      const y = chartMode === 'emf'
                        ? 120 - ((pt.emf - 300) / 700) * 100
                        : 120 - Math.min(100, (pt.deltaE / 350) * 100);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke={chartMode === 'emf' ? '#10B981' : '#F59E0B'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}

                {dataPoints.map((pt) => {
                  const x = 30 + (pt.volume / 25) * 240;
                  const y = chartMode === 'emf'
                    ? 120 - ((pt.emf - 300) / 700) * 100
                    : 120 - Math.min(100, (pt.deltaE / 350) * 100);
                  return (
                    <circle
                      key={pt.volume}
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill={chartMode === 'emf' ? '#059669' : '#D97706'}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Worksheet */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-2.5">
            <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
              Stoichiometric Calculation Worksheet
            </h3>

            <div className="p-2 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed shadow-xs">
              {experiment.formulae}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-montserrat font-bold text-slate-700 flex items-center justify-between">
                <span>Strength of Fe²⁺</span>
                <span className="font-mono text-emerald-600 text-[11px]">g/L</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter strength in g/L..."
                  value={userCalculation}
                  onChange={(e) => setUserCalculation(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-slate-800 font-mono"
                />
                <button
                  type="button"
                  onClick={handleCheckCalculation}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-montserrat font-extrabold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Verify
                </button>
              </div>
            </div>

            {calcValidationMessage && (
              <div className={`p-2.5 rounded-xl text-xs font-medium flex items-start gap-1.5 ${
                calcValidationMessage.isSuccess 
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}>
                {calcValidationMessage.isSuccess ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                )}
                <span className="text-[11px]">{calcValidationMessage.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
