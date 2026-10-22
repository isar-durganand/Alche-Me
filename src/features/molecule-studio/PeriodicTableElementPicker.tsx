/**
 * Alche-Me — 3D Molecular Builder Periodic Table Element Picker
 * Allows selecting ANY element from the entire 118-element IUPAC periodic table:
 * - Search by name, symbol, or atomic number
 * - Filter by chemical group / category
 * - Shows CPK color indicator, atomic mass, and category badge
 */

import React, { useState, useMemo } from 'react';
import { Search, X, Check, Atom } from 'lucide-react';
import { getAll118Elements } from '../../data/periodicTableData';
import { PeriodicElement } from '../../types/chemistry';
import { getElementData } from './types';
import { soundEngine } from '../../infrastructure/audio/soundEngine';

interface PeriodicTableElementPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElement: string;
  onSelectElement: (symbol: string) => void;
}

export const PeriodicTableElementPicker: React.FC<PeriodicTableElementPickerProps> = ({
  isOpen,
  onClose,
  selectedElement,
  onSelectElement,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const allElements = useMemo(() => getAll118Elements(), []);

  const filteredElements = useMemo(() => {
    return allElements.filter((el) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        el.symbol.toLowerCase().includes(q) ||
        el.name.toLowerCase().includes(q) ||
        el.number.toString() === q;

      const matchesCat = 
        categoryFilter === 'all' || 
        el.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [allElements, searchQuery, categoryFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl border-2 border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00C2D1] text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <Atom className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-montserrat font-extrabold text-base text-[#0B1F2A]">
                Periodic Table Element Palette (All 118 Elements)
              </h2>
              <p className="text-xs text-slate-500">
                Choose any element from the entire periodic table to build, bond, or mutate.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by symbol, name, or atomic number (e.g. Au, Gold, 79, Fe, Uranium)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-montserrat focus:bg-white focus:outline-[#00C2D1]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All 118' },
              { id: 'nonmetal', label: 'Nonmetals' },
              { id: 'alkali', label: 'Alkali Metals' },
              { id: 'alkaline', label: 'Alkaline Earth' },
              { id: 'transition', label: 'Transition Metals' },
              { id: 'post_transition', label: 'Post-Transition' },
              { id: 'metalloid', label: 'Metalloids' },
              { id: 'halogen', label: 'Halogens' },
              { id: 'noble', label: 'Noble Gases' },
              { id: 'lanthanide', label: 'Lanthanides' },
              { id: 'actinide', label: 'Actinides' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  soundEngine.playTap();
                  setCategoryFilter(cat.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-montserrat font-bold transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[#00C2D1] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Elements Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {filteredElements.map((el) => {
            const data = getElementData(el.symbol);
            const isSelected = selectedElement.toLowerCase() === el.symbol.toLowerCase();

            return (
              <button
                key={el.number}
                type="button"
                onClick={() => {
                  soundEngine.playElementPip(el.number);
                  onSelectElement(el.symbol);
                  onClose();
                }}
                className={`relative p-2 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                  isSelected
                    ? 'border-[#00C2D1] bg-teal-50/80 shadow-md ring-2 ring-[#00C2D1]/30'
                    : 'border-slate-200 bg-white hover:border-[#00C2D1] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[9px] font-mono font-bold text-slate-400">
                    {el.number}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: data.hexColor }}
                  />
                </div>

                <div className="my-auto">
                  <div className="font-montserrat font-black text-base text-[#0B1F2A] leading-tight">
                    {el.symbol}
                  </div>
                  <div className="text-[10px] font-montserrat font-bold text-slate-500 truncate">
                    {el.name}
                  </div>
                </div>

                <div className="text-[8px] font-mono text-slate-400 truncate">
                  {el.mass.toFixed(2)}
                </div>

                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#00C2D1] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 font-medium">
            Showing {filteredElements.length} of 118 elements
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-montserrat font-bold cursor-pointer transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
