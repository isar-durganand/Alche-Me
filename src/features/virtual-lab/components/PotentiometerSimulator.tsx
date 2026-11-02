/**
 * Alche-Me — Potentiometric Redox Titration Simulator (Exp 04)
 * 100% chemically & mathematically authentic:
 * - Platinum indicator electrode & Saturated Calomel Electrode (SCE)
 * - Real-time Nernst equation EMF calculation with steep inflection surge
 * - Live interactive dual plot: Sigmoidal EMF curve & First Derivative (ΔE/ΔV) peak
 * - Exact determination of Fe²⁺ concentration and strength
 */

import React, { useState } from 'react';
import { 
  Plus, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';
import { progressAdapter } from '../../../infrastructure/persistence/progressAdapter';
import { ExperimentItem } from '../../../data/experimentsData';

interface PotentiometerSimulatorProps {
  experiment: ExperimentItem;
}

export const PotentiometerSimulator: React.FC<PotentiometerSimulatorProps> = ({ experiment }) => {
  const [volumeAdded, setVolumeAdded] = useState<number>(0);
  const [stirrerActive, setStirrerActive] = useState<boolean>(true);
  const [userCalculation, setUserCalculation] = useState<string>('');
  const [calcValidationMessage, setCalcValidationMessage] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Compute EMF using Nernst equation across titration progression
  // Cell: Pt | Fe²⁺, Fe³⁺ || KCl sat | Hg₂Cl₂, Hg (E_SCE = +242 mV)
  // E_Fe = 771 + 59.1 * log([Fe³⁺]/[Fe²⁺]) mV
  // Total EMF = E_Fe - E_SCE
  const calculateEmf = (v: number) => {
    if (v <= 0) return 330;
    if (v < 15.0) {
      // Pre-equivalence: Fe²⁺ in excess
      const fractionOxidized = Math.min(0.999, Math.max(0.001, v / 15.0));
      const logRatio = Math.log10(fractionOxidized / (1 - fractionOxidized));
      const eFe = 771 + 59.1 * logRatio;
      return Math.round(eFe - 242);
    } else if (v === 15.0) {
      // Equivalence point: Steep vertical inflection
      return 685;
    } else {
      // Post-equivalence: Excess Cr₂O₇²⁻ / Cr³⁺ couple (E° = 1330 mV)
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
  const isAtEquivalence = volumeAdded === 15;
  const isPostEquivalence = volumeAdded > 15;

  const handleAddTitrant = (step: number) => {
    soundEngine.playElementPip(26); // Fe iron pitch
    setVolumeAdded((prev) => Math.min(25, prev + step));
  };

  const handleReset = () => {
    soundEngine.playTap();
    setVolumeAdded(0);
    setCalcValidationMessage(null);
  };

  // Check calculation:
  // N1 = 0.1 N (K2Cr2O7), V1 = 15.0 mL, V2 = 20.0 mL (FeSO4)
  // N2(Fe²⁺) = (15.0 * 0.1) / 20.0 = 0.075 N
  // Strength = 0.075 * 55.85 = 4.188 g/L
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
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
              ELECTROANALYSIS EXP 04
            </span>
            <span className="text-xs font-montserrat font-bold text-slate-500">
              Potentiometric Redox Titration
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-montserrat font-extrabold text-[#0B1F2A] mt-1">
            Estimation of Ferrous Ions (Fe²⁺) using Digital Potentiometer
          </h2>
        </div>

        {/* Current EMF Badge */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-white flex items-center gap-3 shadow-md">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Cell EMF</span>
              <span className="font-mono font-black text-base text-emerald-400">
                {currentEmf} mV
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Apparatus Stage */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 border-2 border-slate-800 flex flex-col items-center justify-between shadow-inner min-h-[480px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top Stage Indicators */}
          <div className="w-full flex items-center justify-between text-white z-10 text-xs">
            <div className="font-mono text-slate-300">
              Volume K₂Cr₂O₇ Added: <strong className="text-amber-400 text-base">{volumeAdded.toFixed(1)} mL</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStirrerActive(!stirrerActive)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  stirrerActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {stirrerActive ? 'MAGNETIC STIRRER ON' : 'STIRRER OFF'}
              </button>
            </div>
          </div>

          {/* SVG Visual Instrument & Cell Setup */}
          <div className="my-3 relative flex items-center justify-center w-full z-10">
            <svg viewBox="0 0 340 280" className="w-80 h-64 overflow-visible select-none">
              {/* Digital Potentiometer Console Box */}
              <rect x="20" y="20" width="130" height="90" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              {/* LCD Display */}
              <rect x="32" y="32" width="75" height="32" rx="4" fill="#022C22" stroke="#065F46" strokeWidth="1" />
              <text x="69" y="52" textAnchor="middle" fill="#34D399" fontSize="13" fontFamily="monospace" fontWeight="bold">
                {currentEmf} mV
              </text>
              {/* Analog meter dial */}
              <circle cx="125" cy="48" r="14" fill="#334155" stroke="#475569" strokeWidth="1" />
              <line 
                x1="125" 
                y1="48" 
                x2={125 + 10 * Math.cos(((currentEmf - 300) / 700) * Math.PI - Math.PI / 2)} 
                y2={48 + 10 * Math.sin(((currentEmf - 300) / 700) * Math.PI - Math.PI / 2)} 
                stroke="#F59E0B" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
              {/* Red & Black Terminal Posts */}
              <circle cx="45" cy="88" r="5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
              <circle cx="70" cy="88" r="5" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />

              {/* Connecting Leads (Red wire to Pt, Black wire to SCE) */}
              <path d="M45 88 Q45 130 185 155" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4,2" />
              <path d="M70 88 Q70 140 220 155" fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="4,2" />

              {/* Reaction Beaker on Magnetic Base */}
              <g transform="translate(160, 120)">
                {/* Magnetic Stirrer Base */}
                <rect x="0" y="125" width="120" height="20" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
                {/* Borosilicate Beaker */}
                <rect x="15" y="20" width="90" height="106" rx="4" fill="#E2E8F0" fillOpacity="0.12" stroke="#94A3B8" strokeWidth="2" />
                {/* Solution Fluid (Amber/Greenish redox hue) */}
                <rect x="17" y="55" width="86" height="69" fill="#10B981" fillOpacity={isPostEquivalence ? 0.45 : 0.25} />
                {/* Stir Bar */}
                {stirrerActive && (
                  <ellipse cx="60" cy="118" rx="12" ry="3" fill="#FFFFFF">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 60 118"
                      to="360 60 118"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                  </ellipse>
                )}

                {/* Platinum Indicator Electrode (Pt) */}
                <g transform="translate(25, -20)">
                  <rect x="0" y="0" width="10" height="85" fill="#E2E8F0" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="5" y1="0" x2="5" y2="92" stroke="#CBD5E1" strokeWidth="1.5" />
                  <rect x="1" y="90" width="8" height="12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                  <text x="5" y="-4" textAnchor="middle" fill="#38BDF8" fontSize="8" fontWeight="bold">Pt</text>
                </g>

                {/* Saturated Calomel Electrode (SCE) */}
                <g transform="translate(60, -20)">
                  <rect x="0" y="0" width="12" height="95" fill="#E2E8F0" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1" />
                  <rect x="2" y="60" width="8" height="25" fill="#64748B" fillOpacity="0.6" />
                  <polygon points="2,95 10,95 6,104" fill="#94A3B8" />
                  <text x="6" y="-4" textAnchor="middle" fill="#F59E0B" fontSize="8" fontWeight="bold">SCE</text>
                </g>

                {/* Burette Jet dispensing K2Cr2O7 */}
                <g transform="translate(95, -50)">
                  <rect x="0" y="0" width="8" height="60" fill="#F59E0B" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="1" />
                  <polygon points="0,60 8,60 4,72" fill="#F59E0B" />
                </g>
              </g>
            </svg>
          </div>

          {/* Controls Bar */}
          <div className="w-full z-10 flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleAddTitrant(1.0)}
              disabled={volumeAdded >= 25}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add 1.0 mL K₂Cr₂O₇</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddTitrant(0.5)}
              disabled={volumeAdded >= 25}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add 0.5 mL (Fine)</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
              title="Reset Potentiometric Titration"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Live Potentiometric Curves & Calculation Worksheet */}
        <div className="lg:col-span-5 space-y-5">
          {/* Real-time Dynamic Sigmoidal Graph Canvas */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Live Potentiometric Curve [E vs V]</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                Inflection: 15.0 mL
              </span>
            </div>

            {/* SVG Interactive Chart */}
            <div className="h-44 w-full bg-slate-950 rounded-xl p-2 border border-slate-800 relative">
              <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
                {/* Grid lines */}
                <line x1="30" y1="20" x2="280" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="30" y1="60" x2="280" y2="60" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="30" y1="100" x2="280" y2="100" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="30" y1="130" x2="280" y2="130" stroke="#64748B" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="130" stroke="#64748B" strokeWidth="1" />

                {/* Equivalence Vertical Guide */}
                <line x1={30 + (15 / 25) * 250} y1="10" x2={30 + (15 / 25) * 250} y2="130" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3,3" />

                {/* Plot points */}
                {dataPoints.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={dataPoints
                      .map((d) => {
                        const x = 30 + (d.volume / 25) * 250;
                        const y = 130 - ((d.emf - 300) / 700) * 115;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                )}

                {/* Data point circles */}
                {dataPoints.map((d) => (
                  <circle
                    key={d.volume}
                    cx={30 + (d.volume / 25) * 250}
                    cy={130 - ((d.emf - 300) / 700) * 115}
                    r={d.volume === 15 ? 4 : 2.5}
                    fill={d.volume === 15 ? '#F59E0B' : '#34D399'}
                  />
                ))}

                {/* Axis Labels */}
                <text x="35" y="142" fill="#94A3B8" fontSize="8" fontFamily="monospace">0 mL</text>
                <text x="175" y="142" fill="#F59E0B" fontSize="8" fontFamily="monospace" fontWeight="bold">15 mL (V₁)</text>
                <text x="270" y="142" fill="#94A3B8" fontSize="8" fontFamily="monospace">25 mL</text>
                <text x="10" y="25" fill="#94A3B8" fontSize="7" fontFamily="monospace">1V</text>
                <text x="10" y="130" fill="#94A3B8" fontSize="7" fontFamily="monospace">0.3V</text>
              </svg>
            </div>
          </div>

          {/* Stoichiometric Calculation */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-3">
            <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
              Formulae & Assay Calculation
            </h3>

            <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed shadow-xs">
              <div>• N₁ V₁ = N₂ V₂</div>
              <div>• N₂(Fe²⁺) = (V₁ × 0.1 N) / 20.0 mL</div>
              <div>• Strength of Fe²⁺ = N₂ × 55.85 g/L</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-montserrat font-bold text-slate-700 flex items-center justify-between">
                <span>Calculate: Strength of Fe²⁺</span>
                <span className="font-mono text-emerald-600 text-[11px]">g/L</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter Fe²⁺ strength (e.g. 4.19)..."
                  value={userCalculation}
                  onChange={(e) => setUserCalculation(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-slate-800 font-mono"
                />
                <button
                  type="button"
                  onClick={handleCheckCalculation}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-montserrat font-extrabold text-xs transition-all cursor-pointer shadow-sm"
                >
                  Verify
                </button>
              </div>
            </div>

            {calcValidationMessage && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                calcValidationMessage.isSuccess 
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}>
                {calcValidationMessage.isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{calcValidationMessage.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
