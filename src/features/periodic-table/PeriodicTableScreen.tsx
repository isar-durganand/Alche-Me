import React, { useState, useMemo } from 'react';
import { 
  Atom, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  Info, 
  ExternalLink,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PERIODIC_ELEMENTS } from '../../data/periodicTableData';
import { PeriodicElement } from '../../types/chemistry';
import { 
  Input, 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  Modal, 
  Tabs,
  Tooltip 
} from '../../components/ui';

export const PeriodicTableScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeElement, setActiveElement] = useState<PeriodicElement | null>(null);

  const categories = [
    { id: 'all', label: 'All Elements', count: 118 },
    { id: 'alkali', label: 'Alkali Metals' },
    { id: 'alkaline', label: 'Alkaline Earth' },
    { id: 'transition', label: 'Transition Metals' },
    { id: 'post-transition', label: 'Post-Transition' },
    { id: 'metalloid', label: 'Metalloids' },
    { id: 'nonmetal', label: 'Reactive Nonmetals' },
    { id: 'halogen', label: 'Halogens' },
    { id: 'noble', label: 'Noble Gases' },
    { id: 'lanthanide', label: 'Lanthanides' },
    { id: 'actinide', label: 'Actinides' },
  ];

  const categoryColorMap: Record<string, string> = {
    alkali: 'border-rose-200 bg-rose-50/60 text-rose-950 hover:border-rose-400 hover:bg-rose-50',
    alkaline: 'border-orange-200 bg-orange-50/60 text-orange-950 hover:border-orange-400 hover:bg-orange-50',
    transition: 'border-blue-200 bg-blue-50/60 text-blue-950 hover:border-blue-400 hover:bg-blue-50',
    'post-transition': 'border-sky-200 bg-sky-50/60 text-sky-950 hover:border-sky-400 hover:bg-sky-50',
    metalloid: 'border-emerald-200 bg-emerald-50/60 text-emerald-950 hover:border-emerald-400 hover:bg-emerald-50',
    nonmetal: 'border-teal-200 bg-teal-50/60 text-teal-950 hover:border-teal-400 hover:bg-teal-50',
    halogen: 'border-indigo-200 bg-indigo-50/60 text-indigo-950 hover:border-indigo-400 hover:bg-indigo-50',
    noble: 'border-purple-200 bg-purple-50/60 text-purple-950 hover:border-purple-400 hover:bg-purple-50',
    lanthanide: 'border-pink-200 bg-pink-50/60 text-pink-950 hover:border-pink-400 hover:bg-pink-50',
    actinide: 'border-amber-200 bg-amber-50/60 text-amber-950 hover:border-amber-400 hover:bg-amber-50',
  };

  const filteredElements = useMemo(() => {
    return PERIODIC_ELEMENTS.filter((el) => {
      const matchesSearch =
        el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.number.toString() === searchQuery.trim();

      const matchesCategory =
        selectedCategory === 'all' || el.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-[#00C2D1] mb-1">
              <Atom className="w-4 h-4" />
              <span>INTERACTIVE MENDELEEV GRID</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-montserrat font-extrabold text-[#0B1F2A]">
              118-Element Periodic Table
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
              Explore quantum atomic properties, Pauli subshell electron diagrams, and Pauling electronegativity trends across all 118 chemical elements.
            </p>
          </div>
          <Badge variant="accent" size="lg" className="shrink-0">
            {filteredElements.length} Elements Active
          </Badge>
        </div>

        {/* Search & Category Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <Input
              placeholder="Search by symbol, name, or Z (e.g. Fe, 26, Gold)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
          <div className="md:col-span-2">
            <Tabs
              tabs={categories.map((c) => ({ id: c.id, label: c.label }))}
              activeTab={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Element Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filteredElements.map((el) => {
          const colorClass = categoryColorMap[el.category] || 'border-slate-200 bg-white text-[#0B1F2A] hover:border-slate-400';
          return (
            <button
              key={el.number}
              type="button"
              onClick={() => setActiveElement(el)}
              className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between items-start transition-all cursor-pointer hover:scale-[1.04] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#00C2D1] select-none text-left h-28 ${colorClass}`}
            >
              <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-500 font-bold">
                <span>#{el.number}</span>
                <span className="text-[9px] uppercase tracking-wider font-montserrat truncate max-w-[50px] opacity-75">
                  {el.category.split('-')[0]}
                </span>
              </div>
              <div>
                <span className="text-2xl font-montserrat font-extrabold tracking-tight text-[#0B1F2A] block leading-none">
                  {el.symbol}
                </span>
                <span className="text-[11px] font-semibold truncate block max-w-full text-slate-700 mt-1">
                  {el.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-medium text-slate-500 block">
                {typeof el.mass === 'number' ? el.mass.toFixed(2) : el.mass}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty Filter State */}
      {filteredElements.length === 0 && (
        <div className="p-12 text-center rounded-3xl border-2 border-slate-200/90 bg-white space-y-3 shadow-sm">
          <Atom className="w-10 h-10 text-slate-300 mx-auto animate-spin" />
          <h3 className="font-montserrat font-bold text-base text-[#0B1F2A]">No Elements Match Search</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or reset to "All Elements".
          </p>
          <Button size="sm" variant="secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
            RESET FILTERS
          </Button>
        </div>
      )}

      {/* Element Detail Inspection Modal */}
      {activeElement && (
        <Modal
          isOpen={!!activeElement}
          onClose={() => setActiveElement(null)}
          title={`${activeElement.name} (${activeElement.symbol}) — Atomic Number ${activeElement.number}`}
          description={`Group ${activeElement.group}, Period ${activeElement.period} • Category: ${activeElement.category}`}
          size="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Pedagogical Summary */}
            <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/70 leading-relaxed text-[#0B1F2A] text-sm font-medium">
              {activeElement.summary}
            </div>

            {/* Scientific Properties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border-2 border-slate-100 bg-white shadow-sm">
                <span className="text-slate-500 block text-[10px] font-medium">Atomic Mass</span>
                <span className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">{activeElement.mass} u</span>
              </div>
              <div className="p-3.5 rounded-xl border-2 border-teal-100 bg-teal-50/60 shadow-sm">
                <span className="text-teal-700 block text-[10px] font-medium">Electronegativity (Pauling)</span>
                <span className="font-montserrat font-extrabold text-sm text-[#00C2D1]">
                  {activeElement.electronegativity ?? 'N/A'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border-2 border-slate-100 bg-white shadow-sm">
                <span className="text-slate-500 block text-[10px] font-medium">Atomic Radius</span>
                <span className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">
                  {activeElement.atomic_radius ? `${activeElement.atomic_radius} pm` : 'N/A'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border-2 border-slate-100 bg-white shadow-sm">
                <span className="text-slate-500 block text-[10px] font-medium">1st Ionization Energy</span>
                <span className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">
                  {activeElement.ionization_energy ? `${activeElement.ionization_energy} kJ/mol` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Electron Configuration & Oxidation States */}
            <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <span className="font-montserrat font-bold text-xs text-[#0B1F2A]">Electron Configuration:</span>
                <span className="font-mono font-bold text-sm text-[#00C2D1] bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                  {activeElement.electron_configuration}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-montserrat font-bold text-xs text-[#0B1F2A]">Common Oxidation States:</span>
                <span className="font-mono font-semibold text-xs text-slate-700">
                  {activeElement.oxidation_states || '0'}
                </span>
              </div>
            </div>

            {/* Quantum Subshell Electron Diagram */}
            {activeElement.subshells && activeElement.subshells.length > 0 && (
              <div className="space-y-2">
                <span className="font-montserrat font-bold text-xs text-[#0B1F2A] block">
                  Quantum Subshell Filling Diagram (Hund’s Rule & Pauli Exclusion Principle):
                </span>
                <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/70">
                  {activeElement.subshells.map((sub, idx) => {
                    const boxes = Math.ceil(sub.capacity / 2);
                    let remaining = sub.count;
                    const boxSpins: string[] = [];
                    for (let b = 0; b < boxes; b++) {
                      if (remaining >= 2) {
                        boxSpins.push('↑↓');
                        remaining -= 2;
                      } else if (remaining === 1) {
                        boxSpins.push('↑');
                        remaining -= 1;
                      } else {
                        boxSpins.push('—');
                      }
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 border-slate-200 bg-white shadow-sm">
                        <span className="text-[10px] font-montserrat font-extrabold text-slate-500 uppercase">{sub.subshell}</span>
                        <div className="flex items-center gap-1">
                          {boxSpins.map((spin, bIdx) => (
                            <span 
                              key={bIdx}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold border-2 ${
                                spin === '↑↓'
                                  ? 'border-teal-300 text-teal-800 bg-teal-50'
                                  : spin === '↑'
                                  ? 'border-amber-300 text-amber-800 bg-amber-50'
                                  : 'border-slate-200 text-slate-300 bg-slate-50'
                              }`}
                            >
                              {spin}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="secondary" onClick={() => setActiveElement(null)}>
                CLOSE INSPECTOR
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
