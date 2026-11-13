/**
 * Alche-Me — Interactive Laboratory Reagent Bench & Chemical Shelf
 * Provides tactile drag-and-drop and click-to-add control over all chemicals,
 * indicators, solutions, and pipettes required for university engineering chemistry experiments.
 */

import React, { useState } from 'react';
import { 
  Droplets, 
  FlaskConical, 
  Sparkles, 
  Check, 
  MoveRight, 
  Info,
  Wand2,
  HelpCircle,
  Pipette as PipetteIcon
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';

export interface ReagentItemConfig {
  key: string;
  name: string;
  formula: string;
  type: 'dropper' | 'pipette' | 'cylinder' | 'bottle' | 'probe';
  role: string;
  color: string;
  accentColor: string;
  quantityAdded: number;
  targetQuantity: number;
  unit: string;
  isCompleted: boolean;
  chemicalExplanation: string;
}

interface ReagentBenchShelfProps {
  experimentNum: string;
  reagents: ReagentItemConfig[];
  onAddReagent: (key: string, amount: number) => void;
  onAutoPrepare?: () => void;
  isAllPrepared: boolean;
}

export const ReagentBenchShelf: React.FC<ReagentBenchShelfProps> = ({
  experimentNum,
  reagents,
  onAddReagent,
  onAutoPrepare,
  isAllPrepared,
}) => {
  const [selectedTooltip, setSelectedTooltip] = useState<string | null>(null);
  const [activeDispensingKey, setActiveDispensingKey] = useState<string | null>(null);

  const handleDispense = (reagent: ReagentItemConfig) => {
    setActiveDispensingKey(reagent.key);
    
    if (reagent.type === 'dropper') {
      soundEngine.playDroplet();
      onAddReagent(reagent.key, 1);
    } else {
      soundEngine.playLiquidPour();
      onAddReagent(reagent.key, reagent.targetQuantity);
    }

    setTimeout(() => {
      setActiveDispensingKey(null);
    }, 400);
  };

  const handleDragStart = (e: React.DragEvent, reagentKey: string) => {
    e.dataTransfer.setData('text/plain', reagentKey);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Background shelf texture */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Bench Header & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-montserrat font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2">
              Chemical Reagent Shelf & Dispenser
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-normal border border-slate-700">
                Drag or Click to Add
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-montserrat">
              Prepare the reaction mixture in the vessel by adding the required sample, buffer, and indicator.
            </p>
          </div>
        </div>

        {/* Quick Auto-Prep Button */}
        {onAutoPrepare && !isAllPrepared && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playSuccess();
              onAutoPrepare();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-400/30 text-white text-xs font-montserrat font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
            title="Auto-fill recommended reagents for this trial"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Auto-Prepare Vessel</span>
          </button>
        )}

        {isAllPrepared && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-montserrat font-bold">
            <Check className="w-3.5 h-3.5" />
            <span>Vessel Fully Prepared!</span>
          </div>
        )}
      </div>

      {/* Grid of Interactive Reagents */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 relative z-10">
        {reagents.map((reagent) => {
          const isDispensing = activeDispensingKey === reagent.key;
          const isCompleted = reagent.isCompleted;

          return (
            <div
              key={reagent.key}
              draggable={!isCompleted}
              onDragStart={(e) => handleDragStart(e, reagent.key)}
              className={`group relative rounded-2xl p-3 border transition-all duration-200 select-none flex flex-col justify-between cursor-grab active:cursor-grabbing ${
                isCompleted 
                  ? 'bg-slate-800/40 border-slate-700/60 opacity-90' 
                  : 'bg-slate-800/90 hover:bg-slate-750 border-slate-700 hover:border-teal-400/50 shadow-md hover:shadow-teal-500/10 hover:-translate-y-0.5'
              } ${isDispensing ? 'scale-95 ring-2 ring-teal-400' : ''}`}
            >
              {/* Bottle / Dropper Graphic */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-slate-300">
                  {reagent.role}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTooltip(selectedTooltip === reagent.key ? null : reagent.key);
                  }}
                  className="text-slate-400 hover:text-teal-300 transition-colors p-1"
                  title="Chemical mechanism info"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Realistic Visual Apparatus Icon */}
              <div className="flex flex-col items-center justify-center py-2 relative">
                {reagent.type === 'dropper' ? (
                  /* Precision Dropper Bottle SVG */
                  <div className="relative flex flex-col items-center">
                    <svg viewBox="0 0 40 65" className="w-10 h-14 overflow-visible">
                      {/* Rubber Bulb (compresses on click) */}
                      <path
                        d={isDispensing ? "M14 14 C14 6 26 6 26 14 Z" : "M12 16 C12 4 28 4 28 16 Z"}
                        fill={reagent.accentColor}
                        stroke="#0F172A"
                        strokeWidth="1.5"
                        className="transition-all duration-150"
                      />
                      {/* Screw Collar */}
                      <rect x="10" y="16" width="20" height="5" rx="1.5" fill="#334155" stroke="#1E293B" strokeWidth="1" />
                      {/* Amber / Clear Glass Bottle Body */}
                      <rect x="8" y="21" width="24" height="38" rx="4" fill="#382E1E" stroke="#78350F" strokeWidth="1.5" />
                      {/* Liquid inside */}
                      <rect x="10" y="32" width="20" height="25" rx="2" fill={reagent.color} fillOpacity="0.8" />
                      {/* Glass Sheen */}
                      <line x1="11" y1="23" x2="11" y2="56" stroke="#FEF08A" strokeWidth="1" strokeOpacity="0.4" />
                      {/* Dropper Pipette Tip (droplet emerges when dispensing) */}
                      {isDispensing && (
                        <circle cx="20" cy="68" r="2.5" fill={reagent.color} className="animate-bounce" />
                      )}
                    </svg>
                  </div>
                ) : reagent.type === 'pipette' ? (
                  /* Graduated Pipette SVG */
                  <div className="relative flex flex-col items-center">
                    <svg viewBox="0 0 35 65" className="w-8 h-14 overflow-visible">
                      {/* Pipette Rubber Filler Bulb */}
                      <circle cx="17.5" cy="10" r="8" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
                      {/* Glass Stem */}
                      <rect x="15" y="18" width="5" height="42" fill="#E2E8F0" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" />
                      {/* Graduated lines */}
                      <line x1="14" y1="26" x2="18" y2="26" stroke="#FFFFFF" strokeWidth="0.8" />
                      <line x1="14" y1="34" x2="18" y2="34" stroke="#FFFFFF" strokeWidth="0.8" />
                      <line x1="14" y1="42" x2="18" y2="42" stroke="#FFFFFF" strokeWidth="0.8" />
                      {/* Liquid inside stem */}
                      <rect x="15.5" y="24" width="4" height="34" fill={reagent.color} fillOpacity="0.75" />
                      {/* Tapered Jet Tip */}
                      <polygon points="15,60 20,60 18,65 17,65" fill="#38BDF8" />
                    </svg>
                  </div>
                ) : (
                  /* Standard Reagent Bottle SVG */
                  <div className="relative flex flex-col items-center">
                    <svg viewBox="0 0 44 65" className="w-11 h-14 overflow-visible">
                      {/* Bottle Cap */}
                      <rect x="14" y="4" width="16" height="8" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="1" />
                      {/* Neck */}
                      <rect x="17" y="12" width="10" height="6" fill="#64748B" fillOpacity="0.4" stroke="#64748B" strokeWidth="1" />
                      {/* Bottle Body */}
                      <rect x="6" y="18" width="32" height="42" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                      {/* Liquid Inside */}
                      <rect x="8" y="28" width="28" height="30" rx="3" fill={reagent.color} fillOpacity="0.65" />
                      {/* Reagent Paper Label on Bottle */}
                      <rect x="10" y="32" width="24" height="18" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.8" />
                      <text x="22" y="43" textAnchor="middle" fill="#0F172A" fontSize="6" fontWeight="bold" fontFamily="monospace">
                        {reagent.formula.slice(0, 7)}
                      </text>
                    </svg>
                  </div>
                )}

                {/* Name & Formula */}
                <div className="text-center mt-2 w-full">
                  <div className="font-montserrat font-bold text-xs text-white truncate" title={reagent.name}>
                    {reagent.name}
                  </div>
                  <div className="font-mono text-[10px] text-teal-300">
                    {reagent.formula}
                  </div>
                </div>
              </div>

              {/* Progress & Add Action Button */}
              <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between gap-1.5">
                <div className="text-[11px] font-mono font-semibold text-slate-300">
                  {reagent.quantityAdded} / {reagent.targetQuantity} {reagent.unit}
                </div>

                <button
                  type="button"
                  onClick={() => handleDispense(reagent)}
                  disabled={isCompleted}
                  className={`px-2.5 py-1 rounded-lg text-xs font-montserrat font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 cursor-default'
                      : 'bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 shadow-sm'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Added</span>
                    </>
                  ) : reagent.type === 'dropper' ? (
                    <>
                      <Droplets className="w-3 h-3" />
                      <span>+1 Drop</span>
                    </>
                  ) : (
                    <>
                      <PipetteIcon className="w-3 h-3" />
                      <span>Pipette</span>
                    </>
                  )}
                </button>
              </div>

              {/* Detailed Scientific Tooltip Popup */}
              {selectedTooltip === reagent.key && (
                <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-950/95 border border-teal-500/50 rounded-xl text-xs z-30 shadow-2xl animate-in fade-in zoom-in-95">
                  <div className="font-montserrat font-bold text-teal-300 mb-1 flex items-center justify-between">
                    <span>{reagent.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTooltip(null);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {reagent.chemicalExplanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
