import React from 'react';
import { PeriodicElement } from '../../types/chemistry';

interface BohrAtomVisualizerProps {
  element: PeriodicElement;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const BohrAtomVisualizer: React.FC<BohrAtomVisualizerProps> = ({
  element,
  size = 'md',
  showDetails = true,
}) => {
  const shells = element.shells || [element.number];
  const atomicNumber = element.number;
  const massNumber = Math.round(element.mass);
  const neutrons = Math.max(0, massNumber - atomicNumber);

  // Dimension scaling
  const dim = size === 'sm' ? 140 : size === 'md' ? 220 : 300;
  const center = dim / 2;
  const maxRadius = center - (size === 'sm' ? 10 : 18);
  const shellCount = shells.length;
  const radiusStep = shellCount > 0 ? (maxRadius - (size === 'sm' ? 16 : 24)) / shellCount : 10;

  // Colors based on element category
  const categoryGlow: Record<string, string> = {
    alkali: '#F43F5E',
    alkaline: '#F59E0B',
    transition: '#3B82F6',
    'post-transition': '#0EA5E9',
    metalloid: '#10B981',
    nonmetal: '#00C2D1',
    halogen: '#6366F1',
    noble: '#A855F7',
    lanthanide: '#EC4899',
    actinide: '#F97316',
  };
  const themeColor = categoryGlow[element.category] || '#00C2D1';

  return (
    <div className="flex flex-col items-center select-none">
      <div
        className="relative flex items-center justify-center"
        style={{ width: `${dim}px`, height: `${dim}px` }}
      >
        <svg
          width={dim}
          height={dim}
          viewBox={`0 0 ${dim} ${dim}`}
          className="overflow-visible"
        >
          <defs>
            {/* Nucleus Radial Gradient */}
            <radialGradient id={`nucleus-${element.symbol}`} cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor={themeColor} />
              <stop offset="100%" stopColor="#0B1F2A" />
            </radialGradient>

            {/* Electron Glow Filter */}
            <filter id="electron-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric Quantum Orbital Rings & Orbiting Electrons */}
          {shells.map((electronsInShell, shellIdx) => {
            const shellNum = shellIdx + 1;
            const r = (size === 'sm' ? 18 : 26) + shellIdx * radiusStep;
            // Alternating rotational speeds (inner faster, outer slower)
            const duration = 4 + shellIdx * 2.5;
            const isClockwise = shellIdx % 2 === 0;

            return (
              <g key={`shell-${shellNum}`}>
                {/* Orbital Ring Track */}
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke={themeColor}
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  strokeOpacity={0.4}
                />

                {/* Rotating Group for Electrons */}
                <g
                  style={{
                    transformOrigin: `${center}px ${center}px`,
                    animation: `spinOrbit ${duration}s linear infinite ${isClockwise ? 'normal' : 'reverse'}`,
                  }}
                >
                  {Array.from({ length: electronsInShell }).map((_, eIdx) => {
                    const angle = (2 * Math.PI * eIdx) / electronsInShell;
                    const ex = center + r * Math.cos(angle);
                    const ey = center + r * Math.sin(angle);
                    const electronRadius = size === 'sm' ? 2.5 : size === 'md' ? 3.5 : 4.5;

                    return (
                      <circle
                        key={`e-${shellNum}-${eIdx}`}
                        cx={ex}
                        cy={ey}
                        r={electronRadius}
                        fill="#00FFFF"
                        stroke="#FFFFFF"
                        strokeWidth="1"
                        filter="url(#electron-glow)"
                      />
                    );
                  })}
                </g>
              </g>
            );
          })}

          {/* Dense Central Nucleus with Proton / Neutron Cluster */}
          <circle
            cx={center}
            cy={center}
            r={size === 'sm' ? 12 : size === 'md' ? 18 : 24}
            fill={`url(#nucleus-${element.symbol})`}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            className="animate-pulse"
          />

          {/* Nucleus Symbol */}
          <text
            x={center}
            y={center + (size === 'sm' ? 3.5 : 5)}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize={size === 'sm' ? '10px' : size === 'md' ? '13px' : '16px'}
            fontWeight="bold"
            fontFamily="Montserrat, sans-serif"
            letterSpacing="-0.5px"
          >
            {element.symbol}
          </text>
        </svg>

        <style>{`
          @keyframes spinOrbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {showDetails && (
        <div className="mt-2 text-center text-xs space-y-1">
          <div className="flex items-center justify-center gap-2 font-mono text-[11px] font-semibold text-slate-600">
            <span className="text-rose-600 font-bold">{atomicNumber} p⁺</span>
            <span>•</span>
            <span className="text-slate-500 font-bold">{neutrons} n⁰</span>
            <span>•</span>
            <span className="text-cyan-600 font-bold">{atomicNumber} e⁻</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Shells ({shells.join(', ')})
          </div>
        </div>
      )}
    </div>
  );
};
