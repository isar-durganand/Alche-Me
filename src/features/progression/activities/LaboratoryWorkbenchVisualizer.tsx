import React, { useState } from 'react';
import { Sparkles, Eye, Flame, Gauge, Zap } from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';

export const LaboratoryWorkbenchVisualizer: React.FC = () => {
  const [activeStation, setActiveStation] = useState<number>(0);

  const stations = [
    {
      id: 0,
      title: 'Station A: Effervescent Acid Reaction',
      apparatus: 'Borosilicate Beaker + Zn + Dilute HCl',
      reading: 'Continuous gas evolution observed',
      badge: 'Visual Observation',
      badgeColor: 'border-teal-300 bg-teal-50 text-teal-800',
    },
    {
      id: 1,
      title: 'Station B: Analytical Balance',
      apparatus: 'Dual-Range Analytical Draft Balance',
      reading: '24.321 g ± 0.001 g',
      badge: 'Quantitative Measurement',
      badgeColor: 'border-cyan-300 bg-cyan-50 text-cyan-800',
    },
    {
      id: 2,
      title: 'Station C: Digital Thermocouple',
      apparatus: 'Type-K Stainless Immersion Sensor',
      reading: '78.4 °C (Exothermic thermal rise)',
      badge: 'Instrumental Data',
      badgeColor: 'border-amber-300 bg-amber-50 text-amber-800',
    },
    {
      id: 3,
      title: 'Station D: Copper Coupon Surface',
      apparatus: 'Microscope Stage (40x Optical)',
      reading: 'Green Verdigris Layer [Cu₂(OH)₂CO₃]',
      badge: 'Surface Corrosion',
      badgeColor: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    },
  ];

  const handleSelectStation = (idx: number) => {
    setActiveStation(idx);
    soundEngine.playTap();
  };

  const curr = stations[activeStation];

  return (
    <div className="bg-white p-4 rounded-3xl border-2 border-slate-200/90 shadow-sm space-y-3 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 text-[#00C2D1] flex items-center justify-center font-bold">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A]">
              Live Laboratory Workbench Apparatus
            </h3>
            <span className="text-[10px] text-slate-500">
              Inspect real apparatus sensors before classifying empirical evidence
            </span>
          </div>
        </div>

        {/* Station Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {stations.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => handleSelectStation(idx)}
              className={`px-2.5 py-1 text-[11px] font-montserrat font-bold rounded-lg border transition-all cursor-pointer shrink-0 ${
                activeStation === idx
                  ? 'bg-[#00C2D1] text-white border-[#008E9B] shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Visual Apparatus Canvas */}
        <div className="md:col-span-1 h-44 rounded-2xl border-2 border-slate-100 bg-slate-900 flex items-center justify-center p-2 relative overflow-hidden shadow-inner">
          {activeStation === 0 && (
            /* Station 0: Effervescent Beaker with animated rising bubbles */
            <svg viewBox="0 0 160 160" className="w-36 h-36 overflow-visible">
              <defs>
                <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              {/* Beaker Outline */}
              <rect x="35" y="30" width="90" height="110" rx="4" fill="none" stroke="#94A3B8" strokeWidth="2.5" />
              {/* Beaker Spout Lip */}
              <path d="M30 30 L35 30" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M125 30 L130 30" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              {/* Graduation Marks */}
              <line x1="110" y1="50" x2="120" y2="50" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="105" y1="70" x2="120" y2="70" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="110" y1="90" x2="120" y2="90" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="105" y1="110" x2="120" y2="110" stroke="#CBD5E1" strokeWidth="1.5" />
              {/* Liquid Level */}
              <path d="M36 70 Q80 74 124 70 L124 138 Q80 140 36 138 Z" fill="url(#liquidGrad)" />
              {/* Zinc Granule Chunks at bottom */}
              <polygon points="50,135 62,130 68,136 55,138" fill="#64748B" stroke="#475569" strokeWidth="1" />
              <polygon points="75,136 88,132 94,137 80,139" fill="#64748B" stroke="#475569" strokeWidth="1" />
              <polygon points="98,135 106,131 112,137 102,138" fill="#64748B" stroke="#475569" strokeWidth="1" />
              {/* Animated Rising Bubbles (H2 Gas) */}
              <circle cx="56" cy="115" r="3" fill="#FFFFFF" opacity="0.8" className="animate-ping" style={{ animationDuration: '0.8s' }} />
              <circle cx="82" cy="95" r="2.5" fill="#FFFFFF" opacity="0.8" className="animate-ping" style={{ animationDuration: '0.6s' }} />
              <circle cx="70" cy="80" r="4" fill="#FFFFFF" opacity="0.9" className="animate-ping" style={{ animationDuration: '1.0s' }} />
              <circle cx="102" cy="100" r="2" fill="#FFFFFF" opacity="0.8" className="animate-ping" style={{ animationDuration: '0.7s' }} />
              <circle cx="62" cy="65" r="2.5" fill="#FFFFFF" opacity="0.7" className="animate-ping" style={{ animationDuration: '0.5s' }} />
            </svg>
          )}

          {activeStation === 1 && (
            /* Station 1: Precision Analytical Balance */
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* Base Platform */}
              <rect x="25" y="105" width="110" height="35" rx="5" fill="#334155" stroke="#1E293B" strokeWidth="2" />
              {/* Glass Draft Shield */}
              <rect x="35" y="45" width="90" height="60" rx="3" fill="#E2E8F0" fillOpacity="0.15" stroke="#64748B" strokeWidth="1.5" />
              {/* Weighing Pan Pillar */}
              <rect x="76" y="85" width="8" height="20" fill="#CBD5E1" />
              {/* Stainless Weighing Pan */}
              <ellipse cx="80" cy="85" rx="26" ry="6" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1.5" />
              {/* Sample Powder */}
              <ellipse cx="80" cy="83" rx="12" ry="3" fill="#FEF08A" opacity="0.9" />
              {/* Green 7-Segment LED Digital Display */}
              <rect x="45" y="115" width="70" height="18" rx="3" fill="#022C22" stroke="#065F46" strokeWidth="1" />
              <text x="80" y="128" textAnchor="middle" fill="#34D399" fontSize="11" fontFamily="Courier, monospace" fontWeight="bold">
                24.321 g
              </text>
            </svg>
          )}

          {activeStation === 2 && (
            /* Station 2: Digital Thermocouple Probe */
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* Handheld Meter Unit */}
              <rect x="25" y="25" width="55" height="95" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              {/* Yellow Bumper Case */}
              <rect x="28" y="28" width="49" height="10" rx="2" fill="#F59E0B" />
              {/* Backlit Display Screen */}
              <rect x="30" y="44" width="45" height="30" rx="3" fill="#042F2E" stroke="#115E59" strokeWidth="1" />
              <text x="52" y="62" textAnchor="middle" fill="#2DD4BF" fontSize="12" fontFamily="Courier, monospace" fontWeight="bold">
                78.4°C
              </text>
              <text x="52" y="71" textAnchor="middle" fill="#FBBF24" fontSize="7" fontFamily="sans-serif">
                TYPE-K ACTIVE
              </text>
              {/* Cable */}
              <path d="M52 120 C52 145 95 140 100 110" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              {/* Stainless Steel Probe */}
              <rect x="98" y="40" width="5" height="75" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              {/* Thermal Wave Glow at tip */}
              <circle cx="100.5" cy="115" r="8" fill="#EF4444" opacity="0.5" className="animate-pulse" />
              <circle cx="100.5" cy="115" r="4" fill="#FEF08A" opacity="0.9" />
            </svg>
          )}

          {activeStation === 3 && (
            /* Station 3: Copper Surface with Oxidation Patina */
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* Microscope Reticle Field */}
              <circle cx="80" cy="80" r="60" fill="#090D16" stroke="#334155" strokeWidth="2" />
              <circle cx="80" cy="80" r="50" fill="#1E293B" />
              {/* Split Copper Coupon: Left Polished, Right Oxidized */}
              {/* Left Metallic Copper */}
              <path d="M80 35 A45 45 0 0 0 80 125 Z" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
              {/* Right Oxidized Verdigris */}
              <path d="M80 35 A45 45 0 0 1 80 125 Z" fill="#0D9488" stroke="#115E59" strokeWidth="1.5" />
              {/* Patina Texture Dots */}
              <circle cx="95" cy="65" r="3" fill="#14B8A6" />
              <circle cx="105" cy="85" r="4" fill="#0F766E" />
              <circle cx="90" cy="100" r="3.5" fill="#5EEAD4" />
              <circle cx="112" cy="68" r="2" fill="#99F6E4" />
              {/* Microscope Crosshair Overlay */}
              <line x1="80" y1="25" x2="80" y2="135" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
              <line x1="25" y1="80" x2="135" y2="80" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
            </svg>
          )}
        </div>

        {/* Station Telemetry & Scientific Breakdown */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">
              {curr.title}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-montserrat font-bold ${curr.badgeColor}`}>
              {curr.badge}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Apparatus:</span>
              <span className="text-[#0B1F2A] font-semibold">{curr.apparatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Sensor Output:</span>
              <span className="text-[#008E9B] font-mono font-bold">{curr.reading}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {activeStation === 0 &&
              'The formation of bubbles and color shifts are direct visual observations. The chemical equation (Zn + 2HCl → ZnCl₂ + H₂) is an explanatory inference.'}
            {activeStation === 1 &&
              'A digital balance display provides a quantitative measurement of mass in grams. It does not directly count atoms without molar calculations.'}
            {activeStation === 2 &&
              'A temperature rise on a thermocouple is a measured physical value. Concluding that bonds have released energy is a thermodynamic inference.'}
            {activeStation === 3 &&
              'The visible green color is an empirical observation. Naming the mineral compound as basic copper carbonate [Cu₂(OH)₂CO₃] is a chemical inference.'}
          </p>
        </div>
      </div>
    </div>
  );
};
