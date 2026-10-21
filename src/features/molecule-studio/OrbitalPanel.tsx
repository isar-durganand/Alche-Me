/**
 * Alche-Me — HOMO-LUMO Quantum Frontier Orbital Panel
 * Inspired by the HomoLumo project architecture:
 * - Pearson's HSAB (Hard and Soft Acids and Bases) principle
 * - Frontier Molecular Orbital Theory (Kenichi Fukui / Roald Hoffmann)
 * - Band gap ΔE, chemical hardness (η), softness (σ), chemical potential (μ), electrophilicity (ω)
 * - 3D wavefunction isosurface customization (tightness & opacity)
 */

import React from 'react';
import { OrbitalsSummary, OrbitalType } from './types';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Sliders, 
  ShieldAlert, 
  Sparkles, 
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { soundEngine } from '../../infrastructure/audio/soundEngine';

interface OrbitalPanelProps {
  orbitals: OrbitalsSummary;
  orbitalType: OrbitalType;
  onOrbitalTypeChange: (type: OrbitalType) => void;
  isoval: number;
  onIsovalChange: (val: number) => void;
  opacity: number;
  onOpacityChange: (val: number) => void;
  aiSummary?: string;
}

export const OrbitalPanel: React.FC<OrbitalPanelProps> = ({
  orbitals,
  orbitalType,
  onOrbitalTypeChange,
  isoval,
  onIsovalChange,
  opacity,
  onOpacityChange,
  aiSummary,
}) => {
  const isVisible = orbitalType !== 'NONE';

  // Optical absorption wavelength λ = hc / ΔE (nm)
  const wavelengthNm = orbitals.band_gap_ev > 0 
    ? Math.round((1239.8 / orbitals.band_gap_ev) * 10) / 10 
    : 0;

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4 flex flex-col gap-4 text-xs shadow-xs animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-[#00C2D1]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-montserrat font-extrabold text-[#0B1F2A] text-sm block">
              Frontier Orbitals & HOMO-LUMO
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Fukui FMO Quantum Reactivity Model
            </span>
          </div>
        </div>

        {/* Visibility Toggle */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTap();
            onOrbitalTypeChange(isVisible ? 'NONE' : 'HOMO');
          }}
          className={`px-3 py-1 rounded-full text-[11px] font-montserrat font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
            isVisible
              ? 'bg-[#00C2D1] text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{isVisible ? 'Orbitals On' : 'Orbitals Off'}</span>
        </button>
      </div>

      {/* HOMO vs LUMO State Toggle Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* HOMO Card */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTap();
            onOrbitalTypeChange('HOMO');
          }}
          className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 shadow-xs ${
            orbitalType === 'HOMO'
              ? 'border-[#00C2D1] bg-teal-50/70 shadow-teal-500/10'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-montserrat font-extrabold uppercase text-[#008E9B]">
              Electron Donor (HOMO)
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00C2D1]" />
          </div>
          <div className="font-mono text-base font-extrabold text-[#0B1F2A]">
            {orbitals.homo_ev.toFixed(2)} eV
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Highest Occupied Molecular Orbital
          </span>
        </button>

        {/* LUMO Card */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTap();
            onOrbitalTypeChange('LUMO');
          }}
          className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 shadow-xs ${
            orbitalType === 'LUMO'
              ? 'border-amber-400 bg-amber-50/70 shadow-amber-500/10'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-montserrat font-extrabold uppercase text-amber-700">
              Electron Acceptor (LUMO)
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="font-mono text-base font-extrabold text-[#0B1F2A]">
            {orbitals.lumo_ev.toFixed(2)} eV
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Lowest Unoccupied Molecular Orbital
          </span>
        </button>
      </div>

      {/* Band Gap (ΔE) & Optical Absorption Hero Banner */}
      <div className="p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <span className="text-[11px] font-montserrat font-extrabold text-slate-700 block">
              Frontier Energy Band Gap (ΔE = E_LUMO - E_HOMO)
            </span>
            <span className="text-[10px] text-slate-400">
              Determines kinetic stability & light absorption
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-lg font-extrabold text-emerald-600 block">
              {orbitals.band_gap_ev.toFixed(2)} eV
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              λ ≈ {wavelengthNm} nm ({wavelengthNm < 380 ? 'UV region' : 'Visible spectrum'})
            </span>
          </div>
        </div>

        {/* Pearson HSAB 4-Grid Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">Chemical Hardness (η = ΔE/2)</span>
            <span className="font-mono font-extrabold text-[#008E9B] text-sm">
              {orbitals.chemical_hardness_ev.toFixed(2)} eV
            </span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">Chemical Softness (σ = 1/2η)</span>
            <span className="font-mono font-extrabold text-amber-700 text-sm">
              {orbitals.chemical_softness_ev_inv.toFixed(3)} eV⁻¹
            </span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">Chemical Potential (μ)</span>
            <span className="font-mono font-extrabold text-slate-700 text-sm">
              {orbitals.chemical_potential_ev.toFixed(2)} eV
            </span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">Electrophilicity Index (ω)</span>
            <span className="font-mono font-extrabold text-slate-700 text-sm">
              {orbitals.electrophilicity_index.toFixed(2)}
            </span>
          </div>
        </div>

        {/* HSAB Principle Classification Badge */}
        <div className="p-2.5 rounded-lg bg-teal-50/80 border border-teal-200/90 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-[#00C2D1] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-montserrat font-extrabold uppercase text-[#008E9B] block">
              HSAB Kinetic Stability & Reactivity
            </span>
            <span className="text-xs text-[#0B1F2A] font-medium leading-relaxed block mt-0.5">
              {orbitals.hsab_classification}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Energy Level Ladder */}
      <div className="p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200/80 space-y-2">
        <span className="text-[11px] font-montserrat font-extrabold text-slate-600 uppercase tracking-wider block">
          Frontier Molecular Orbital Energy Ladder:
        </span>
        <div className="relative p-2.5 bg-white border border-slate-200 rounded-lg space-y-2 font-mono text-[11px]">
          {/* LUMO Rung */}
          <div className="flex items-center justify-between text-amber-700 font-bold border-b border-dashed border-amber-300 pb-1">
            <span>LUMO (Unoccupied)</span>
            <span>{orbitals.lumo_ev.toFixed(2)} eV — [ ]</span>
          </div>

          {/* Band Gap Arrow */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-600 font-bold py-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>ΔE = {orbitals.band_gap_ev.toFixed(2)} eV (Gap)</span>
          </div>

          {/* HOMO Rung */}
          <div className="flex items-center justify-between text-[#008E9B] font-bold border-t border-slate-300 pt-1">
            <span>HOMO (Filled)</span>
            <span>{orbitals.homo_ev.toFixed(2)} eV — [ ↿⇂ ]</span>
          </div>
        </div>
      </div>

      {/* 3D Isosurface Customization Controls */}
      {isVisible && (
        <div className="p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200/80 space-y-3">
          <span className="text-[11px] font-montserrat font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#00C2D1]" /> 
            <span>3D Wavefunction Customization</span>
          </span>

          {/* Isovalue Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Isovalue (Lobe Tightness):</span>
              <span className="font-mono font-extrabold text-[#008E9B]">{isoval.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.08"
              step="0.005"
              value={isoval}
              onChange={(e) => onIsovalChange(parseFloat(e.target.value))}
              className="w-full accent-[#00C2D1] cursor-pointer h-2 bg-slate-200 rounded-full"
            />
          </div>

          {/* Opacity Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Surface Opacity:</span>
              <span className="font-mono font-extrabold text-[#008E9B]">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-full accent-[#00C2D1] cursor-pointer h-2 bg-slate-200 rounded-full"
            />
          </div>

          {/* Phase Color Legend */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px] font-mono">
            <span className="text-slate-500 font-medium">Wavefunction Phase:</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#008E9B] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C2D1]" />
                Positive (ψ &gt; 0)
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                Negative (ψ &lt; 0)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI / Scientific Summary */}
      {aiSummary && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed font-sans">
          <span className="font-montserrat font-bold text-[#0B1F2A] block mb-0.5">
            Quantum Structure Insights:
          </span>
          {aiSummary}
        </div>
      )}
    </div>
  );
};
