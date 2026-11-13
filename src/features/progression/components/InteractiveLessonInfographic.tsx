import React, { useState } from 'react';
import { 
  Eye, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Zap,
  Flame,
  Check,
  ChevronRight
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';

export interface InteractiveLessonInfographicProps {
  className?: string;
}

export const InteractiveLessonInfographic: React.FC<InteractiveLessonInfographicProps> = ({ className = '' }) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [revealedClues, setRevealedClues] = useState<Record<number, boolean>>({});
  const [matterState, setMatterState] = useState<'solid' | 'liquid' | 'gas'>('liquid');

  const handleToggleClue = (idx: number) => {
    soundEngine.playSuccess();
    setRevealedClues((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSelectState = (state: 'solid' | 'liquid' | 'gas') => {
    soundEngine.playTap();
    setMatterState(state);
  };

  const slides = [
    {
      id: 'duel',
      title: 'Visual Duel: Direct Observation vs Inference',
      badge: 'Core Scientific Principle',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      id: 'matter',
      title: 'Interactive Particle Chamber: States of Matter',
      badge: 'Microscopic Physics',
      badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    },
    {
      id: 'hypothesis',
      title: 'The Testable Question Crucible',
      badge: 'Scientific Methodology',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  return (
    <div className={`p-5 rounded-3xl border-2 border-slate-200/90 bg-white shadow-sm space-y-4 select-none ${className}`}>
      {/* Slide Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                soundEngine.playTap();
                setActiveSlide(idx);
              }}
              className={`px-3 py-1.5 rounded-xl font-montserrat font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                activeSlide === idx
                  ? 'bg-[#00C2D1] text-white border-[#008E9B] shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{idx + 1}. {s.title.split(':')[0]}</span>
            </button>
          ))}
        </div>

        <span className="text-[11px] font-montserrat font-extrabold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          Slide {activeSlide + 1} of {slides.length}
        </span>
      </div>

      {/* SLIDE 0: DIRECT OBSERVATION VS INFERENCE DUEL */}
      {activeSlide === 0 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-[#0B1F2A]">
              Never Confuse What You See With What You Guess!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Real chemists separate empirical evidence from theoretical deductions. Click each card to test your scientific radar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Direct Observation Card */}
            <div className="p-4 rounded-2xl border-2 border-teal-200 bg-teal-50/40 space-y-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 font-montserrat font-extrabold text-[11px] flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-teal-700" /> DIRECT OBSERVATION
                </span>
                <span className="text-xs font-mono font-bold text-teal-600">100% EMPIRICAL</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">
                  "The liquid turns vivid blue and bubbling gas is released."
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Recorded directly through your senses or calibrated instruments. Objective, repeatable, and requires zero assumptions about chemical identity.
                </p>
              </div>

              <div className="pt-2 border-t border-teal-200/60 flex items-center gap-2 text-xs font-montserrat font-bold text-teal-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Verified by sensory measurement</span>
              </div>
            </div>

            {/* Explanatory Inference Card */}
            <div className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50/40 space-y-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-montserrat font-extrabold text-[11px] flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-700" /> EXPLANATORY INFERENCE
                </span>
                <span className="text-xs font-mono font-bold text-amber-600">HYPOTHESIS</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">
                  "A single displacement reaction produced pure hydrogen gas."
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A logical explanation of <em>why</em> or <em>what</em> occurred. It may be true, but it requires analytical tests (like the squeaky pop test) to prove!
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/60 flex items-center gap-2 text-xs font-montserrat font-bold text-amber-800">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Requires experimental proof</span>
              </div>
            </div>
          </div>

          {/* Interactive Lab Clue Box */}
          <div 
            onClick={() => handleToggleClue(0)}
            className="p-3.5 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/30 hover:bg-teal-50/60 transition-all cursor-pointer flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-700 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-montserrat font-extrabold text-xs text-[#0B1F2A] block">
                  {revealedClues[0] ? 'Secret Master Rule Revealed!' : 'Tap to Reveal the Chemist’s Golden Rule'}
                </span>
                <span className="text-[11px] text-slate-600">
                  {revealedClues[0] 
                    ? 'Always write instrument numbers first. Hypotheses belong in the discussion, never in raw data!' 
                    : 'Click to unlock the secret to passing all laboratory exams.'}
                </span>
              </div>
            </div>
            <span className="text-xs font-montserrat font-bold text-[#00C2D1]">
              {revealedClues[0] ? 'Unlocked' : 'Tap Reveal →'}
            </span>
          </div>
        </div>
      )}

      {/* SLIDE 1: STATES OF MATTER PARTICLE SIMULATOR */}
      {activeSlide === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-montserrat font-extrabold text-sm sm:text-base text-[#0B1F2A]">
                Particulate Model: Thermal Kinetic Motion
              </h3>
              <p className="text-xs text-slate-500">
                Matter is made of particles. Temperature changes their speed and spacing!
              </p>
            </div>

            {/* State selector buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
              {(['solid', 'liquid', 'gas'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSelectState(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-montserrat font-bold uppercase transition-all cursor-pointer ${
                    matterState === st
                      ? 'bg-white text-[#0B1F2A] shadow-xs scale-105'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Particle Simulation Chamber Canvas */}
          <div className="h-44 rounded-2xl border-2 border-slate-200 bg-slate-900 flex items-center justify-center relative overflow-hidden p-3 shadow-inner">
            <svg viewBox="0 0 240 140" className="w-full h-full overflow-visible">
              <defs>
                <radialGradient id="atomGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0284C7" />
                </radialGradient>
              </defs>

              {/* Solid State Grid */}
              {matterState === 'solid' && (
                <g transform="translate(60, 25)">
                  {Array.from({ length: 4 }).map((_, r) =>
                    Array.from({ length: 6 }).map((_, c) => (
                      <circle
                        key={`${r}-${c}`}
                        cx={c * 20}
                        cy={r * 22}
                        r="7"
                        fill="url(#atomGlow)"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          values="0 0; 0.8 0.5; -0.8 -0.5; 0 0"
                          dur="0.15s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    ))
                  )}
                  <text x="50" y="105" fill="#94A3B8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                    Rigid Lattice • Fixed Shape & Volume
                  </text>
                </g>
              )}

              {/* Liquid State Flowing */}
              {matterState === 'liquid' && (
                <g transform="translate(60, 20)">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const bx = (i % 5) * 24 + ((i * 7) % 10);
                    const by = Math.floor(i / 5) * 20 + 20;
                    return (
                      <circle
                        key={i}
                        cx={bx}
                        cy={by}
                        r="7"
                        fill="#00C2D1"
                        opacity="0.9"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          values="0 0; 3 4; -2 6; 0 0"
                          dur={`${0.8 + (i % 4) * 0.3}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    );
                  })}
                  <text x="50" y="105" fill="#94A3B8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                    Fluid Flow • Fixed Volume, Conforms to Container
                  </text>
                </g>
              )}

              {/* Gas State High Speed Bouncing */}
              {matterState === 'gas' && (
                <g transform="translate(40, 15)">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const x1 = (i * 25) % 150;
                    const y1 = (i * 18) % 75;
                    const x2 = (x1 + 60) % 150;
                    const y2 = (y1 + 45) % 75;
                    return (
                      <circle
                        key={i}
                        cx={x1}
                        cy={y1}
                        r="6"
                        fill="#F59E0B"
                        opacity="0.95"
                      >
                        <animate
                          attributeName="cx"
                          values={`${x1}; ${x2}; ${x1}`}
                          dur={`${0.6 + (i % 3) * 0.2}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          values={`${y1}; ${y2}; ${y1}`}
                          dur={`${0.6 + (i % 3) * 0.2}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    );
                  })}
                  <text x="80" y="110" fill="#94A3B8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                    Fast Random Trajectories • Expands to Fill Any Space
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-montserrat font-bold text-slate-700">
              Current Kinetic Energy:
            </span>
            <span className="font-montserrat font-extrabold text-[#00C2D1]">
              {matterState === 'solid' ? 'Low (Vibrational only)' : matterState === 'liquid' ? 'Moderate (Translational + Flow)' : 'High (Rapid Collisions)'}
            </span>
          </div>
        </div>
      )}

      {/* SLIDE 2: TESTABLE HYPOTHESES */}
      {activeSlide === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <h3 className="font-montserrat font-extrabold text-sm sm:text-base text-[#0B1F2A]">
              Scientific Hypotheses Must Be Measurable & Verifiable
            </h3>
            <p className="text-xs text-slate-500">
              A scientific question can always be tested by collecting numerical or observable laboratory data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-montserrat font-extrabold text-[10px] inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> VALID TESTABLE QUESTION
              </span>
              <p className="font-montserrat font-bold text-xs sm:text-sm text-[#0B1F2A]">
                "Does increasing water temperature increase the mass of CuSO₄ that dissolves in 100 mL?"
              </p>
              <span className="text-[11px] text-emerald-900 block font-medium">
                ✓ Measure mass on balance (g) and temperature (°C). Objective and verifiable!
              </span>
            </div>

            <div className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/40 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-montserrat font-extrabold text-[10px] inline-flex items-center gap-1">
                ✕ NON-TESTABLE QUESTION
              </span>
              <p className="font-montserrat font-bold text-xs sm:text-sm text-[#0B1F2A]">
                "Is Copper Sulfate crystals prettier than Potassium Permanganate crystals?"
              </p>
              <span className="text-[11px] text-rose-900 block font-medium">
                ✗ Subjective personal opinion cannot be calibrated or proven by instruments.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
