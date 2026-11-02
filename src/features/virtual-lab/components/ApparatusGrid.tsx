/**
 * Alche-Me — 20 Apparatus Matrix Grid Component
 * Pixel-accurate, interactive reproduction of the Chemistry for Engineers Apparatus Sheet
 */

import React, { useState, useMemo } from 'react';
import { APPARATUS_ITEMS } from '../apparatusData';
import { ApparatusItem, ApparatusCategory } from '../types';
import { 
  Search, 
  ExternalLink, 
  Info, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  X
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';

interface ApparatusGridProps {
  onSelectExperiment?: (expNum: number) => void;
}

export const ApparatusGrid: React.FC<ApparatusGridProps> = ({ onSelectExperiment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ApparatusCategory | 'all'>('all');
  const [inspectItem, setInspectItem] = useState<ApparatusItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Equipment (20)' },
    { id: 'glassware', label: 'Glassware (9)' },
    { id: 'metal', label: 'Metal & Mechanical (3)' },
    { id: 'electronics', label: 'Sensors & Digital (7)' },
  ];

  const filteredItems = useMemo(() => {
    return APPARATUS_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.experiments.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.material.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleTileClick = (item: ApparatusItem) => {
    soundEngine.playTap();
    setInspectItem(item);
  };

  // Render authentic SVG visual matching the lab manual card
  const renderApparatusSvg = (id: string) => {
    switch (id) {
      case 'app-conical-flask':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <path d="M41 82 L99 82 L110 100 Q112 108 102 108 L38 108 Q28 108 30 100 Z" fill="#378ADD" fillOpacity=".5" />
            <path d="M60 18 L60 50 L30 100 Q28 108 38 108 L102 108 Q112 108 110 100 L80 50 L80 18 Z" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M56 18 L84 18" fill="none" stroke="#378ADD" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'app-stopper-flask':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <path d="M41 82 L99 82 L110 100 Q112 108 102 108 L38 108 Q28 108 30 100 Z" fill="#BA7517" fillOpacity=".5" />
            <path d="M60 20 L60 50 L30 100 Q28 108 38 108 L102 108 Q112 108 110 100 L80 50 L80 20 Z" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" />
            <polygon points="57,7 83,7 79,20 61,20" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
          </svg>
        );

      case 'app-beaker':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <path d="M37 62 L103 62 L103 104 Q103 109 98 109 L42 109 Q37 109 37 104 Z" fill="#378ADD" fillOpacity=".5" />
            <path d="M36 20 L36 104 Q36 110 42 110 L98 110 Q104 110 104 104 L104 20 M36 20 L30 16" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M36 44h10M36 62h14M36 80h10M36 98h14" fill="none" stroke="#378ADD" strokeWidth="1" />
          </svg>
        );

      case 'app-measuring-flask':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <path d="M43 82 A27 27 0 0 0 97 82 Z" fill="#378ADD" fillOpacity=".5" />
            <path d="M64 16 L64 56 A27 27 0 1 0 76 56 L76 16 Z" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M62 32 h16" fill="none" stroke="#185FA5" strokeWidth="2" />
            <rect x="62" y="10" width="16" height="6" rx="2" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
          </svg>
        );

      case 'app-measuring-cylinder':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <rect x="53" y="58" width="34" height="42" fill="#378ADD" fillOpacity=".5" />
            <path d="M52 14 L52 100 L44 100 Q40 100 40 104 L40 106 Q40 110 44 110 L96 110 Q100 110 100 106 L100 104 Q100 100 96 100 L88 100 L88 14 M88 14 L93 12" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M52 26h10M52 38h6M52 50h10M52 62h6M52 74h10M52 86h6" fill="none" stroke="#378ADD" strokeWidth="1" />
          </svg>
        );

      case 'app-pipette':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <path d="M60 62 C58 70 62 78 67 80 L67 108 L70 116 L73 108 L73 80 C78 78 82 70 80 62 Z" fill="#378ADD" fillOpacity=".5" />
            <path d="M67 14 L67 46 C56 50 56 76 67 80 L67 108 L70 116 L73 108 L73 80 C84 76 84 50 73 46 L73 14 Z" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M64 24 h12" fill="none" stroke="#185FA5" strokeWidth="2" />
          </svg>
        );

      case 'app-burette-stand':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <rect x="28" y="106" width="84" height="6" rx="2" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="40" y="16" width="5" height="90" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="45" y="46" width="34" height="5" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="79" y="30" width="12" height="62" fill="#378ADD" fillOpacity=".5" />
            <rect x="78" y="14" width="14" height="78" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" />
            <path d="M78 22h7M78 30h5M78 38h7M78 46h5M78 54h7M78 62h5M78 70h7M78 78h5M78 86h7" fill="none" stroke="#378ADD" strokeWidth="1" />
            <rect x="73" y="92" width="24" height="6" rx="2" fill="#888780" stroke="#5F5E5A" strokeWidth="1" />
            <polygon points="80,98 90,98 85,110" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        );

      case 'app-micro-burette':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <rect x="67" y="52" width="6" height="38" fill="#378ADD" fillOpacity=".5" />
            <ellipse cx="70" cy="24" rx="14" ry="11" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" />
            <rect x="66" y="34" width="8" height="56" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" />
            <path d="M66 44h5M66 49h3M66 54h5M66 59h3M66 64h5M66 69h3M66 74h5M66 79h3M66 84h5" fill="none" stroke="#378ADD" strokeWidth="1" />
            <rect x="62" y="90" width="16" height="5" rx="2" fill="#888780" stroke="#5F5E5A" strokeWidth="1" />
            <polygon points="67,95 73,95 70,108" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" />
            <rect x="64" y="8" width="12" height="5" rx="2" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
          </svg>
        );

      case 'app-wash-bottle':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <path d="M41 72 L89 72 L89 100 Q89 109 80 109 L50 109 Q41 109 41 100 Z" fill="#378ADD" fillOpacity=".4" />
            <rect x="40" y="36" width="50" height="74" rx="12" fill="#9FE1CB" fillOpacity=".22" stroke="#0F6E56" strokeWidth="1.5" />
            <rect x="56" y="24" width="18" height="12" rx="2" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <path d="M65 24 L65 14 L95 10" fill="none" stroke="#5F5E5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'app-glass-rod':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <path d="M30 110 L110 30" stroke="#85B7EB" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
            <path d="M30 110 L110 30" stroke="#378ADD" strokeWidth="2" strokeLinecap="round" strokeDasharray="18,12" />
          </svg>
        );

      case 'app-kohlrausch-flask':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <path d="M44 80 L96 80 Q98 108 70 108 Q42 108 44 80 Z" fill="#378ADD" fillOpacity=".5" />
            <path d="M60 18 L60 44 Q35 60 42 108 L98 108 Q105 60 80 44 L80 18 Z" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="56" y1="46" x2="84" y2="46" stroke="#185FA5" strokeWidth="2" />
          </svg>
        );

      case 'app-stopwatch':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <rect x="64" y="22" width="12" height="9" rx="2" strokeWidth="1" fill="#F1EFE8" stroke="#5F5E5A" />
            <rect x="98" y="30" width="9" height="6" rx="2" strokeWidth="1" transform="rotate(40 102 33)" fill="#F1EFE8" stroke="#5F5E5A" />
            <circle cx="70" cy="66" r="34" strokeWidth="1.5" fill="#F1EFE8" stroke="#5F5E5A" />
            <path d="M70 36v6M70 90v6M38 66h6M96 66h6" fill="none" stroke="#52514E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="70" y1="66" x2="70" y2="45" stroke="#0B0B0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="70" y1="66" x2="86" y2="78" stroke="#D85A30" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="70" cy="66" r="3" fill="#0B0B0B" />
          </svg>
        );

      case 'app-tds-meter':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <rect x="62" y="98" width="16" height="12" rx="2" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="56" y="14" width="28" height="84" rx="10" strokeWidth="1" fill="#E1F5EE" stroke="#0F6E56" />
            <rect x="59" y="28" width="22" height="16" rx="2" strokeWidth="0.5" fill="#F1EFE8" stroke="#5F5E5A" />
            <text x="70" y="36" textAnchor="middle" dominantBaseline="central" fill="#5F5E5A" fontSize="10" fontFamily="monospace" fontWeight="bold">345</text>
            <circle cx="70" cy="62" r="5" strokeWidth="1" fill="#F1EFE8" stroke="#5F5E5A" />
          </svg>
        );

      case 'app-conductivity-meter':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <path d="M122 70 Q134 70 134 92" fill="none" stroke="#52514E" strokeWidth="2" strokeLinecap="round" />
            <rect x="26" y="94" width="10" height="4" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="104" y="94" width="10" height="4" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="18" y="30" width="104" height="64" rx="6" strokeWidth="1" fill="#E1F5EE" stroke="#0F6E56" />
            <rect x="28" y="40" width="52" height="26" rx="3" strokeWidth="0.5" fill="#F1EFE8" stroke="#5F5E5A" />
            <text x="54" y="53" textAnchor="middle" dominantBaseline="central" fill="#5F5E5A" fontSize="12" fontFamily="monospace" fontWeight="bold">1.42</text>
            <circle cx="100" cy="50" r="8" strokeWidth="1" fill="#F1EFE8" stroke="#5F5E5A" />
            <circle cx="100" cy="76" r="6" strokeWidth="1" fill="#F1EFE8" stroke="#5F5E5A" />
            <circle cx="36" cy="84" r="3" fill="#E24B4A" />
            <circle cx="50" cy="84" r="3" fill="#5F5E5A" />
          </svg>
        );

      case 'app-conductivity-cell':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <path d="M70 6 L70 22" fill="none" stroke="#52514E" strokeWidth="2" strokeLinecap="round" />
            <rect x="58" y="22" width="24" height="10" rx="3" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="60" y="32" width="20" height="62" rx="3" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" />
            <rect x="63" y="50" width="5" height="36" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="72" y="50" width="5" height="36" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
          </svg>
        );

      case 'app-electrodes':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            {/* Pt Electrode */}
            <rect x="22" y="8" width="12" height="6" rx="2" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="23" y="14" width="10" height="62" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" />
            <line x1="28" y1="14" x2="28" y2="92" stroke="#5F5E5A" strokeWidth="1.5" />
            <rect x="22" y="90" width="12" height="7" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            {/* SCE Electrode */}
            <rect x="64" y="8" width="12" height="6" rx="2" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="65" y="14" width="10" height="74" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" />
            <rect x="67" y="66" width="6" height="20" fill="#888780" fillOpacity=".6" />
            <polygon points="66,88 74,88 70,97" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            {/* Glass Electrode */}
            <rect x="106" y="8" width="12" height="6" rx="2" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="107" y="14" width="10" height="52" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" />
            <circle cx="112" cy="78" r="11" fill="#85B7EB" fillOpacity=".3" stroke="#378ADD" strokeWidth="1.5" />
            <line x1="112" y1="14" x2="112" y2="72" stroke="#5F5E5A" strokeWidth="1.5" />
            <text x="28" y="112" textAnchor="middle" fill="#52514E" fontSize="10">Pt</text>
            <text x="70" y="112" textAnchor="middle" fill="#52514E" fontSize="10">SCE</text>
            <text x="112" y="112" textAnchor="middle" fill="#52514E" fontSize="10">Glass</text>
          </svg>
        );

      case 'app-potentiometer':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <rect x="14" y="32" width="112" height="62" rx="6" strokeWidth="1" fill="#E1F5EE" stroke="#0F6E56" />
            <rect x="24" y="42" width="60" height="24" rx="3" strokeWidth="0.5" fill="#F1EFE8" stroke="#5F5E5A" />
            <text x="54" y="54" textAnchor="middle" dominantBaseline="central" fill="#5F5E5A" fontSize="11" fontFamily="monospace" fontWeight="bold">245 mV</text>
            <circle cx="104" cy="58" r="13" strokeWidth="1" fill="#F1EFE8" stroke="#5F5E5A" />
            <line x1="104" y1="58" x2="110" y2="48" stroke="#0B0B0B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="34" cy="84" r="4" fill="#E24B4A" />
            <circle cx="52" cy="84" r="4" fill="#5F5E5A" />
          </svg>
        );

      case 'app-redwood-viscometer':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <line x1="40" y1="68" x2="34" y2="108" stroke="#5F5E5A" strokeWidth="2" />
            <line x1="100" y1="68" x2="106" y2="108" stroke="#5F5E5A" strokeWidth="2" />
            <path d="M32 24 L108 24 L108 70 L80 88 L60 88 L32 70 Z" fill="#EF9F27" fillOpacity=".25" stroke="#854F0B" strokeWidth="1.5" strokeLinejoin="round" />
            <rect x="44" y="30" width="52" height="38" rx="2" fill="#BA7517" fillOpacity=".35" stroke="#854F0B" strokeWidth="1" />
            <line x1="70" y1="14" x2="70" y2="56" stroke="#5F5E5A" strokeWidth="1.5" />
            <circle cx="70" cy="12" r="3" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="86" y="6" width="5" height="36" rx="2" fill="none" stroke="#5F5E5A" strokeWidth="1" />
            <line x1="88.5" y1="20" x2="88.5" y2="42" stroke="#E24B4A" strokeWidth="2" />
            <rect x="66" y="86" width="8" height="10" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <path d="M66 100 L66 104 L56 114 L84 114 L74 104 L74 100 Z" fill="#85B7EB" fillOpacity=".22" stroke="#378ADD" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        );

      case 'app-computer-arguslab':
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <rect x="22" y="14" width="96" height="68" rx="5" strokeWidth="1" fill="#F1EFE8" stroke="#5F5E5A" />
            <rect x="29" y="21" width="82" height="54" rx="2" strokeWidth="0.5" fill="#E6F1FB" stroke="#185FA5" />
            <line x1="70" y1="46" x2="52" y2="62" stroke="#0B0B0B" strokeWidth="2" />
            <line x1="70" y1="46" x2="88" y2="62" stroke="#0B0B0B" strokeWidth="2" />
            <circle cx="70" cy="46" r="8" fill="#E24B4A" />
            <circle cx="52" cy="62" r="5" fill="#F1EFE8" stroke="#5F5E5A" strokeWidth="1" />
            <circle cx="88" cy="62" r="5" fill="#F1EFE8" stroke="#5F5E5A" strokeWidth="1" />
            <rect x="64" y="82" width="12" height="8" strokeWidth="1" fill="#F1EFE8" stroke="#5F5E5A" />
            <rect x="50" y="90" width="40" height="5" rx="2" strokeWidth="1" fill="#F1EFE8" stroke="#5F5E5A" />
            <rect x="28" y="100" width="84" height="12" rx="3" strokeWidth="1" fill="#F1EFE8" stroke="#5F5E5A" />
          </svg>
        );

      case 'app-key-card':
      default:
        return (
          <svg viewBox="0 0 140 140" className="w-24 h-24">
            <text x="70" y="26" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0B0B0B">Key</text>
            <rect x="24" y="38" width="14" height="14" rx="2" fill="#85B7EB" fillOpacity=".3" stroke="#378ADD" strokeWidth="1.5" />
            <text x="46" y="50" fontSize="11" fill="#52514E">Glassware</text>
            <rect x="24" y="62" width="14" height="14" rx="2" fill="#B4B2A9" stroke="#5F5E5A" strokeWidth="1" />
            <text x="46" y="74" fontSize="11" fill="#52514E">Metal parts</text>
            <rect x="24" y="86" width="14" height="14" rx="2" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="1" />
            <text x="46" y="98" fontSize="11" fill="#52514E">Electronics</text>
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 border border-teal-200 text-[#00C2D1]">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="font-montserrat font-extrabold text-base text-[#0B1F2A]">
              Chemistry Laboratory Apparatus Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            20 Essential glassware, instruments, and digital devices prescribed across University Engineering Practicals.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 text-xs font-montserrat font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#00C2D1] text-white border-[#008E9B] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 20 Apparatus Card Grid (Matching Uploaded SVG 4x5 Layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredItems.map((item) => {
          const isGlassware = item.category === 'glassware';
          const isElectronics = item.category === 'electronics';
          const isMetal = item.category === 'metal';

          return (
            <div
              key={item.id}
              onClick={() => handleTileClick(item)}
              className={`group relative rounded-2xl p-4 bg-[#FCFCFB] border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 flex flex-col items-center justify-between min-h-[200px] select-none ${
                isGlassware
                  ? 'border-sky-200/90 hover:border-sky-400'
                  : isElectronics
                  ? 'border-emerald-200/90 hover:border-emerald-400'
                  : isMetal
                  ? 'border-slate-300 hover:border-slate-400'
                  : 'border-amber-200 hover:border-amber-400'
              }`}
            >
              {/* Category Indicator Tag */}
              <div className="w-full flex items-center justify-between text-[10px] font-mono">
                <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isGlassware
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : isElectronics
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isMetal
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {item.category === 'glassware' ? 'Glassware' : item.category === 'electronics' ? 'Electronics' : item.category === 'metal' ? 'Metal Parts' : 'Guide'}
                </span>
                <span className="text-slate-400 font-bold group-hover:text-teal-600 transition-colors">
                  Inspect →
                </span>
              </div>

              {/* Central Vector Art */}
              <div className="my-2 flex items-center justify-center p-2 rounded-xl bg-white/60 group-hover:scale-105 transition-transform">
                {renderApparatusSvg(item.id)}
              </div>

              {/* Title & Lab Manual Number */}
              <div className="w-full text-center space-y-0.5 pt-1 border-t border-slate-100">
                <div className="font-montserrat font-bold text-xs text-[#0B1F2A] group-hover:text-[#00C2D1] transition-colors leading-snug">
                  {item.name}
                </div>
                <div className="text-[11px] font-mono font-medium text-slate-500">
                  {item.experiments}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Detail Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border-2 border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-200 text-[#00C2D1]">
                  {renderApparatusSvg(inspectItem.id)}
                </div>
                <div>
                  <h3 className="font-montserrat font-extrabold text-base text-[#0B1F2A]">
                    {inspectItem.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {inspectItem.subtitle} • {inspectItem.experiments}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectItem(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {inspectItem.description}
            </p>

            {/* Technical Specifications */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-montserrat font-extrabold text-[#00C2D1] uppercase tracking-wider">
                Technical Specifications
              </span>
              <ul className="grid grid-cols-1 gap-1 text-xs text-slate-600">
                {inspectItem.specifications.map((spec, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-500 font-bold">•</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Laboratory Care & Precautions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-montserrat font-extrabold text-amber-600 uppercase tracking-wider">
                Handling & Safety Instructions
              </span>
              <ul className="space-y-1 text-xs text-slate-600 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80">
                {inspectItem.careAndSafety.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setInspectItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-montserrat font-bold hover:bg-slate-100 cursor-pointer"
              >
                Close Inspector
              </button>

              {onSelectExperiment && inspectItem.expNumbers.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const targetExp = inspectItem.expNumbers[0];
                    setInspectItem(null);
                    onSelectExperiment(targetExp);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#00C2D1] hover:bg-[#00AAB8] text-white text-xs font-montserrat font-extrabold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <span>Launch Experiment {inspectItem.expNumbers[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
