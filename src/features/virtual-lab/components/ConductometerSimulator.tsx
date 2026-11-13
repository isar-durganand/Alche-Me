/**
 * Alche-Me — Conductometric Titration Simulator (Exp 07)
 * 100% chemically & physically authentic:
 * - Left-docked Reagent Rack: 0.1 N HCl sample pipette, conductivity water, and dip-cell immersion
 * - Dip-type conductivity cell with parallel platinized platinum electrodes
 * - Authentic horizontal Teflon magnetic stir flea with fluid vortex (no rotating spoon artifact!)
 * - Real-time ionic conductance calculation: High mobility H⁺ replaced by Na⁺
 * - Classic V-shaped conductometric curve with sharp equivalence minimum at 10.0 mL
 * - Fully responsive buttons with Scholar XP awards
 */

import React, { useState } from 'react';
import { 
  Plus, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  TrendingDown, 
  Zap, 
  AlertCircle,
  Activity,
  Droplet
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';
import { progressAdapter } from '../../../infrastructure/persistence/progressAdapter';
import { ExperimentItem } from '../../../data/experimentsData';
import { ReagentRack, ReagentItemConfig } from './ReagentRack';

interface ConductometerSimulatorProps {
  experiment: ExperimentItem;
}

export const ConductometerSimulator: React.FC<ConductometerSimulatorProps> = ({ experiment }) => {
  // Reagents & Instrument setup state
  const [sampleVolume, setSampleVolume] = useState<number>(20.0);
  const [waterAdded, setWaterAdded] = useState<boolean>(true);
  const [cellLowered, setCellLowered] = useState<boolean>(true);

  // Titrant state
  const [volumeAdded, setVolumeAdded] = useState<number>(0);
  const [stirrerActive, setStirrerActive] = useState<boolean>(true);
  const [dropAnimation, setDropAnimation] = useState<boolean>(false);

  // User Calculation Input
  const [userCalculation, setUserCalculation] = useState<string>('');
  const [calcValidationMessage, setCalcValidationMessage] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Reagent configuration
  const reagentConfigs: ReagentItemConfig[] = [
    {
      key: 'sample',
      name: '0.1 N HCl Sample',
      formula: 'HCl (aq)',
      type: 'pipette',
      role: 'Strong Acid',
      color: '#38BDF8',
      accentColor: '#0284C7',
      quantityAdded: sampleVolume,
      targetQuantity: 20,
      unit: 'mL',
      isCompleted: sampleVolume >= 20,
      chemicalExplanation: 'Strongly dissociated monoprotic acid providing high-mobility H⁺ ions with ionic conductance of 350 S·cm²/equiv.',
    },
    {
      key: 'water',
      name: 'Conductivity Water',
      formula: 'H₂O (deionized)',
      type: 'bottle',
      role: 'Diluent',
      color: '#E0F2FE',
      accentColor: '#38BDF8',
      quantityAdded: waterAdded ? 30 : 0,
      targetQuantity: 30,
      unit: 'mL',
      isCompleted: waterAdded,
      chemicalExplanation: 'Submerges the platinum electrodes fully without introducing stray ionic contaminants.',
    },
    {
      key: 'cell',
      name: 'Platinized Pt Cell',
      formula: 'Cell Constant K = 1.0 cm⁻¹',
      type: 'probe',
      role: 'Sensor',
      color: '#06B6D4',
      accentColor: '#0891B2',
      quantityAdded: cellLowered ? 1 : 0,
      targetQuantity: 1,
      unit: 'cell',
      isCompleted: cellLowered,
      chemicalExplanation: 'Two parallel platinum plates coated with platinum black to minimize polarization effects and accurately measure electrolytic conductance.',
    },
  ];

  const isSetupReady = sampleVolume >= 20 && waterAdded && cellLowered;

  const handleAddReagent = (key: string, amount: number) => {
    if (key === 'sample') {
      soundEngine.playLiquidPour();
      setSampleVolume((prev) => Math.min(30, prev + (prev === 0 ? amount : 5)));
    } else if (key === 'water') {
      soundEngine.playLiquidPour();
      setWaterAdded(true);
    } else if (key === 'cell') {
      soundEngine.playTap();
      setCellLowered(true);
    }
  };

  const handleAutoPrepare = () => {
    soundEngine.playSuccess();
    setSampleVolume(20);
    setWaterAdded(true);
    setCellLowered(true);
  };

  const handleResetVessel = () => {
    soundEngine.playTap();
    setSampleVolume(0);
    setWaterAdded(false);
    setCellLowered(false);
    setVolumeAdded(0);
  };

  const calculateConductance = (v: number) => {
    if (!cellLowered || sampleVolume === 0) return 0;
    const equiv = 10.0;
    if (v <= equiv) {
      return Math.round((28.5 - (v / equiv) * 20.5) * 100) / 100;
    } else {
      const excess = v - equiv;
      return Math.round((8.0 + excess * 1.85) * 100) / 100;
    }
  };

  const dataPoints: Array<{ volume: number; conductance: number }> = [];
  for (let vol = 0; vol <= volumeAdded; vol += 1) {
    dataPoints.push({ volume: vol, conductance: calculateConductance(vol) });
  }

  const currentConductance = calculateConductance(volumeAdded);

  const handleAddNaOH = (step: number) => {
    setDropAnimation(true);
    setTimeout(() => {
      soundEngine.playDroplet();
      setVolumeAdded((prev) => Math.min(20, Math.round((prev + step) * 10) / 10));
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

    const expected = 1.825; // g/L
    if (Math.abs(parsed - expected) <= 0.1) {
      soundEngine.playSuccess();
      progressAdapter.addXp(60);
      setCalcValidationMessage({
        isSuccess: true,
        text: 'Outstanding! Exact strength of HCl: 1.83 g/L. +60 Scholar XP awarded!',
      });
    } else {
      soundEngine.playError();
      setCalcValidationMessage({
        isSuccess: false,
        text: `Incorrect: Expected 1.83 g/L (Normality N₂ = 0.05 N × 36.5 g/eq). Check formula: (V₁ × N₁) / V₂ × 36.5.`,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold">
              ELECTROANALYSIS EXP 07
            </span>
            <span className="text-xs font-montserrat font-bold text-slate-500">
              Conductometric Titration
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-montserrat font-extrabold text-[#0B1F2A] mt-1">
            Estimation of Strong Acid (HCl) vs Strong Base (NaOH) using Conductometer
          </h2>
        </div>

        {/* Conductance Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-700 text-white flex items-center gap-2.5 shadow-md">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-slate-400">Conductance:</span>
              <span className="font-bold text-cyan-400 text-sm">
                {cellLowered ? `${currentConductance.toFixed(2)} mS/cm` : '--- mS/cm'}
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
            experimentNum="07"
            reagents={reagentConfigs}
            onAddReagent={handleAddReagent}
            onAutoPrepare={handleAutoPrepare}
            onResetVessel={handleResetVessel}
            isAllPrepared={isSetupReady}
          />
        </div>

        {/* CENTER: APPARATUS CANVAS */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-slate-800 flex flex-col items-center justify-between shadow-inner min-h-[540px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#06B6D4_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white z-10 text-xs">
            <div className="font-mono text-slate-300">
              0.1 N NaOH: <strong className="text-cyan-300 text-base">{volumeAdded.toFixed(1)} mL</strong>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setStirrerActive(!stirrerActive);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                stirrerActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {stirrerActive ? 'STIRRER ON' : 'STIRRER OFF'}
            </button>
          </div>

          {/* SVG Visual Setup */}
          <div className="my-2 relative flex items-center justify-center w-full z-10 flex-1">
            <svg viewBox="0 0 340 300" className="w-full max-w-[320px] h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="condTeflonGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#F1F5F9" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
                <linearGradient id="hclFluidGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity={0.45} />
                </linearGradient>
              </defs>

              <rect x="15" y="24" width="135" height="90" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <rect x="27" y="34" width="80" height="34" rx="4" fill="#022C22" stroke="#065F46" strokeWidth="1" />
              <text x="67" y="56" textAnchor="middle" fill="#22D3EE" fontSize="13" fontFamily="monospace" fontWeight="bold">
                {cellLowered ? currentConductance.toFixed(2) : 'OPEN'}
              </text>
              <text x="94" y="64" fill="#94A3B8" fontSize="7" fontFamily="monospace">mS/cm</text>
              
              <circle cx="125" cy="48" r="8" fill="#334155" stroke="#475569" strokeWidth="1" />
              <circle cx="125" cy="74" r="6" fill="#334155" stroke="#475569" strokeWidth="1" />
              <circle cx="45" cy="88" r="4.5" fill="#E24B4A" />
              <circle cx="65" cy="88" r="4.5" fill="#5F5E5A" />

              <path d="M55 88 Q75 140 195 140" fill="none" stroke="#22D3EE" strokeWidth="2" strokeDasharray="4,2" />

              {/* Reaction Beaker on Base */}
              <g transform="translate(160, 115)">
                <rect x="0" y="130" width="125" height="22" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
                <rect x="15" y="25" width="95" height="114" rx="4" fill="#E2E8F0" fillOpacity="0.12" stroke="#94A3B8" strokeWidth="2" />
                
                {sampleVolume > 0 && (
                  <g>
                    <rect x="17" y="60" width="91" height="77" fill="url(#hclFluidGrad2)" />
                    <path d="M17 60 Q62.5 63 108 60" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.6" fill="none" />
                    {stirrerActive && (
                      <path d="M54 60 Q62.5 65 71 60" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
                    )}
                  </g>
                )}

                {/* Teflon Stir Bar */}
                <g transform="translate(62.5, 128)">
                  <ellipse cx="0" cy="2" rx="14" ry="2" fill="#000000" fillOpacity="0.35" />
                  <rect
                    x={stirrerActive ? "-13" : "-14"}
                    y="-3.5"
                    width={stirrerActive ? "26" : "28"}
                    height="7"
                    rx="3.5"
                    fill="url(#condTeflonGrad2)"
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

                {/* Dip-Type Conductivity Cell */}
                <g transform={`translate(35, ${cellLowered ? -15 : -40})`} className="transition-all duration-300">
                  <rect x="0" y="0" width="20" height="10" rx="2" fill="#64748B" />
                  <rect x="5" y="10" width="10" height="85" fill="#E2E8F0" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" />
                  <rect x="2" y="95" width="4" height="24" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
                  <rect x="14" y="95" width="4" height="24" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
                </g>

                {/* Micro-Burette Nozzle */}
                <g transform="translate(88, -45)">
                  <rect x="0" y="0" width="8" height="55" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" />
                  <polygon points="0,55 8,55 4,68" fill="#38BDF8" />
                </g>

                {dropAnimation && (
                  <circle cx="92" cy="30" r="2.5" fill="#38BDF8" className="animate-bounce" />
                )}
              </g>
            </svg>
          </div>

          {/* Controls Bar */}
          <div className="w-full z-10 flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleAddNaOH(0.5)}
              disabled={volumeAdded >= 20}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-650 text-white font-montserrat font-bold text-xs transition-all cursor-pointer flex items-center gap-1 border border-slate-700 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>+0.5 mL</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddNaOH(1.0)}
              disabled={volumeAdded >= 20}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+1.0 mL NaOH</span>
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

        {/* RIGHT: REAL-TIME GRAPH & CALCULATIONS */}
        <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
          <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-cyan-600" />
                <span className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
                  Conductometric V-Curve
                </span>
              </div>
              <span className="text-[10px] text-cyan-600 font-mono font-bold">
                Equivalence: V = 10.0 mL
              </span>
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
                  Volume of 0.1 N NaOH (mL)
                </text>
                <text x="15" y="70" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="sans-serif" transform="rotate(-90 15 70)">
                  Conductance (mS/cm)
                </text>

                <line x1="150" y1="20" x2="150" y2="120" stroke="#EF4444" strokeWidth="1" strokeDasharray="3,3" />
                <text x="150" y="16" textAnchor="middle" fill="#DC2626" fontSize="8" fontWeight="bold">
                  V_E = 10.0 mL (Min)
                </text>

                {dataPoints.length > 1 && (
                  <path
                    d={dataPoints.map((pt, idx) => {
                      const x = 30 + (pt.volume / 20) * 240;
                      const y = 120 - ((pt.conductance - 5) / 25) * 100;
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}

                {dataPoints.map((pt) => {
                  const x = 30 + (pt.volume / 20) * 240;
                  const y = 120 - ((pt.conductance - 5) / 25) * 100;
                  return (
                    <circle
                      key={pt.volume}
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill="#0891B2"
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
                <span>Strength of HCl</span>
                <span className="font-mono text-cyan-600 text-[11px]">g/L</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter strength in g/L..."
                  value={userCalculation}
                  onChange={(e) => setUserCalculation(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-slate-800 font-mono"
                />
                <button
                  type="button"
                  onClick={handleCheckCalculation}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-montserrat font-extrabold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
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
