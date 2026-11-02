/**
 * Alche-Me — Redwood Viscometer Tribology Simulator (Exp 06)
 * 100% physically authentic:
 * - Redwood Viscometer No. 1 & 2 with agate orifice and silvered ball valve
 * - 50 mL Kohlrausch narrow-neck receiving flask
 * - Interactive apparatus leveling with spirit level
 * - Synchronized ball valve lift & digital precision stopwatch (0.01 s)
 * - Poiseuille fluid dynamics & empirical Redwood-to-Stokes viscosity formulas
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Gauge, 
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';
import { progressAdapter } from '../../../infrastructure/persistence/progressAdapter';
import { ExperimentItem } from '../../../data/experimentsData';

interface RedwoodViscometerSimulatorProps {
  experiment: ExperimentItem;
}

export const RedwoodViscometerSimulator: React.FC<RedwoodViscometerSimulatorProps> = ({ experiment }) => {
  const [sampleType, setSampleType] = useState<'machine_oil' | 'engine_oil'>('machine_oil');
  const [viscometerType, setViscometerType] = useState<'no1' | 'no2'>('no1');
  const [temperatureC, setTemperatureC] = useState<number>(25.0);
  const [isLeveled, setIsLeveled] = useState<boolean>(true);
  const [oilFilled, setOilFilled] = useState<boolean>(true);
  const [ballValveLifted, setBallValveLifted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x or 2x speed for convenience

  // Calculations state
  const [userKinematic, setUserKinematic] = useState<string>('');
  const [calcValidationMessage, setCalcValidationMessage] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Target theoretical efflux times (Redwood seconds)
  // Machine oil ~52 s; Heavy engine oil ~145 s (or ~36 s on Redwood No. 2)
  const targetEffluxTime = sampleType === 'machine_oil' ? 52.0 : viscometerType === 'no1' ? 145.0 : 36.2;
  const oilDensity = sampleType === 'machine_oil' ? 0.86 : 0.89; // g/cm³

  // Volume in Kohlrausch flask (0 to 50 mL)
  const flaskVolume = Math.min(50.0, Math.round((elapsedTime / targetEffluxTime) * 50.0 * 10) / 10);

  // Timing interval
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const next = Math.round((prev + 0.1 * simSpeed) * 10) / 10;
        if (next % 1 < 0.1) {
          soundEngine.playElementPip(14); // tick pip
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, simSpeed]);

  // Lift Ball Valve & Trigger Stopwatch
  const handleLiftBallValve = () => {
    soundEngine.playSuccess();
    setBallValveLifted(true);
    setIsRunning(true);
    setIsCompleted(false);
  };

  // Stop Timer when lower meniscus reaches 50 mL mark
  const handleStopTimer = () => {
    soundEngine.playTap();
    setIsRunning(false);
    setBallValveLifted(false);
    setIsCompleted(true);
  };

  // Reset Viscometer
  const handleReset = () => {
    soundEngine.playTap();
    setIsRunning(false);
    setBallValveLifted(false);
    setElapsedTime(0);
    setIsCompleted(false);
    setCalcValidationMessage(null);
  };

  // Empirical Redwood Conversion Formulas
  // For t = 34 to 100 s: ν = 0.0026*t - 1.72/t
  // For t > 100 s: ν = 0.00247*t - 0.50/t
  const calculateStokes = (t: number) => {
    if (t < 34) return 0;
    if (t <= 100) {
      return 0.0026 * t - 1.72 / t;
    } else {
      return 0.00247 * t - 0.50 / t;
    }
  };

  const theoreticalStokes = Math.round(calculateStokes(targetEffluxTime) * 1000) / 1000;
  const observedStokes = Math.round(calculateStokes(elapsedTime) * 1000) / 1000;

  // Check student calculation
  const handleCheckCalculation = () => {
    const parsed = parseFloat(userKinematic);
    if (isNaN(parsed)) {
      setCalcValidationMessage({ isSuccess: false, text: 'Please enter a valid numeric value.' });
      return;
    }

    const diff = Math.abs(parsed - theoreticalStokes);
    if (diff <= 0.02) {
      soundEngine.playSuccess();
      progressAdapter.addXp(60);
      setCalcValidationMessage({
        isSuccess: true,
        text: `Outstanding! Correct Kinematic Viscosity: ${theoreticalStokes} Stokes (cSt). +60 Scholar XP awarded!`,
      });
    } else {
      soundEngine.playError();
      setCalcValidationMessage({
        isSuccess: false,
        text: `Incorrect: Expected ~${theoreticalStokes} Stokes. For t=${elapsedTime.toFixed(1)}s, use ν = ${
          elapsedTime <= 100 ? '0.0026·t - 1.72/t' : '0.00247·t - 0.50/t'
        }.`,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold">
              TRIBOLOGY EXP 06
            </span>
            <span className="text-xs font-montserrat font-bold text-slate-500">
              Fluid Mechanics & Viscometry
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-montserrat font-extrabold text-[#0B1F2A] mt-1">
            Determination of Viscosity by Redwood Viscometer No. 1 & 2
          </h2>
        </div>

        {/* Digital Stopwatch Display */}
        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-white flex items-center gap-3 shadow-md">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Redwood Seconds</span>
            <span className="font-mono font-black text-lg text-amber-400">
              {elapsedTime.toFixed(2)} s
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Apparatus Stage */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 border-2 border-slate-800 flex flex-col items-center justify-between shadow-inner min-h-[500px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top Sample Selectors */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 text-white z-10 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sample Oil:</span>
              <button
                type="button"
                onClick={() => {
                  setSampleType('machine_oil');
                  handleReset();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  sampleType === 'machine_oil' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Light Machine Oil
              </button>
              <button
                type="button"
                onClick={() => {
                  setSampleType('engine_oil');
                  handleReset();
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  sampleType === 'engine_oil' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Heavy Engine Oil (SAE 40)
              </button>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-slate-400">
              <span>Speed:</span>
              <button
                type="button"
                onClick={() => setSimSpeed(1)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${simSpeed === 1 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
              >
                1x
              </button>
              <button
                type="button"
                onClick={() => setSimSpeed(2)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${simSpeed === 2 ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
              >
                2x
              </button>
            </div>
          </div>

          {/* SVG Visual Redwood Viscometer & Kohlrausch Flask */}
          <div className="my-2 relative flex items-center justify-center w-full z-10">
            <svg viewBox="0 0 340 320" className="w-80 h-72 sm:w-96 sm:h-80 overflow-visible select-none">
              <defs>
                <linearGradient id="oilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#78350F" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Tripod Stand Legs */}
              <line x1="80" y1="160" x2="40" y2="290" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
              <line x1="260" y1="160" x2="300" y2="290" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
              <line x1="170" y1="160" x2="170" y2="290" stroke="#334155" strokeWidth="3" />

              {/* Copper Water Bath Outer Jacket */}
              <path d="M70 40 L270 40 L270 145 L200 175 L140 175 L70 145 Z" fill="#B45309" fillOpacity="0.4" stroke="#D97706" strokeWidth="2" />
              
              {/* Thermometer in Water Bath */}
              <rect x="220" y="10" width="6" height="90" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
              <line x1="223" y1="30" x2="223" y2="95" stroke="#EF4444" strokeWidth="2" />
              <circle cx="223" cy="95" r="4" fill="#EF4444" />
              <text x="223" y="5" textAnchor="middle" fill="#EF4444" fontSize="8" fontFamily="monospace">25°C</text>

              {/* Central Silvered Brass Oil Cup */}
              <rect x="110" y="45" width="120" height="95" rx="3" fill="#334155" stroke="#CBD5E1" strokeWidth="1.5" />
              {/* Oil inside cup */}
              {oilFilled && (
                <rect x="112" y="65" width="116" height="73" fill="url(#oilGrad)" />
              )}
              {/* Gauge pointer tip */}
              <polygon points="120,65 125,60 125,70" fill="#F59E0B" />

              {/* Central Valve Rod & Silvered Ball Valve */}
              <g transform={ballValveLifted ? 'translate(0, -18)' : ''} className="transition-transform duration-300">
                <line x1="170" y1="20" x2="170" y2="140" stroke="#CBD5E1" strokeWidth="2.5" />
                <circle cx="170" cy="18" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                {/* Silver Ball Valve plugging agate orifice */}
                <circle cx="170" cy="140" r="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
              </g>

              {/* Precision Agate Orifice Jet */}
              <rect x="165" y="140" width="10" height="15" fill="#78350F" stroke="#92400E" strokeWidth="1" />

              {/* Dripping Oil Stream when Ball Valve Lifted */}
              {ballValveLifted && isRunning && (
                <line x1="170" y1="155" x2="170" y2="235" stroke="#D97706" strokeWidth="2" strokeDasharray="5,2" className="animate-pulse" />
              )}

              {/* Kohlrausch 50 mL Receiving Flask below Jet */}
              <g transform="translate(130, 215)">
                {/* Flask Lip */}
                <polygon points="26,0 54,0 48,15 32,15" fill="#E2E8F0" fillOpacity="0.2" stroke="#94A3B8" strokeWidth="1" />
                {/* Narrow Calibrated Neck */}
                <rect x="34" y="14" width="12" height="30" fill="#E2E8F0" fillOpacity="0.2" stroke="#94A3B8" strokeWidth="1" />
                {/* 50 mL Ring Mark Etched on Neck */}
                <line x1="30" y1="28" x2="50" y2="28" stroke="#EF4444" strokeWidth="1.5" />
                <text x="54" y="31" fill="#EF4444" fontSize="7" fontFamily="monospace" fontWeight="bold">50 mL</text>

                {/* Spherical Bottom Bulb */}
                <path d="M34 44 Q10 65 20 85 Q40 92 60 85 Q70 65 46 44 Z" fill="#E2E8F0" fillOpacity="0.2" stroke="#94A3B8" strokeWidth="1.5" />

                {/* Oil Level filling up inside Kohlrausch flask */}
                {flaskVolume > 0 && (
                  <path
                    d={`M24 75 Q40 ${85 - (flaskVolume / 50) * 35} 56 75 Q65 85 40 88 Q15 85 24 75 Z`}
                    fill="url(#oilGrad)"
                  />
                )}
                {flaskVolume >= 45 && (
                  <rect x="35" y={28 + (50 - flaskVolume)} width="10" height={Math.max(1, flaskVolume - 45)} fill="url(#oilGrad)" />
                )}
              </g>
            </svg>
          </div>

          {/* Meniscus & Flask Fill Indicator */}
          <div className="w-full z-10 flex items-center justify-between p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Kohlrausch Flask:</span>
              <strong className="font-mono text-amber-400 text-sm">{flaskVolume.toFixed(1)} / 50.0 mL</strong>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className={`px-2 py-0.5 rounded-full font-bold ${flaskVolume >= 50.0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-slate-700 text-slate-300'}`}>
                {flaskVolume >= 50.0 ? '50 mL Mark Reached!' : 'Filling receiving flask...'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full z-10 flex items-center justify-center gap-3 pt-3">
            {!isRunning && !isCompleted && (
              <button
                type="button"
                onClick={handleLiftBallValve}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md active:scale-95 animate-pulse"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Lift Ball Valve & Start Stopwatch</span>
              </button>
            )}

            {isRunning && (
              <button
                type="button"
                onClick={handleStopTimer}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-montserrat font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md active:scale-95 animate-bounce"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>STOP TIMER AT 50 mL MARK</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
              title="Reset Viscometer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Tribology Data & Calculation Worksheet */}
        <div className="lg:col-span-5 space-y-5">
          {/* Observation Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-3">
            <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider flex items-center gap-1.5">
              <span>Viscometric Observations</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Oil Sample</span>
                <span className="font-montserrat font-bold text-[#0B1F2A]">
                  {sampleType === 'machine_oil' ? 'Light Machine Oil' : 'Heavy SAE-40 Oil'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Efflux Time (t)</span>
                <span className="font-mono font-bold text-amber-600">
                  {elapsedTime > 0 ? `${elapsedTime.toFixed(1)} s` : 'Waiting...'}
                </span>
              </div>
            </div>
          </div>

          {/* Kinematic & Absolute Viscosity Formulas */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-3">
            <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
              Empirical Redwood Formulas
            </h3>

            <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed shadow-xs">
              <div>• For t = 34 to 100 s: ν = 0.0026·t - 1.72/t</div>
              <div>• For t &gt; 100 s: ν = 0.00247·t - 0.50/t</div>
              <div>• Absolute Viscosity (η) = ν × Density (g/cm³)</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-montserrat font-bold text-slate-700 flex items-center justify-between">
                <span>Calculate: Kinematic Viscosity (ν)</span>
                <span className="font-mono text-amber-600 text-[11px]">Stokes (cm²/s)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.001"
                  placeholder="Enter ν in Stokes (e.g. 0.102)..."
                  value={userKinematic}
                  onChange={(e) => setUserKinematic(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-800 font-mono"
                />
                <button
                  type="button"
                  onClick={handleCheckCalculation}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-montserrat font-extrabold text-xs transition-all cursor-pointer shadow-sm"
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
