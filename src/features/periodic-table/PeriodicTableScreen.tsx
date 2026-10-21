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
    alkali: 'border-red-500/40 text-red-400 bg-red-950/20',
    alkaline: 'border-orange-500/40 text-orange-400 bg-orange-950/20',
    transition: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
    'post-transition': 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
    metalloid: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    nonmetal: 'border-green-500/40 text-green-400 bg-green-950/20',
    halogen: 'border-teal-500/40 text-teal-400 bg-teal-950/20',
    noble: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
    lanthanide: 'border-pink-500/40 text-pink-400 bg-pink-950/20',
    actinide: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-[var(--cq-text)] flex items-center gap-2.5">
              <Atom className="w-6 h-6 text-[var(--cq-accent)]" />
              Mendeleev 118-Element Periodic Grid
            </h1>
            <p className="text-xs text-[var(--cq-text-muted)]">
              Interactive quantum properties, Pauli subshell electron diagrams, and electronegativity trends
            </p>
          </div>
          <Badge variant="accent" size="md">
            {filteredElements.length} Elements Displayed
          </Badge>
        </div>

        {/* Search & Category Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <Input
              placeholder="Search by name, symbol, or Z (e.g., Fe, 26, Oxygen)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              leftIcon={<Search className="w-4 h-4" />}
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
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
        {filteredElements.map((el) => {
          const colorClass = categoryColorMap[el.category] || 'border-[var(--cq-border)] text-[var(--cq-text)]';
          return (
            <button
              key={el.number}
              type="button"
              onClick={() => setActiveElement(el)}
              className={`p-3 rounded-xl border flex flex-col justify-between items-start transition-all cursor-pointer hover:scale-105 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-[var(--cq-focus)] select-none text-left h-24 ${colorClass}`}
            >
              <div className="flex items-center justify-between w-full text-[10px] font-mono text-[var(--cq-text-muted)]">
                <span>{el.number}</span>
                <span className="text-[9px] uppercase tracking-wider truncate max-w-[48px]">{el.category.split('-')[0]}</span>
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-[var(--cq-text)] block leading-none">
                  {el.symbol}
                </span>
                <span className="text-[11px] font-medium truncate block max-w-full text-[var(--cq-text-muted)] mt-1">
                  {el.name}
                </span>
              </div>
              <span className="text-[9px] font-mono text-[var(--cq-text-muted)] block">
                {typeof el.mass === 'number' ? el.mass.toFixed(2) : el.mass}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty Filter State */}
      {filteredElements.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-[var(--cq-border)] bg-[var(--cq-surface)] space-y-3">
          <Atom className="w-10 h-10 text-[var(--cq-text-muted)] mx-auto opacity-40 animate-spin" />
          <h3 className="font-semibold text-base text-[var(--cq-text)]">No Elements Match Filter</h3>
          <p className="text-xs text-[var(--cq-text-muted)]">
            Try adjusting your search terms or select "All Elements" to reset.
          </p>
          <Button size="sm" variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
            Reset Filters
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
            <div className="p-3.5 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] leading-relaxed text-[var(--cq-text)]">
              {activeElement.summary}
            </div>

            {/* Scientific Properties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)]">
                <span className="text-[var(--cq-text-muted)] block text-[10px]">Atomic Mass</span>
                <span className="font-mono font-bold text-sm text-[var(--cq-text)]">{activeElement.mass} u</span>
              </div>
              <div className="p-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)]">
                <span className="text-[var(--cq-text-muted)] block text-[10px]">Electronegativity (Pauling)</span>
                <span className="font-mono font-bold text-sm text-[var(--cq-accent)]">
                  {activeElement.electronegativity ?? 'N/A'}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)]">
                <span className="text-[var(--cq-text-muted)] block text-[10px]">Atomic Radius</span>
                <span className="font-mono font-bold text-sm text-[var(--cq-text)]">
                  {activeElement.atomic_radius ? `${activeElement.atomic_radius} pm` : 'N/A'}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)]">
                <span className="text-[var(--cq-text-muted)] block text-[10px]">1st Ionization Energy</span>
                <span className="font-mono font-bold text-sm text-[var(--cq-text)]">
                  {activeElement.ionization_energy ? `${activeElement.ionization_energy} kJ/mol` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Electron Configuration & Oxidation States */}
            <div className="p-4 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--cq-border)]/60">
                <span className="font-semibold text-xs text-[var(--cq-text)]">Electron Configuration:</span>
                <span className="font-mono font-bold text-sm text-[var(--cq-accent)] bg-black/30 px-2.5 py-0.5 rounded border border-[var(--cq-border)]">
                  {activeElement.electron_configuration}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-semibold text-xs text-[var(--cq-text)]">Common Oxidation States:</span>
                <span className="font-mono text-xs text-[var(--cq-text)]">
                  {activeElement.oxidation_states || '0'}
                </span>
              </div>
            </div>

            {/* Quantum Subshell Electron Diagram */}
            {activeElement.subshells && activeElement.subshells.length > 0 && (
              <div className="space-y-2">
                <span className="font-semibold text-xs text-[var(--cq-text)] block">
                  Quantum Subshell Filling Diagram (Hund’s Rule & Pauli Exclusion Principle):
                </span>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-bg)]">
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
                      <div key={idx} className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface)]">
                        <span className="text-[10px] font-mono text-[var(--cq-text-muted)] font-semibold">{sub.subshell}</span>
                        <div className="flex items-center gap-1">
                          {boxSpins.map((spin, bIdx) => (
                            <span 
                              key={bIdx}
                              className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs border ${
                                spin === '↑↓'
                                  ? 'border-[var(--cq-accent)]/60 text-[var(--cq-accent)] bg-[var(--cq-accent-subtle)]'
                                  : spin === '↑'
                                  ? 'border-[var(--cq-warning)]/60 text-[var(--cq-warning)] bg-[var(--cq-warning-subtle)]'
                                  : 'border-[var(--cq-border)] text-[var(--cq-text-muted)] bg-[var(--cq-surface-raised)]'
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
                Close Inspector
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
