/**
 * Alche-Me — Left-Side Laboratory Reagent Rack & Chemical Toolbar
 * Positioned directly to the left of the glassware canvas for an ergonomic,
 * non-scrolling desktop experience.
 * Features:
 * - 100% functional, responsive buttons (NEVER locked or disabled)
 * - Click-to-add and drag-and-drop support
 * - Visual rubber bulb squish and pipette liquid animations
 * - Clear drop counts and volume indicators
 * - Quick "Auto-Prepare" and "Empty Flask" reset buttons
 */

import React, { useState } from 'react';
import { 
  Droplets, 
  FlaskConical, 
  Sparkles, 
  Check, 
  Info,
  Wand2,
  RotateCcw,
  Pipette as PipetteIcon,
  Plus
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

interface ReagentRackProps {
  experimentNum: string;
  reagents: ReagentItemConfig[];
  onAddReagent: (key: string, amount: number) => void;
  onAutoPrepare?: () => void;
  onResetVessel?: () => void;
  isAllPrepared: boolean;
}

export const ReagentRack: React.FC<ReagentRackProps> = ({
  experimentNum,
  reagents,
  onAddReagent,
  onAutoPrepare,
  onResetVessel,
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
    }, 350);
  };

  const handleDragStart = (e: React.DragEvent, reagentKey: string) => {
    e.dataTransfer.setData('text/plain', reagentKey);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-4 text-white shadow-xl flex flex-col justify-between h-full backdrop-blur-md relative overflow-hidden">
      {/* Background shelf texture */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Rack Header */}
      <div className="border-b border-slate-800 pb-3 mb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-montserrat font-extrabold text-xs tracking-wider uppercase text-slate-200">
                Reagent Bench
              </h3>
              <span className="text-[10px] text-teal-400 font-mono">
                Click or Drag to Flask
              </span>
            </div>
          </div>

          {isAllPrepared ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> Ready
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 text-[10px] font-bold">
              Prep Vessel
            </span>
          )}
        </div>
      </div>

      {/* Vertical Stack of Chemical Reagents */}
      <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5 relative z-10">
        {reagents.map((reagent) => {
          const isDispensing = activeDispensingKey === reagent.key;
          const isOptimal = reagent.quantityAdded >= reagent.targetQuantity;

          return (
            <div
              key={reagent.key}
              draggable
              onDragStart={(e) => handleDragStart(e, reagent.key)}
              className={`group relative rounded-2xl p-2.5 border transition-all duration-200 select-none flex flex-col justify-between bg-slate-800/90 hover:bg-slate-750 border-slate-700/80 hover:border-teal-400/50 shadow-sm ${
                isDispensing ? 'scale-95 ring-2 ring-teal-400' : ''
              }`}
            >
              {/* Card Header: Role & Info */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 uppercase">
                  {reagent.role}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTooltip(selectedTooltip === reagent.key ? null : reagent.key);
                  }}
                  className="text-slate-400 hover:text-teal-300 transition-colors p-0.5 cursor-pointer"
                  title="Chemical details"
                >
                  <Info className="w-3 h-3" />
                </button>
              </div>

              {/* Graphic + Name Row */}
              <div className="flex items-center gap-2.5 py-1">
                {/* Visual Glassware Icon */}
                <div className="w-9 h-11 shrink-0 flex items-center justify-center">
                  {reagent.type === 'dropper' ? (
                    /* Precision Dropper Bottle SVG */
                    <svg viewBox="0 0 36 60" className="w-8 h-11 overflow-visible">
                      <path
                        d={isDispensing ? "M12 14 C12 6 24 6 24 14 Z" : "M10 16 C10 4 26 4 26 16 Z"}
                        fill={reagent.accentColor}
                        stroke="#0F172A"
                        strokeWidth="1.2"
                      />
                      <rect x="8" y="16" width="20" height="4" rx="1" fill="#334155" stroke="#1E293B" strokeWidth="1" />
                      <rect x="6" y="20" width="24" height="35" rx="3" fill="#382E1E" stroke="#78350F" strokeWidth="1.2" />
                      <rect x="8" y="30" width="20" height="23" rx="2" fill={reagent.color} fillOpacity="0.85" />
                    </svg>
                  ) : reagent.type === 'pipette' ? (
                    /* Volumetric Pipette SVG */
                    <svg viewBox="0 0 30 60" className="w-7 h-11 overflow-visible">
                      <circle cx="15" cy="9" r="7" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
                      <rect x="13" y="16" width="4" height="38" fill="#E2E8F0" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1" />
                      <rect x="13.5" y="24" width="3" height="30" fill={reagent.color} fillOpacity="0.75" />
                      <polygon points="13,54 17,54 15,59" fill="#38BDF8" />
                    </svg>
                  ) : (
                    /* Reagent Bottle SVG */
                    <svg viewBox="0 0 38 60" className="w-8 h-11 overflow-visible">
                      <rect x="12" y="3" width="14" height="7" rx="1.5" fill="#475569" stroke="#1E293B" strokeWidth="1" />
                      <rect x="15" y="10" width="8" height="5" fill="#64748B" fillOpacity="0.4" stroke="#64748B" strokeWidth="1" />
                      <rect x="5" y="15" width="28" height="40" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.2" />
                      <rect x="7" y="25" width="24" height="28" rx="2.5" fill={reagent.color} fillOpacity="0.7" />
                      <rect x="9" y="28" width="20" height="15" rx="1.5" fill="#F8FAFC" />
                      <text x="19" y="38" textAnchor="middle" fill="#0F172A" fontSize="5.5" fontWeight="bold" fontFamily="monospace">
                        {reagent.formula.slice(0, 6)}
                      </text>
                    </svg>
                  )}
                </div>

                {/* Name & Formula */}
                <div className="flex-1 min-w-0">
                  <div className="font-montserrat font-bold text-xs text-white truncate" title={reagent.name}>
                    {reagent.name}
                  </div>
                  <div className="font-mono text-[10px] text-teal-300 truncate">
                    {reagent.formula}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                    Added: <strong className={isOptimal ? 'text-emerald-400' : 'text-amber-400'}>{reagent.quantityAdded} {reagent.unit}</strong>
                  </div>
                </div>
              </div>

              {/* Action Button (ALWAYS ACTIVE & CLICKABLE) */}
              <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-mono text-slate-400">
                  Target: {reagent.targetQuantity} {reagent.unit}
                </span>

                <button
                  type="button"
                  onClick={() => handleDispense(reagent)}
                  className="px-2.5 py-1 rounded-lg text-xs font-montserrat font-extrabold flex items-center gap-1 transition-all cursor-pointer bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 shadow-sm active:bg-teal-300"
                >
                  {reagent.type === 'dropper' ? (
                    <>
                      <Droplets className="w-3 h-3 text-slate-950" />
                      <span>+1 Drop</span>
                    </>
                  ) : (
                    <>
                      <PipetteIcon className="w-3 h-3 text-slate-950" />
                      <span>Pipette</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tooltip Dialog */}
              {selectedTooltip === reagent.key && (
                <div className="absolute left-full top-0 ml-2 w-64 p-3 bg-slate-950/98 border border-teal-500/50 rounded-xl text-xs z-40 shadow-2xl animate-in fade-in zoom-in-95">
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

      {/* Quick Rack Actions at Bottom */}
      <div className="pt-3 mt-3 border-t border-slate-800 space-y-2 relative z-10">
        {onAutoPrepare && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playSuccess();
              onAutoPrepare();
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-400/30 text-white text-xs font-montserrat font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            title="Auto-fill recommended reagents for this experiment"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Auto-Prepare Vessel</span>
          </button>
        )}

        {onResetVessel && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              onResetVessel();
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-montserrat font-bold transition-all cursor-pointer"
            title="Empty and clean the reaction flask"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Clean / Empty Flask</span>
          </button>
        )}
      </div>
    </div>
  );
};
