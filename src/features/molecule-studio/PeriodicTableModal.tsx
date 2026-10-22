/**
 * Alche-Me — MolView-Standard Periodic Table Modal
 * Exact visual match to MolView (app.molview.com) Periodic Table popup.
 * Full 18-column IUPAC table with authentic category pastel color blocks.
 */

import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { getAll118Elements } from '../../data/periodicTableData';
import { PeriodicElement } from '../../types/chemistry';
import { soundEngine } from '../../infrastructure/audio/soundEngine';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElement: string;
  onSelectElement: (symbol: string) => void;
}

// Exact MolView category pastel color palette
function getMolViewCategoryColor(el: PeriodicElement): string {
  if (el.number === 1) return '#E2F89C'; // Hydrogen (light lime-green)
  if (el.category === 'noble') return '#BCEEF4'; // Noble gases (light cyan)
  if (el.category === 'alkali') return '#FFB8C6'; // Alkali metals (soft pink)
  if (el.category === 'alkaline') return '#FFE2B8'; // Alkaline earth (pale peach)
  if (el.category === 'transition') return '#FFC8C8'; // Transition metals (light salmon pink)
  if (el.category === 'post-transition') return '#E4E7EB'; // Post-transition (neutral soft gray)
  if (el.category === 'metalloid') return '#D4F4B8'; // Metalloids (soft pale green)
  if (el.category === 'halogen') return '#F4FCA8'; // Halogens (pale yellow-green)
  if (el.category === 'nonmetal') return '#FFF8A8'; // Nonmetals (pale soft yellow)
  if (el.category === 'lanthanide') return '#F2D2FF'; // Lanthanides (soft lavender purple)
  if (el.category === 'actinide') return '#FFBCE8'; // Actinides (soft magenta rose)
  return '#E2E8F0';
}

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  isOpen,
  onClose,
  selectedElement,
  onSelectElement,
}) => {
  const allElements = useMemo(() => getAll118Elements(), []);

  // Split elements into main grid and f-block (lanthanides/actinides)
  const { mainGrid, lanthanides, actinides } = useMemo(() => {
    const lanth: PeriodicElement[] = [];
    const act: PeriodicElement[] = [];
    const main: Record<string, PeriodicElement> = {}; // key: `row-col`

    for (const el of allElements) {
      if (el.number >= 57 && el.number <= 71) {
        lanth.push(el);
      } else if (el.number >= 89 && el.number <= 103) {
        act.push(el);
      } else {
        // Main grid position
        main[`${el.period}-${el.group}`] = el;
      }
    }

    lanth.sort((a, b) => a.number - b.number);
    act.sort((a, b) => a.number - b.number);

    return { mainGrid: main, lanthanides: lanth, actinides: act };
  }, [allElements]);

  if (!isOpen) return null;

  const handleCellClick = (el: PeriodicElement) => {
    soundEngine.playElementPip(el.number);
    onSelectElement(el.symbol);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#EDEDED] rounded-2xl border-2 border-slate-300 shadow-2xl p-4 sm:p-6 flex flex-col max-h-[92vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Screenshot 2 */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-300/80 shrink-0">
          <div className="w-8" /> {/* Spacer */}
          <h2 className="text-lg sm:text-xl font-montserrat font-bold text-slate-800 text-center">
            Periodic table
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-300 transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 18-Column Main Table Grid */}
        <div className="w-full overflow-x-auto py-1">
          <div className="min-w-[680px]">
            {/* Rows 1 through 7 */}
            {[1, 2, 3, 4, 5, 6, 7].map((row) => (
              <div 
                key={`row-${row}`} 
                style={{ display: 'grid', gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gap: '2px', marginBottom: '2px' }}
              >
                {Array.from({ length: 18 }, (_, i) => i + 1).map((col) => {
                  const el = mainGrid[`${row}-${col}`];

                  if (!el) {
                    return <div key={`empty-${row}-${col}`} className="w-full aspect-square" />;
                  }

                  const isSelected = el.symbol.toLowerCase() === selectedElement.toLowerCase();
                  const bgColor = getMolViewCategoryColor(el);

                  return (
                    <button
                      key={el.symbol}
                      type="button"
                      onClick={() => handleCellClick(el)}
                      style={{ backgroundColor: bgColor }}
                      title={`${el.name} (Atomic #${el.number})`}
                      className={`w-full aspect-square flex flex-col items-center justify-center border transition-all cursor-pointer rounded-[2px] leading-none ${
                        isSelected
                          ? 'border-black ring-2 ring-blue-500 scale-105 z-10 shadow-md font-extrabold'
                          : 'border-slate-400/80 hover:border-black hover:scale-105 hover:z-10'
                      }`}
                    >
                      <span className="text-[7.5px] sm:text-[9px] font-mono text-slate-700/90 mb-0.5">
                        {el.number}
                      </span>
                      <span className="text-[10px] sm:text-[12px] font-bold text-slate-900">
                        {el.symbol}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Gap before Lanthanides and Actinides */}
            <div className="h-4" />

            {/* Lanthanides Row (Cols 3 to 17) */}
            <div 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gap: '2px', marginBottom: '2px' }}
            >
              <div style={{ gridColumn: 'span 2' }} />
              {lanthanides.map((el) => {
                const isSelected = el.symbol.toLowerCase() === selectedElement.toLowerCase();
                const bgColor = getMolViewCategoryColor(el);
                return (
                  <button
                    key={el.symbol}
                    type="button"
                    onClick={() => handleCellClick(el)}
                    style={{ backgroundColor: bgColor }}
                    title={`${el.name} (Atomic #${el.number})`}
                    className={`w-full aspect-square flex flex-col items-center justify-center border transition-all cursor-pointer rounded-[2px] leading-none ${
                      isSelected
                        ? 'border-black ring-2 ring-blue-500 scale-105 z-10 font-extrabold'
                        : 'border-slate-400/80 hover:border-black hover:scale-105 hover:z-10'
                    }`}
                  >
                    <span className="text-[7.5px] sm:text-[9px] font-mono text-slate-700/90 mb-0.5">
                      {el.number}
                    </span>
                    <span className="text-[10px] sm:text-[12px] font-bold text-slate-900">
                      {el.symbol}
                    </span>
                  </button>
                );
              })}
              <div style={{ gridColumn: 'span 1' }} />
            </div>

            {/* Actinides Row (Cols 3 to 17) */}
            <div 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gap: '2px' }}
            >
              <div style={{ gridColumn: 'span 2' }} />
              {actinides.map((el) => {
                const isSelected = el.symbol.toLowerCase() === selectedElement.toLowerCase();
                const bgColor = getMolViewCategoryColor(el);
                return (
                  <button
                    key={el.symbol}
                    type="button"
                    onClick={() => handleCellClick(el)}
                    style={{ backgroundColor: bgColor }}
                    title={`${el.name} (Atomic #${el.number})`}
                    className={`w-full aspect-square flex flex-col items-center justify-center border transition-all cursor-pointer rounded-[2px] leading-none ${
                      isSelected
                        ? 'border-black ring-2 ring-blue-500 scale-105 z-10 font-extrabold'
                        : 'border-slate-400/80 hover:border-black hover:scale-105 hover:z-10'
                    }`}
                  >
                    <span className="text-[7.5px] sm:text-[9px] font-mono text-slate-700/90 mb-0.5">
                      {el.number}
                    </span>
                    <span className="text-[10px] sm:text-[12px] font-bold text-slate-900">
                      {el.symbol}
                    </span>
                  </button>
                );
              })}
              <div style={{ gridColumn: 'span 1' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
