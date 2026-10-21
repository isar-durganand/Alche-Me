import React from 'react';
import { PeriodicElement } from '../../types/chemistry';

interface OrbitalBoxesViewerProps {
  element: PeriodicElement;
}

export const OrbitalBoxesViewer: React.FC<OrbitalBoxesViewerProps> = ({ element }) => {
  // Generate standard subshell breakdown if subshells exist
  const subshells = element.subshells && element.subshells.length > 0
    ? element.subshells
    : [
        { subshell: '1s', count: Math.min(2, element.number), capacity: 2 },
        { subshell: '2s', count: Math.max(0, Math.min(2, element.number - 2)), capacity: 2 },
        { subshell: '2p', count: Math.max(0, Math.min(6, element.number - 4)), capacity: 6 },
      ];

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between text-xs">
        <span className="font-montserrat font-bold text-slate-700 tracking-wide uppercase text-[11px]">
          Orbital Filling Diagram (Hund's Rule & Pauli Principle)
        </span>
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-[#00C2D1]">
          {element.electron_configuration}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
        {subshells.map((sub, sIdx) => {
          const numBoxes = Math.max(1, sub.capacity / 2);
          const electrons = sub.count;

          // Hund's rule: fill up spins first, then down spins
          const boxes = Array.from({ length: numBoxes }, (_, bIdx) => {
            let hasUp = false;
            let hasDown = false;
            if (electrons > bIdx) hasUp = true;
            if (electrons > numBoxes + bIdx) hasDown = true;

            return (
              <div
                key={bIdx}
                className="w-7 h-8 border-2 border-slate-200 bg-white rounded-lg flex items-center justify-center font-mono text-xs shadow-xs hover:border-[#00C2D1] transition-colors"
                title={`Orbital ${bIdx + 1} of ${sub.subshell}`}
              >
                <span className={hasUp ? 'text-teal-600 font-extrabold text-sm' : 'text-slate-300'}>
                  {hasUp ? '↑' : '·'}
                </span>
                <span className={hasDown ? 'text-rose-500 font-extrabold text-sm ml-0.5' : 'text-slate-300 ml-0.5'}>
                  {hasDown ? '↓' : '·'}
                </span>
              </div>
            );
          });

          return (
            <div
              key={sIdx}
              className="bg-slate-50 border-2 border-slate-100 p-2.5 rounded-xl flex flex-col gap-1.5 shadow-xs"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#0B1F2A] font-bold text-xs">{sub.subshell}</span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {sub.count} / {sub.capacity} e⁻
                </span>
              </div>
              <div className="flex items-center gap-1">{boxes}</div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-500 italic">
        Blue spin-up arrows (↑) fill first according to Hund's rule of maximum multiplicity before pairing with red spin-down arrows (↓).
      </p>
    </div>
  );
};
