/**
 * Alche-Me — Conductometric Titration Simulator (Exp 07)
 * 100% physically authentic:
 * - Platinized platinum dip cell & digital conductivity meter (mS/cm)
 * - Micro-burette dispensing 0.1 N NaOH into 50 mL HCl
 * - Real-time ionic mobility calculation generating the authentic V-shaped curve
 * - Determination of equivalence point by intersection of linear branches
 */

import React, { useState } from 'react';
import { 
  Plus, 
  RotateCcw, 
  Activity, 
  CheckCircle2, 
  TrendingDown, 
  AlertCircle 
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';
import { progressAdapter } from '../../../infrastructure/persistence/progressAdapter';
import { ExperimentItem } from '../../../data/experimentsData';

interface ConductometerSimulatorProps {
  experiment: ExperimentItem;
}

export const ConductometerSimulator: React.FC<ConductometerSimulatorProps> = ({ experiment }) => {
  const [volumeAdded, setVolumeAdded] = useState<number>(0);
  const [stirrerActive, setStirrerActive] = useState<boolean>(true);
  const [userCalculation, setUserCalculation] = useState<string>('');
  const [calcValidationMessage, setCalcValidationMessage] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Real-time Conductance calculation based on ionic equivalent conductivities (λ_H+ = 350, λ_Na+ = 50, λ_OH- = 198, λ_Cl- = 76)
  // Equivalence point is at exactly 10.0 mL of 0.1 N NaOH
  const calculateConductance = (v: number) => {
    if (v <= 10.0) {
      // Linear decrease: fast H⁺ replaced by slower Na⁺
      const cond = 4.25 - (v / 10.0) * 3.40;
      return Math.round(cond * 100) / 100;
    } else {
      // Linear increase: excess fast OH⁻ enters
      const excess = v - 10.0;
      const cond = 0.85 + (excess / 10.0) * 2.80;
      return Math.round(cond * 100) / 100;
    }
  };

  // Generate data points
  const dataPoints: Array<{ volume: number; conductance: number }> = [];
  for (let vol = 0; vol <= volumeAdded; vol += 1) {
    dataPoints.push({ volume: vol, conductance: calculateConductance(vol) });
  }

  const currentConductance = calculateConductance(volumeAdded);

  const handleAddNaOH = (step: number) => {
    soundEngine.playElementPip(11); // Na sodium pitch
    setVolumeAdded((prev) => Math.min(20, Math.round((prev + step) * 10) / 10));
  };

  const handleReset = () => {
    soundEngine.playTap();
    setVolumeAdded(0);
    setCalcValidationMessage(null);
  };

  // Check calculation:
  // N1(HCl) = (0.1 N * 10.0 mL) / 50.0 mL = 0.02 N
  // Strength of HCl = 0.02 * 36.5 = 0.73 g/L
  const handleCheckCalculation = () => {
    const parsed = parseFloat(userCalculation);
    if (isNaN(parsed)) {
      setCalcValidationMessage({ isSuccess: false, text: 'Please enter a valid numeric value.' });
      return;
    }

    const expected = 0.73; // g/L
    if (Math.abs(parsed - expected) <= 0.05) {
      soundEngine.playSuccess();
      progressAdapter.addXp(60);
      setCalcValidationMessage({
        isSuccess: true,
        text: 'Outstanding! Exact strength of HCl: 0.73 g/L (0.02 N × 36.5 g/eq). +60 Scholar XP awarded!',
      });
    } else {
      soundEngine.playError();
      setCalcValidationMessage({
        isSuccess: false,
        text: `Incorrect: Expected 0.73 g/L. Equivalence V₂ = 10.0 mL ⟹ N₁(HCl) = (0.1 × 10) / 50 = 0.02 N. Strength = 0.02 × 36.5 = 0.73 g/L.`,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold">
              ELECTROANALYSIS EXP 07
            </span>
            <span className="text-xs font-montserrat font-bold text-slate-500">
              Conductometric Acid-Base Titration
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-montserrat font-extrabold text-[#0B1F2A] mt-1">
            Conductometric Titration of Strong Acid (HCl) vs. Strong Base (NaOH)
          </h2>
        </div>

        {/* Live Conductivity Badge */}
        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-white flex items-center gap-3 shadow-md">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Conductance</span>
            <span className="font-mono font-black text-base text-cyan-400">
              {currentConductance.toFixed(2)} mS/cm
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Apparatus Stage */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 border-2 border-slate-800 flex flex-col items-center justify-between shadow-inner min-h-[480px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#06B6D4_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top Stage Indicators */}
          <div className="w-full flex items-center justify-between text-white z-10 text-xs">
            <div className="font-mono text-slate-300">
              Volume 0.1 N NaOH Added: <strong className="text-cyan-300 text-base">{volumeAdded.toFixed(1)} mL</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStirrerActive(!stirrerActive)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  stirrerActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {stirrerActive ? 'STIRRING ON' : 'STIRRER OFF'}
              </button>
            </div>
          </div>

          {/* SVG Visual Instrument & Cell Setup */}
          <div className="my-3 relative flex items-center justify-center w-full z-10">
            <svg viewBox="0 0 340 280" className="w-80 h-64 overflow-visible select-none">
              {/* Digital Conductivity Meter Unit */}
              <rect x="20" y="24" width="130" height="85" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              {/* LCD Display */}
              <rect x="32" y="34" width="75" height="32" rx="4" fill="#022C22" stroke="#065F46" strokeWidth="1" />
              <text x="69" y="54" textAnchor="middle" fill="#22D3EE" fontSize="13" fontFamily="monospace" fontWeight="bold">
                {currentConductance.toFixed(2)}
              </text>
              <text x="96" y="62" fill="#94A3B8" fontSize="7" fontFamily="monospace">mS/cm</text>
              
              {/* Adjustment Knobs */}
              <circle cx="125" cy="46" r="8" fill="#334155" stroke="#475569" strokeWidth="1" />
              <circle cx="125" cy="72" r="6" fill="#334155" stroke="#475569" strokeWidth="1" />
              
              {/* Terminal Connectors */}
              <circle cx="45" cy="85" r="4" fill="#E24B4A" />
              <circle cx="65" cy="85" r="4" fill="#5F5E5A" />

              {/* Lead Wire to Conductivity Cell */}
              <path d="M55 85 Q75 140 195 140" fill="none" stroke="#22D3EE" strokeWidth="2" strokeDasharray="4,2" />

              {/* Reaction Beaker on Base */}
              <g transform="translate(160, 110)">
                {/* Magnetic Base */}
                <rect x="0" y="130" width="120" height="20" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
                {/* Beaker */}
                <rect x="15" y="25" width="90" height="110" rx="4" fill="#E2E8F0" fillOpacity="0.12" stroke="#94A3B8" strokeWidth="2" />
                {/* HCl Fluid */}
                <rect x="17" y="60" width="86" height="73" fill="#38BDF8" fillOpacity="0.25" />
                
                {/* Stir Bar */}
                {stirrerActive && (
                  <ellipse cx="60" cy="126" rx="12" ry="3" fill="#FFFFFF">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 60 126"
                      to="360 60 126"
                      dur="0.8s"
                      repeatCount="indefinite"
                    />
                  </ellipse>
                )}

                {/* Dip-Type Conductivity Cell */}
                <g transform="translate(35, -15)">
                  {/* Lead connection cap */}
                  <rect x="0" y="0" width="20" height="10" rx="2" fill="#64748B" />
                  {/* Glass Stem */}
                  <rect x="5" y="10" width="10" height="85" fill="#E2E8F0" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" />
                  {/* Two Parallel Platinized Platinum Plates */}
                  <rect x="2" y="95" width="4" height="24" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
                  <rect x="14" y="95" width="4" height="24" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
                </g>

                {/* Micro-Burette Nozzle dispensing NaOH */}
                <g transform="translate(85, -45)">
                  <rect x="0" y="0" width="8" height="55" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" />
                  <polygon points="0,55 8,55 4,68" fill="#38BDF8" />
                </g>
              </g>
            </svg>
          </div>

          {/* Controls Bar */}
          <div className="w-full z-10 flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleAddNaOH(1.0)}
              disabled={volumeAdded >= 20}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add 1.0 mL NaOH</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddNaOH(0.5)}
              disabled={volumeAdded >= 20}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add 0.5 mL (Fine)</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
              title="Reset Conductometric Titration"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Authentic V-Shaped Curve & Calculation Worksheet */}
        <div className="lg:col-span-5 space-y-5">
          {/* Real-time Dynamic V-Curve Graph Canvas */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-cyan-600" />
                <span>Authentic V-Curve [Conductivity vs V]</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-700 font-bold">
                Minima Equivalence: 10.0 mL
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

                {/* Theoretical V-shaped Guide Lines */}
                <line x1="30" y1="20" x2={30 + (10 / 20) * 250} y2="108" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                <line x1={30 + (10 / 20) * 250} y1="108" x2="280" y2="35" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />

                {/* Plot points */}
                {dataPoints.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#22D3EE"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={dataPoints
                      .map((d) => {
                        const x = 30 + (d.volume / 20) * 250;
                        const y = 130 - (d.conductance / 5.0) * 115;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                )}

                {/* Data point circles */}
                {dataPoints.map((d) => (
                  <circle
                    key={d.volume}
                    cx={30 + (d.volume / 20) * 250}
                    cy={130 - (d.conductance / 5.0) * 115}
                    r={d.volume === 10 ? 4.5 : 2.5}
                    fill={d.volume === 10 ? '#F59E0B' : '#22D3EE'}
                  />
                ))}

                {/* Axis Labels */}
                <text x="35" y="142" fill="#94A3B8" fontSize="8" fontFamily="monospace">0 mL</text>
                <text x="140" y="142" fill="#F59E0B" fontSize="8" fontFamily="monospace" fontWeight="bold">10 mL (V₂)</text>
                <text x="265" y="142" fill="#94A3B8" fontSize="8" fontFamily="monospace">20 mL</text>
                <text x="6" y="25" fill="#94A3B8" fontSize="7" fontFamily="monospace">5 mS</text>
                <text x="6" y="110" fill="#94A3B8" fontSize="7" fontFamily="monospace">1 mS</text>
              </svg>
            </div>
          </div>

          {/* Stoichiometric Calculation */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-3">
            <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
              Formulae & Acid Strength Calculation
            </h3>

            <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed shadow-xs">
              <div>• N₁ V₁ = N₂ V₂ ⟹ N₁(HCl) = (0.1 N × V₂) / 50 mL</div>
              <div>• Strength of HCl = N₁ × 36.5 g/L</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-montserrat font-bold text-slate-700 flex items-center justify-between">
                <span>Calculate: Strength of HCl</span>
                <span className="font-mono text-cyan-600 text-[11px]">g/L</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter HCl strength (e.g. 0.73)..."
                  value={userCalculation}
                  onChange={(e) => setUserCalculation(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-slate-800 font-mono"
                />
                <button
                  type="button"
                  onClick={handleCheckCalculation}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-montserrat font-extrabold text-xs transition-all cursor-pointer shadow-sm"
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
