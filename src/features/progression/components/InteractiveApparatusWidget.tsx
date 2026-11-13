import React, { useState, useEffect } from 'react';
import { Flame, Droplets, RotateCw, Sparkles, Thermometer, Zap } from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';

export interface InteractiveApparatusWidgetProps {
  className?: string;
}

export const InteractiveApparatusWidget: React.FC<InteractiveApparatusWidgetProps> = ({ className = '' }) => {
  const [temperature, setTemperature] = useState<number>(24);
  const [liquidColor, setLiquidColor] = useState<string>('#00C2D1'); // Teal -> Purple -> Gold -> Emerald
  const [isStirring, setIsStirring] = useState<boolean>(true);
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [reactionStage, setReactionStage] = useState<string>('Stable Mixture (24.0°C)');
  const [dropAnim, setDropAnim] = useState<boolean>(false);
  const [bubbleCount, setBubbleCount] = useState<number>(6);

  // Temperature auto-rise when heating
  useEffect(() => {
    let timer: any;
    if (isHeating) {
      timer = setInterval(() => {
        setTemperature((prev) => {
          const next = Math.min(95, prev + 2.5);
          if (next > 70) {
            setLiquidColor('#F59E0B');
            setReactionStage('Exothermic Boiling (Effervescent)');
            setBubbleCount(14);
          } else if (next > 45) {
            setLiquidColor('#8B5CF6');
            setReactionStage('Active Thermal Transformation');
            setBubbleCount(10);
          }
          return next;
        });
      }, 350);
    } else {
      timer = setInterval(() => {
        setTemperature((prev) => {
          if (prev <= 24) return 24;
          const next = Math.max(24, prev - 1.5);
          if (next < 40 && liquidColor !== '#00C2D1') {
            setReactionStage('Cooled Baseline Equilibrium');
          }
          return next;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isHeating, liquidColor]);

  const handleAddDrop = () => {
    soundEngine.playDroplet();
    setDropAnim(true);
    setTimeout(() => {
      setDropAnim(false);
      // Cycle colors
      setLiquidColor((prev) => {
        if (prev === '#00C2D1') return '#8B5CF6'; // purple
        if (prev === '#8B5CF6') return '#EC4899'; // pink
        if (prev === '#EC4899') return '#10B981'; // emerald
        return '#00C2D1';
      });
      setReactionStage('Catalyzed Chromophoric Shift');
    }, 450);
  };

  const handleToggleHeat = () => {
    soundEngine.playTap();
    setIsHeating((prev) => !prev);
  };

  const handleToggleStir = () => {
    soundEngine.playTap();
    setIsStirring((prev) => !prev);
  };

  const handleReset = () => {
    soundEngine.playTap();
    setTemperature(24);
    setLiquidColor('#00C2D1');
    setIsHeating(false);
    setIsStirring(true);
    setReactionStage('Stable Mixture (24.0°C)');
    setBubbleCount(6);
  };

  return (
    <div className={`p-4 rounded-3xl border-2 border-slate-200/90 bg-gradient-to-b from-slate-900 to-[#0B1F2A] text-white shadow-md relative overflow-hidden select-none ${className}`}>
      {/* Background Glow */}
      <div 
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: liquidColor }}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 text-[#00C2D1] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="font-montserrat font-extrabold text-xs text-white block">
              Interactive Micro-Apparatus Sandbox
            </span>
            <span className="text-[10px] text-teal-300 font-mono">
              Live Reaction Physics • Tactile Laboratory Controls
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-teal-300 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            {temperature.toFixed(1)} °C
          </span>
          <button
            type="button"
            onClick={handleReset}
            title="Reset apparatus"
            className="text-[10px] font-montserrat font-bold px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Interactive Visual Stage */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-2">
        {/* SVG Flask Apparatus Stage */}
        <div className="sm:col-span-7 flex justify-center items-center relative h-48">
          <svg viewBox="0 0 200 200" className="w-44 h-44 overflow-visible">
            <defs>
              <linearGradient id="flaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
              </linearGradient>

              <linearGradient id="liquidFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={liquidColor} stopOpacity="0.75" />
                <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
              </linearGradient>

              <filter id="flaskGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Dropper Pipette above flask */}
            <g transform="translate(95, 5)">
              <rect x="2" y="0" width="6" height="24" rx="2" fill="#94A3B8" opacity="0.8" />
              <circle cx="5" cy="0" r="6" fill="#F43F5E" />
              {/* Animated Droplet */}
              {dropAnim && (
                <circle cx="5" cy="18" r="4" fill={liquidColor} className="animate-bounce">
                  <animate attributeName="cy" from="18" to="90" dur="0.45s" repeatCount="1" fill="freeze" />
                  <animate attributeName="opacity" from="1" to="0" dur="0.45s" repeatCount="1" fill="freeze" />
                </circle>
              )}
            </g>

            {/* Erlenmeyer Flask Outline */}
            <path
              d="M 85 30 L 115 30 L 115 65 L 160 155 Q 165 165 155 165 L 45 165 Q 35 165 40 155 L 85 65 Z"
              fill="url(#flaskGrad)"
              stroke="#64748B"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Liquid inside flask */}
            <path
              d="M 68 115 Q 100 110 132 115 L 153 158 Q 155 162 148 162 L 52 162 Q 45 162 47 158 Z"
              fill="url(#liquidFill)"
              filter="url(#flaskGlow)"
              className="transition-all duration-500"
            />

            {/* Liquid surface wave ripple */}
            <path
              d={isStirring ? "M 68 115 Q 100 120 132 115" : "M 68 115 Q 100 115 132 115"}
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />

            {/* Measurement Graduations on glass */}
            <line x1="102" y1="90" x2="114" y2="90" stroke="#94A3B8" strokeWidth="1.5" opacity="0.6" />
            <line x1="97" y1="110" x2="112" y2="110" stroke="#94A3B8" strokeWidth="1.5" opacity="0.6" />
            <line x1="90" y1="130" x2="108" y2="130" stroke="#94A3B8" strokeWidth="1.5" opacity="0.6" />
            <text x="117" y="113" fill="#94A3B8" fontSize="8" fontFamily="monospace" opacity="0.7">100 mL</text>

            {/* Magnetic Stirrer Bar */}
            {isStirring && (
              <rect
                x="88"
                y="155"
                width="24"
                height="5"
                rx="2.5"
                fill="#ffffff"
                className="origin-center"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 100 157.5"
                  to="360 100 157.5"
                  dur="0.25s"
                  repeatCount="indefinite"
                />
              </rect>
            )}

            {/* Rising Bubbles */}
            {Array.from({ length: bubbleCount }).map((_, bIdx) => {
              const xPos = 65 + (bIdx * 12) % 65;
              const delay = bIdx * 0.2;
              return (
                <circle
                  key={bIdx}
                  cx={xPos}
                  cy="150"
                  r={1.8 + (bIdx % 2)}
                  fill="#ffffff"
                  opacity="0.7"
                >
                  <animate
                    attributeName="cy"
                    from="155"
                    to="114"
                    dur={`${1.0 + (bIdx % 3) * 0.4}s`}
                    begin={`${delay}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0.8;0"
                    dur={`${1.0 + (bIdx % 3) * 0.4}s`}
                    begin={`${delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              );
            })}

            {/* Bunsen Burner Flame below flask */}
            {isHeating && (
              <g transform="translate(100, 180)">
                <path
                  d="M 0 -12 Q -8 -2 0 6 Q 8 -2 0 -12 Z"
                  fill="#38BDF8"
                  opacity="0.9"
                >
                  <animate
                    attributeName="d"
                    values="M 0 -12 Q -8 -2 0 6 Q 8 -2 0 -12 Z; M 0 -16 Q -10 -4 0 6 Q 10 -4 0 -16 Z; M 0 -12 Q -8 -2 0 6 Q 8 -2 0 -12 Z"
                    dur="0.3s"
                    repeatCount="indefinite"
                  />
                </path>
                <path
                  d="M 0 -8 Q -5 -2 0 4 Q 5 -2 0 -8 Z"
                  fill="#F59E0B"
                  opacity="0.95"
                />
                <rect x="-15" y="6" width="30" height="6" rx="2" fill="#475569" />
              </g>
            )}
          </svg>
        </div>

        {/* Tactile Control Buttons & Reaction State Card */}
        <div className="sm:col-span-5 space-y-2.5">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <span className="text-[10px] font-montserrat font-extrabold uppercase tracking-wider text-slate-400 block">
              Observed Phenomenon
            </span>
            <div className="font-montserrat font-bold text-xs text-teal-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              {reactionStage}
            </div>
            <span className="text-[10px] text-slate-400 block">
              Tap the apparatus controls below to trigger physical & chemical transformations.
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleAddDrop}
              className="p-2.5 rounded-xl border border-teal-500/50 bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 font-montserrat font-bold text-[11px] flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Droplets className="w-4 h-4 text-[#00C2D1]" />
              <span>+ Drop</span>
            </button>

            <button
              type="button"
              onClick={handleToggleHeat}
              className={`p-2.5 rounded-xl border font-montserrat font-bold text-[11px] flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isHeating
                  ? 'border-amber-400 bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                  : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Flame className={`w-4 h-4 ${isHeating ? 'text-slate-950 animate-bounce' : 'text-amber-400'}`} />
              <span>{isHeating ? 'Flame ON' : 'Heat'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleStir}
              className={`p-2.5 rounded-xl border font-montserrat font-bold text-[11px] flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isStirring
                  ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-200'
                  : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-400'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isStirring ? 'text-cyan-400 animate-spin-slow' : 'text-slate-400'}`} />
              <span>{isStirring ? 'Stirring' : 'Stir'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
