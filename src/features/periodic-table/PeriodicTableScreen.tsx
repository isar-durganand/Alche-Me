import React, { useState } from 'react';
import { 
  Atom, 
  Search, 
  Flame, 
  Thermometer, 
  Sparkles, 
  Badge as BadgeIcon,
} from 'lucide-react';
import { getAll118Elements } from '../../data/periodicTableData';
import { PeriodicElement } from '../../types/chemistry';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
import { BohrAtomVisualizer } from './BohrAtomVisualizer';
import { FlameTestViewer } from './FlameTestViewer';
import { OrbitalBoxesViewer } from './OrbitalBoxesViewer';
import { Button, Input, Modal, Badge, MarkdownRenderer } from '../../components/ui';

type HeatmapMode = 'category' | 'electronegativity' | 'ionization_energy' | 'state_of_matter';

export const PeriodicTableScreen: React.FC = () => {
  const [elements] = useState<PeriodicElement[]>(getAll118Elements());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('category');
  const [temperatureK, setTemperatureK] = useState(298); // 298 K = 25°C room temp
  const [hoveredElement, setHoveredElement] = useState<PeriodicElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active element preview (defaults to Hydrogen or currently hovered/selected)
  const activePreviewElement = hoveredElement || selectedElement || elements[0];

  const categories = [
    { id: 'all', label: 'All', count: 118 },
    { id: 'alkali', label: 'Alkali' },
    { id: 'alkaline', label: 'Alkaline' },
    { id: 'transition', label: 'Transition' },
    { id: 'post-transition', label: 'Post-Trans' },
    { id: 'metalloid', label: 'Metalloid' },
    { id: 'nonmetal', label: 'Nonmetal' },
    { id: 'halogen', label: 'Halogen' },
    { id: 'noble', label: 'Noble Gas' },
    { id: 'lanthanide', label: 'Lanthanide' },
    { id: 'actinide', label: 'Actinide' },
  ];

  // Category palette (Crisp, jewel-toned game styling)
  const categoryStyles: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    alkali: { bg: 'bg-rose-50 hover:bg-rose-100', border: 'border-rose-300', text: 'text-rose-950', glow: 'shadow-rose-500/20' },
    alkaline: { bg: 'bg-amber-50 hover:bg-amber-100', border: 'border-amber-300', text: 'text-amber-950', glow: 'shadow-amber-500/20' },
    transition: { bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-300', text: 'text-blue-950', glow: 'shadow-blue-500/20' },
    'post-transition': { bg: 'bg-sky-50 hover:bg-sky-100', border: 'border-sky-300', text: 'text-sky-950', glow: 'shadow-sky-500/20' },
    metalloid: { bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-950', glow: 'shadow-emerald-500/20' },
    nonmetal: { bg: 'bg-teal-50 hover:bg-teal-100', border: 'border-teal-300', text: 'text-teal-950', glow: 'shadow-teal-500/20' },
    halogen: { bg: 'bg-indigo-50 hover:bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-950', glow: 'shadow-indigo-500/20' },
    noble: { bg: 'bg-purple-50 hover:bg-purple-100', border: 'border-purple-300', text: 'text-purple-950', glow: 'shadow-purple-500/20' },
    lanthanide: { bg: 'bg-pink-50 hover:bg-pink-100', border: 'border-pink-300', text: 'text-pink-950', glow: 'shadow-pink-500/20' },
    actinide: { bg: 'bg-orange-50 hover:bg-orange-100', border: 'border-orange-300', text: 'text-orange-950', glow: 'shadow-orange-500/20' },
  };

  // State of matter evaluation at current temperature K
  const getStateOfMatter = (el: PeriodicElement, temp: number): 'solid' | 'liquid' | 'gas' | 'unknown' => {
    const mp = el.melting_point ?? 300;
    const bp = el.boiling_point ?? 500;
    if (el.number >= 109) return 'unknown'; // Superheavy elements with unknown macro-states
    if (temp < mp) return 'solid';
    if (temp >= mp && temp < bp) return 'liquid';
    return 'gas';
  };

  // Cell style generator based on active heatmap mode
  const getElementStyle = (el: PeriodicElement) => {
    const isMatched =
      (selectedCategory === 'all' || el.category === selectedCategory) &&
      (!searchQuery ||
        el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.number.toString() === searchQuery.trim());

    if (!isMatched) {
      return 'opacity-20 border-slate-200 bg-slate-50 text-slate-400 scale-[0.96]';
    }

    if (heatmapMode === 'category') {
      const c = categoryStyles[el.category] || categoryStyles.transition;
      return `${c.bg} ${c.border} ${c.text} ${c.glow}`;
    }

    if (heatmapMode === 'electronegativity') {
      if (el.electronegativity === null) return 'border-slate-200 bg-slate-100 text-slate-400';
      const en = el.electronegativity;
      if (en >= 3.0) return 'border-red-400 bg-red-100 text-red-950 font-bold';
      if (en >= 2.5) return 'border-amber-400 bg-amber-100 text-amber-950 font-bold';
      if (en >= 2.0) return 'border-yellow-400 bg-yellow-100 text-yellow-950';
      if (en >= 1.5) return 'border-teal-400 bg-teal-100 text-teal-950';
      return 'border-blue-400 bg-blue-100 text-blue-950';
    }

    if (heatmapMode === 'ionization_energy') {
      const ie = el.ionization_energy || 500;
      if (ie > 1500) return 'border-purple-400 bg-purple-200 text-purple-950 font-bold';
      if (ie > 1100) return 'border-violet-300 bg-violet-100 text-violet-950';
      if (ie > 800) return 'border-blue-300 bg-blue-100 text-blue-950';
      if (ie > 600) return 'border-slate-300 bg-slate-100 text-slate-800';
      return 'border-slate-200 bg-slate-50 text-slate-600';
    }

    if (heatmapMode === 'state_of_matter') {
      const state = getStateOfMatter(el, temperatureK);
      if (state === 'gas') return 'border-amber-300 bg-amber-100/90 text-amber-950 font-bold';
      if (state === 'liquid') return 'border-sky-400 bg-sky-200 text-sky-950 font-bold';
      if (state === 'solid') return 'border-teal-300 bg-teal-50 text-teal-950';
      return 'border-slate-300 bg-slate-100 text-slate-600';
    }

    return 'border-slate-200 bg-white text-[#0B1F2A]';
  };

  // Build standard 18-column x 7-period Mendeleev coordinate matrix
  const mainGrid: (PeriodicElement | null)[][] = Array.from({ length: 7 }, () =>
    Array(18).fill(null)
  );

  const lanthanides: PeriodicElement[] = [];
  const actinides: PeriodicElement[] = [];

  elements.forEach((el) => {
    if (el.number >= 57 && el.number <= 71) {
      lanthanides.push(el);
    } else if (el.number >= 89 && el.number <= 103) {
      actinides.push(el);
    } else {
      const r = el.period - 1;
      const c = el.group - 1;
      if (r >= 0 && r < 7 && c >= 0 && c < 18) {
        mainGrid[r][c] = el;
      }
    }
  });

  const handleElementHover = (el: PeriodicElement) => {
    setHoveredElement(el);
    soundEngine.playElementPip(el.number);
  };

  const handleElementClick = (el: PeriodicElement) => {
    setSelectedElement(el);
    soundEngine.playSelect();
    setIsModalOpen(true);
  };

  const handleTemperatureChange = (val: number) => {
    setTemperatureK(val);
    soundEngine.playTempTick(val);
  };

  return (
    <div className="w-full flex flex-col space-y-3 select-none animate-in fade-in duration-300">
      {/* Top Control Bar & Mode Toggles */}
      <div className="bg-white px-4 py-3 rounded-2xl border-2 border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Title & Stats */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00C2D1] to-[#008E9B] text-white flex items-center justify-center font-montserrat font-extrabold text-sm shadow-sm">
            <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-montserrat font-extrabold text-[#0B1F2A] leading-tight flex items-center gap-2">
              Mendeleev Periodic Explorer
              <Badge variant="accent" size="sm">118 Elements</Badge>
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Proper 18-column IUPAC format • Live Bohr quantum atoms • Zero-scroll responsive fit
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-56">
          <Input
            placeholder="Search symbol, Z, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
            className="text-xs h-9"
          />
        </div>

        {/* Heatmap Trends Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <span className="text-[11px] font-montserrat font-bold text-slate-600 px-2">Mode:</span>
          {(
            [
              { id: 'category', label: 'Categories' },
              { id: 'electronegativity', label: 'Electronegativity' },
              { id: 'ionization_energy', label: 'Ionization' },
              { id: 'state_of_matter', label: 'State (Temp)' },
            ] as { id: HeatmapMode; label: string }[]
          ).map((mode) => (
            <button
              key={mode.id}
              onClick={() => setHeatmapMode(mode.id)}
              className={`px-2.5 py-1 text-xs font-montserrat font-bold rounded-lg transition-all cursor-pointer ${
                heatmapMode === mode.id
                  ? 'bg-white text-[#00C2D1] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-[#0B1F2A]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Temperature Slider Bar (When State of Matter Mode is Active) */}
      {heatmapMode === 'state_of_matter' && (
        <div className="bg-gradient-to-r from-cyan-50 via-amber-50 to-rose-50 px-4 py-2.5 rounded-2xl border-2 border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-cyan-600" />
            <span className="font-montserrat font-bold text-xs text-[#0B1F2A]">
              Temperature: <strong className="text-cyan-700">{temperatureK} K</strong> ({temperatureK - 273}°C)
            </span>
          </div>

          <div className="flex-1 max-w-md mx-3 flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500">0 K</span>
            <input
              type="range"
              min="0"
              max="6000"
              step="10"
              value={temperatureK}
              onChange={(e) => handleTemperatureChange(Number(e.target.value))}
              className="w-full accent-[#00C2D1] cursor-pointer"
            />
            <span className="text-[10px] font-mono text-slate-500">6000 K</span>
          </div>

          {/* Quick Temperature Presets */}
          <div className="flex items-center gap-1.5 text-[10px] font-montserrat font-bold">
            <button
              onClick={() => handleTemperatureChange(0)}
              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              0 K (Abs Zero)
            </button>
            <button
              onClick={() => handleTemperatureChange(298)}
              className="px-2 py-0.5 rounded-md bg-white border border-cyan-300 text-cyan-700 hover:bg-cyan-50 cursor-pointer"
            >
              298 K (25°C RT)
            </button>
            <button
              onClick={() => handleTemperatureChange(373)}
              className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 cursor-pointer"
            >
              373 K (100°C H₂O)
            </button>
            <button
              onClick={() => handleTemperatureChange(1811)}
              className="px-2 py-0.5 rounded-md bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 cursor-pointer"
            >
              1811 K (Fe Melts)
            </button>
          </div>
        </div>
      )}

      {/* Main Container: Periodic Table Grid with Zero-Scroll Dynamic Fit */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border-2 border-slate-200/90 shadow-sm flex flex-col relative overflow-hidden">
        {/* Periodic Table Group Number Headers (1..18) */}
        <div className="grid grid-cols-18 gap-1 mb-1 text-center text-[10px] font-mono font-bold text-slate-400">
          {Array.from({ length: 18 }, (_, idx) => (
            <div key={`grp-${idx + 1}`} className="truncate">
              {idx + 1}
            </div>
          ))}
        </div>

        {/* 18-Column Main Table Grid (Periods 1 to 7) */}
        <div className="grid grid-cols-18 gap-1 w-full">
          {mainGrid.map((row, rIdx) => {
            return row.map((el, cIdx) => {
              // Interactive HUD Terminal in the Central Empty Gaps of Periods 1-3 (Col 3 to 12)
              if (rIdx === 0 && cIdx === 2) {
                return (
                  <div
                    key="quick-hud-terminal"
                    className="col-span-10 row-span-3 border-2 border-slate-100 bg-gradient-to-br from-slate-50/90 via-white to-slate-50/50 rounded-2xl p-3 flex items-center justify-between shadow-inner my-0.5 select-none"
                  >
                    {/* Left: Element Holographic Stats */}
                    <div className="space-y-1.5 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-montserrat font-extrabold uppercase tracking-wider text-[#00C2D1]">
                          Interactive Element Terminal
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                          Z={activePreviewElement.number}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-montserrat font-extrabold text-[#0B1F2A] leading-none">
                          {activePreviewElement.symbol}
                        </span>
                        <span className="text-sm sm:text-base font-montserrat font-bold text-slate-700">
                          {activePreviewElement.name}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {activePreviewElement.mass} u
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#008E9B] font-bold capitalize">
                          {activePreviewElement.category.replace('-', ' ')}
                        </span>
                        <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                          {activePreviewElement.electron_configuration}
                        </span>
                        {heatmapMode === 'state_of_matter' && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 font-bold flex items-center gap-1">
                            State: {getStateOfMatter(activePreviewElement, temperatureK).toUpperCase()}
                          </span>
                        )}
                        {activePreviewElement.flame_color && (
                          <span
                            className="px-2 py-0.5 rounded-full text-white font-bold text-[10px] flex items-center gap-1 shadow-xs"
                            style={{ backgroundColor: activePreviewElement.flame_color }}
                          >
                            <Flame className="w-3 h-3 fill-current" /> {activePreviewElement.flame_name}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {activePreviewElement.summary}
                      </p>

                      <div className="pt-1">
                        <Button
                          size="sm"
                          variant="primary"
                          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                          onClick={() => {
                            setSelectedElement(activePreviewElement);
                            setIsModalOpen(true);
                            soundEngine.playSelect();
                          }}
                          className="bg-[#00C2D1] hover:bg-[#008E9B] text-white text-xs h-7 px-3 font-montserrat font-bold cursor-pointer"
                        >
                          Deep Inspection & Flame Test
                        </Button>
                      </div>
                    </div>

                    {/* Right: Live Revolving Bohr Atom Visualizer */}
                    <div className="hidden sm:flex flex-col items-center justify-center shrink-0 pl-2 border-l border-slate-200">
                      <BohrAtomVisualizer element={activePreviewElement} size="sm" showDetails={false} />
                      <span className="text-[9px] font-mono text-slate-400 mt-1">Live Bohr Orbits</span>
                    </div>
                  </div>
                );
              }

              // Skip rendering cells covered by the col-span-10 row-span-3 terminal
              if (rIdx < 3 && cIdx >= 2 && cIdx <= 11) {
                return null;
              }

              // Empty gap cell in Period 1
              if (!el) {
                // Lanthanide connector in Period 6, Col 3
                if (rIdx === 5 && cIdx === 2) {
                  return (
                    <div
                      key={`lanth-holder-${rIdx}-${cIdx}`}
                      className="h-10 sm:h-12 border-2 border-dashed border-pink-300 bg-pink-50/70 rounded-xl flex flex-col items-center justify-center text-[9px] sm:text-[10px] font-mono font-bold text-pink-700 cursor-pointer hover:bg-pink-100 transition-colors"
                      title="Lanthanide Series (57-71)"
                    >
                      <span>57-71</span>
                      <span className="text-[8px]">La-Lu</span>
                    </div>
                  );
                }

                // Actinide connector in Period 7, Col 3
                if (rIdx === 6 && cIdx === 2) {
                  return (
                    <div
                      key={`act-holder-${rIdx}-${cIdx}`}
                      className="h-10 sm:h-12 border-2 border-dashed border-orange-300 bg-orange-50/70 rounded-xl flex flex-col items-center justify-center text-[9px] sm:text-[10px] font-mono font-bold text-orange-700 cursor-pointer hover:bg-orange-100 transition-colors"
                      title="Actinide Series (89-103)"
                    >
                      <span>89-103</span>
                      <span className="text-[8px]">Ac-Lr</span>
                    </div>
                  );
                }

                return <div key={`empty-${rIdx}-${cIdx}`} className="h-10 sm:h-12" />;
              }

              // Regular Element Tile
              const styleClass = getElementStyle(el);
              const isHovered = hoveredElement?.number === el.number;
              const isSelected = selectedElement?.number === el.number;

              return (
                <button
                  key={`el-${el.number}`}
                  type="button"
                  onMouseEnter={() => handleElementHover(el)}
                  onClick={() => handleElementClick(el)}
                  className={`h-10 sm:h-12 rounded-xl border-2 p-1 flex flex-col justify-between items-center text-center transition-all duration-150 cursor-pointer relative group ${
                    isHovered || isSelected ? 'scale-[1.12] z-20 shadow-md ring-2 ring-[#00C2D1]' : 'hover:scale-[1.06] hover:z-10'
                  } ${styleClass}`}
                >
                  {/* Atomic Number */}
                  <div className="w-full flex items-center justify-between text-[8px] sm:text-[9px] font-mono font-bold opacity-70 leading-none">
                    <span>{el.number}</span>
                    {heatmapMode === 'state_of_matter' && (
                      <span className="text-[8px]">
                        {getStateOfMatter(el, temperatureK) === 'gas' ? '💨' : getStateOfMatter(el, temperatureK) === 'liquid' ? '💧' : '🧊'}
                      </span>
                    )}
                  </div>

                  {/* Chemical Symbol */}
                  <span className="text-xs sm:text-sm font-montserrat font-extrabold leading-none tracking-tight">
                    {el.symbol}
                  </span>

                  {/* Mass / Property */}
                  <span className="text-[7px] sm:text-[8px] font-mono opacity-80 truncate max-w-full leading-none">
                    {heatmapMode === 'electronegativity' && el.electronegativity !== null
                      ? el.electronegativity
                      : heatmapMode === 'ionization_energy' && el.ionization_energy !== null
                      ? el.ionization_energy
                      : typeof el.mass === 'number'
                      ? el.mass.toFixed(1)
                      : el.mass}
                  </span>

                  {/* Flame test dot indicator */}
                  {el.flame_color && (
                    <span
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: el.flame_color }}
                      title={`Flame: ${el.flame_name}`}
                    />
                  )}
                </button>
              );
            });
          })}
        </div>

        {/* Visual Separator for f-Block Lanthanides & Actinides */}
        <div className="my-2 border-t border-slate-200/80 relative flex items-center justify-center">
          <span className="bg-white px-3 text-[9px] font-montserrat font-extrabold uppercase tracking-widest text-slate-400">
            f-Block Inner Transition Series (15 Elements)
          </span>
        </div>

        {/* Lanthanides & Actinides (Aligned under Groups 3 to 17) */}
        <div className="space-y-1 w-full pl-[11.1%] pr-[5.55%]">
          {/* Lanthanide Series Row */}
          <div className="grid grid-cols-15 gap-1">
            {lanthanides.map((el) => {
              const styleClass = getElementStyle(el);
              const isHovered = hoveredElement?.number === el.number;
              return (
                <button
                  key={`lanth-${el.number}`}
                  type="button"
                  onMouseEnter={() => handleElementHover(el)}
                  onClick={() => handleElementClick(el)}
                  className={`h-9 sm:h-11 rounded-xl border-2 p-1 flex flex-col justify-between items-center text-center transition-all duration-150 cursor-pointer ${
                    isHovered ? 'scale-[1.12] z-20 shadow-md ring-2 ring-[#00C2D1]' : 'hover:scale-[1.06]'
                  } ${styleClass}`}
                >
                  <div className="w-full text-left text-[8px] font-mono font-bold opacity-70 leading-none">
                    {el.number}
                  </div>
                  <span className="text-xs sm:text-sm font-montserrat font-extrabold leading-none">
                    {el.symbol}
                  </span>
                  <span className="text-[7px] font-mono opacity-80 truncate max-w-full leading-none">
                    {typeof el.mass === 'number' ? el.mass.toFixed(1) : el.mass}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Actinide Series Row */}
          <div className="grid grid-cols-15 gap-1">
            {actinides.map((el) => {
              const styleClass = getElementStyle(el);
              const isHovered = hoveredElement?.number === el.number;
              return (
                <button
                  key={`act-${el.number}`}
                  type="button"
                  onMouseEnter={() => handleElementHover(el)}
                  onClick={() => handleElementClick(el)}
                  className={`h-9 sm:h-11 rounded-xl border-2 p-1 flex flex-col justify-between items-center text-center transition-all duration-150 cursor-pointer ${
                    isHovered ? 'scale-[1.12] z-20 shadow-md ring-2 ring-[#00C2D1]' : 'hover:scale-[1.06]'
                  } ${styleClass}`}
                >
                  <div className="w-full text-left text-[8px] font-mono font-bold opacity-70 leading-none">
                    {el.number}
                  </div>
                  <span className="text-xs sm:text-sm font-montserrat font-extrabold leading-none">
                    {el.symbol}
                  </span>
                  <span className="text-[7px] font-mono opacity-80 truncate max-w-full leading-none">
                    {typeof el.mass === 'number' ? el.mass.toFixed(1) : el.mass}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Legend Bar at bottom */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
          {categories.filter(c => c.id !== 'all').map((cat) => {
            const style = categoryStyles[cat.id];
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 font-montserrat font-bold transition-all cursor-pointer ${
                  isActive ? 'ring-2 ring-[#00C2D1] scale-105' : 'opacity-85 hover:opacity-100'
                } ${style.bg} ${style.border} ${style.text}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Element Detail Inspection Modal */}
      {selectedElement && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${selectedElement.name} (${selectedElement.symbol}) — Z=${selectedElement.number}`}
          description={`Period ${selectedElement.period}, Group ${selectedElement.group} • ${selectedElement.category.replace('-', ' ').toUpperCase()}`}
          size="xl"
        >
          <div className="space-y-6 text-sm sm:text-base select-none">
            {/* Top Graphics Row: Physically Accurate 3D Bohr Atom + Flame Test apparatus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Animated Bohr Quantum Model */}
              <div className="p-5 rounded-3xl border-2 border-slate-100 bg-slate-50 flex flex-col items-center justify-center shadow-xs">
                <span className="text-xs font-montserrat font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Physically Quantized Quantum Atom (r ∝ n²)
                </span>
                <BohrAtomVisualizer element={selectedElement} size="md" showDetails={true} />
              </div>

              {/* Interactive Flame Test Burner */}
              <FlameTestViewer element={selectedElement} />
            </div>

            {/* Scientific Properties Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl border-2 border-slate-100 bg-white shadow-xs">
                <span className="text-slate-400 block text-xs font-medium">Standard Mass</span>
                <span className="font-montserrat font-extrabold text-base text-[#0B1F2A]">
                  {selectedElement.mass} u
                </span>
              </div>
              <div className="p-4 rounded-2xl border-2 border-teal-100 bg-teal-50/60 shadow-xs">
                <span className="text-teal-700 block text-xs font-medium">Electronegativity</span>
                <span className="font-montserrat font-extrabold text-base text-[#00C2D1]">
                  {selectedElement.electronegativity ?? 'Inert / N/A'}
                </span>
              </div>
              <div className="p-4 rounded-2xl border-2 border-slate-100 bg-white shadow-xs">
                <span className="text-slate-400 block text-xs font-medium">Melting Point</span>
                <span className="font-montserrat font-extrabold text-base text-[#0B1F2A]">
                  {selectedElement.melting_point ? `${selectedElement.melting_point} K` : 'N/A'}
                </span>
              </div>
              <div className="p-4 rounded-2xl border-2 border-slate-100 bg-white shadow-xs">
                <span className="text-slate-400 block text-xs font-medium">1st Ionization Energy</span>
                <span className="font-montserrat font-extrabold text-base text-[#0B1F2A]">
                  {selectedElement.ionization_energy ? `${selectedElement.ionization_energy} kJ/mol` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Subshell Hund's Rule Box Filling Diagram */}
            <div className="p-5 rounded-3xl border-2 border-slate-100 bg-white shadow-xs">
              <OrbitalBoxesViewer element={selectedElement} />
            </div>

            {/* Summary Lore & Pedagogical Relevance with Markdown */}
            <div className="p-5 rounded-3xl border-2 border-slate-100 bg-slate-50 text-slate-700 space-y-2">
              <span className="text-xs font-montserrat font-extrabold uppercase tracking-wider text-[#0B1F2A] block">
                Chemical Profile & Applications
              </span>
              <MarkdownRenderer
                content={selectedElement.summary}
                className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsModalOpen(false)}
                className="bg-[#00C2D1] hover:bg-[#008E9B] text-white font-montserrat font-bold cursor-pointer"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
