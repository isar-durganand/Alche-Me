import React, { useState } from 'react';
import { Flame, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { PeriodicElement } from '../../types/chemistry';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
import { Button } from '../../components/ui';

interface FlameTestViewerProps {
  element: PeriodicElement;
}

export const FlameTestViewer: React.FC<FlameTestViewerProps> = ({ element }) => {
  const [isBurning, setIsBurning] = useState(false);

  const flameColor = element.flame_color || '#38BDF8'; // default blue Bunsen flame
  const flameName = element.flame_name || 'Standard Blue Bunsen (Non-luminous)';
  const hasCharacteristicFlame = Boolean(element.flame_color);

  const handleIgnite = () => {
    setIsBurning(true);
    soundEngine.playFlame();
    setTimeout(() => {
      // Keep burning for 4 seconds then allow repeat
    }, 4000);
  };

  const handleReset = () => {
    setIsBurning(false);
  };

  return (
    <div className="p-4 rounded-2xl border-2 border-slate-200/90 bg-slate-900 text-white flex flex-col items-center justify-between shadow-inner relative overflow-hidden select-none">
      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700 blur-2xl"
        style={{
          background: isBurning
            ? `radial-gradient(circle at 50% 60%, ${flameColor} 0%, transparent 70%)`
            : 'radial-gradient(circle at 50% 60%, #38BDF8 0%, transparent 70%)',
        }}
      />

      {/* Header Info */}
      <div className="w-full flex items-center justify-between text-xs z-10 border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-1.5 font-montserrat font-bold text-amber-400">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span>FLAME EMISSION SPECTROSCOPY</span>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
          style={{
            backgroundColor: isBurning ? flameColor : '#1E293B',
            color: isBurning ? '#FFFFFF' : '#94A3B8',
            textShadow: isBurning ? '0 1px 2px rgba(0,0,0,0.8)' : 'none',
          }}
        >
          {isBurning ? flameName : 'Base Gas Flame'}
        </span>
      </div>

      {/* Bunsen Burner & Animated Flame Canvas */}
      <div className="relative w-48 h-48 flex items-center justify-center my-1 z-10">
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          <defs>
            {/* Base Gas Flame Gradient */}
            <linearGradient id="naturalFlame" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#0284C7" stopOpacity="0.8" />
              <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.2" />
            </linearGradient>

            {/* Element Emission Flame Gradient */}
            <linearGradient id="elementFlame" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.8" />
              <stop offset="30%" stopColor={flameColor} stopOpacity="0.95" />
              <stop offset="70%" stopColor={flameColor} stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
            </linearGradient>

            {/* Inner Cone Gradient */}
            <linearGradient id="innerCone" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>

          {/* Platinum / Nichrome Wire Loop */}
          <g
            className="transition-transform duration-700 ease-out"
            style={{
              transform: isBurning ? 'translate(0px, 0px)' : 'translate(45px, -35px) rotate(15deg)',
              transformOrigin: '150px 70px',
            }}
          >
            {/* Wire Handle & Stem */}
            <line x1="160" y1="50" x2="110" y2="85" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            {/* Wire Loop */}
            <circle cx="106" cy="88" r="4.5" fill="none" stroke="#CBD5E1" strokeWidth="2" />
            {/* Element Salt Bead on Loop */}
            <circle
              cx="106"
              cy="88"
              r="3"
              fill={isBurning ? '#FFFFFF' : flameColor}
              className={isBurning ? 'animate-ping' : ''}
            />
          </g>

          {/* Animated Flame Body */}
          <g className="flame-group">
            {/* Outer Flame Envelope */}
            <path
              d="M100 135 C75 125 65 95 85 55 C95 35 100 20 100 20 C100 20 105 35 115 55 C135 95 125 125 100 135 Z"
              fill={isBurning ? 'url(#elementFlame)' : 'url(#naturalFlame)'}
              className="animate-pulse"
              style={{
                transformOrigin: '100px 135px',
                animationDuration: isBurning ? '0.4s' : '0.8s',
                filter: isBurning ? `drop-shadow(0 0 12px ${flameColor})` : 'drop-shadow(0 0 8px #38BDF8)',
              }}
            />

            {/* Inner Unburnt Gas Cone */}
            <path
              d="M100 135 C88 130 84 110 92 85 C96 70 100 62 100 62 C100 62 104 70 108 85 C116 110 112 130 100 135 Z"
              fill="url(#innerCone)"
              opacity="0.85"
            />
          </g>

          {/* Rising Sparks when Burning */}
          {isBurning && (
            <g className="sparks">
              <circle cx="95" cy="35" r="1.5" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: '0.6s' }} />
              <circle cx="105" cy="25" r="1.8" fill={flameColor} className="animate-ping" style={{ animationDuration: '0.4s' }} />
              <circle cx="100" cy="15" r="1.2" fill="#FEF08A" className="animate-ping" style={{ animationDuration: '0.5s' }} />
            </g>
          )}

          {/* Bunsen Burner Apparatus */}
          {/* Burner Chimney / Barrel */}
          <rect x="88" y="135" width="24" height="42" fill="#475569" stroke="#334155" strokeWidth="1.5" rx="2" />
          {/* Air Hole Collar */}
          <rect x="91" y="152" width="18" height="6" fill="#0F172A" rx="1" />
          {/* Heavy Cast Iron Base */}
          <polygon points="65,195 135,195 122,177 78,177" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
          {/* Gas Supply Tube */}
          <path d="M78 186 C60 186 50 190 35 195" fill="none" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Controls & Spectroscopy Insight */}
      <div className="w-full space-y-2 z-10 text-center">
        <div className="text-[11px] text-slate-300">
          {hasCharacteristicFlame ? (
            <span>
              {element.name} ({element.symbol}) emits a prominent <strong>{flameName}</strong> due to electron de-excitation.
            </span>
          ) : (
            <span className="text-slate-400">
              {element.name} does not exhibit a visible characteristic flame test (emits primarily in UV or non-volatile).
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 pt-1">
          {!isBurning ? (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Flame className="w-4 h-4" />}
              onClick={handleIgnite}
              className="bg-[#00C2D1] hover:bg-[#008E9B] text-white font-montserrat font-bold shadow-md cursor-pointer"
            >
              Dip Wire into Flame
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={handleReset}
              className="border-slate-600 text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              Remove Wire & Cool
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
