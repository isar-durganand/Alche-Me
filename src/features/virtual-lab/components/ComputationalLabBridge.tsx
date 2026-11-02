/**
 * Alche-Me — Computational Chemistry & 3D Molecular CAD Bridge (Exp 8, 9, 10)
 * Seamlessly connects the Virtual Laboratory to the 3D Molecular Graphics Engine
 */

import React from 'react';
import { 
  Atom, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  Layers, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';
import { ExperimentItem } from '../../../data/experimentsData';
import { NavRoute } from '../../../components/layout/AppShell';

interface ComputationalLabBridgeProps {
  experiment: ExperimentItem;
  onNavigateToStudio?: () => void;
}

export const ComputationalLabBridge: React.FC<ComputationalLabBridgeProps> = ({
  experiment,
  onNavigateToStudio
}) => {
  const isExp8 = experiment.num === '08';
  const isExp9 = experiment.num === '09';
  const isExp10 = experiment.num === '10';

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono font-bold">
              COMPUTATIONAL EXP 0{experiment.num}
            </span>
            <span className="text-xs font-montserrat font-bold text-slate-500">
              ArgusLab / 3D Graphics CAD
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-montserrat font-extrabold text-[#0B1F2A] mt-1">
            {experiment.title}
          </h2>
        </div>

        {/* Studio Launch Button */}
        {onNavigateToStudio && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playSuccess();
              onNavigateToStudio();
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00C2D1] to-teal-600 hover:from-[#00AAB8] hover:to-teal-500 text-white font-montserrat font-extrabold text-xs transition-all cursor-pointer shadow-md flex items-center gap-2 active:scale-95"
          >
            <Atom className="w-4 h-4 animate-spin" />
            <span>Launch 3D Molecule Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: VSEPR & Quantum Chemical Principle */}
        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
            Theoretical Principles
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {experiment.principle}
          </p>
        </div>

        {/* Card 2: Interactive Comparative Dataset */}
        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
            {isExp8 ? 'Chalcogen Dihydride Bond Angles' : isExp9 ? 'Hydrocarbon Topologies' : 'Frontier Orbitals (HOMO-LUMO)'}
          </h3>

          {isExp8 && (
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-[#0B1F2A]">Water (H₂O):</span>
                <span className="text-teal-600 font-bold">104.5° (sp³ hybrid)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-[#0B1F2A]">Hydrogen Sulfide (H₂S):</span>
                <span className="text-amber-600 font-bold">92.1° (Drago Rule)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-[#0B1F2A]">Hydrogen Selenide (H₂Se):</span>
                <span className="text-indigo-600 font-bold">90.6° (Pure p bonding)</span>
              </div>
            </div>
          )}

          {isExp9 && (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <strong className="text-[#0B1F2A]">Ethylene (C₂H₄):</strong> Planar sp² framework, ∠H-C-H = 117.4°
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <strong className="text-[#0B1F2A]">Butane (C₄H₁₀):</strong> Anti-periplanar minimum (180°) vs Gauche (60°)
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <strong className="text-[#0B1F2A]">Benzene (C₆H₆):</strong> D₆ₕ aromatic resonance, equalized C-C 1.399 Å
              </div>
            </div>
          )}

          {isExp10 && (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <strong className="text-[#0B1F2A]">HOMO (Nucleophile):</strong> Electron-donating wave-function lobe (Cyan)
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <strong className="text-[#0B1F2A]">LUMO (Electrophile):</strong> Electron-accepting nodal plane lobe (Red)
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-teal-600 font-bold">
                Bandgap ΔE = E_LUMO - E_HOMO
              </div>
            </div>
          )}
        </div>

        {/* Card 3: In-Studio Tools Checklist */}
        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
            Hands-On Protocol Tasks
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            {experiment.procedure.slice(0, 4).map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
