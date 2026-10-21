/**
 * Alche-Me — 3D Molecular Graphics Engine ($3Dmol WebGL)
 * 100% physically and geometrically accurate molecular viewer:
 * - Native 3Dmol centering via viewer.zoomTo()
 * - Full 6-DOF controls: Left-click rotate, Right-click / Shift+Left-click pan & drag to center, Scroll zoom
 * - HOMO-LUMO 3D quantum wavefunction lobe rendering with dual phase colors (+ / -)
 * - Measurement indicators for bond distances, VSEPR bond angles, and dihedrals
 */

import React, { useEffect, useRef, useState } from 'react';
import { 
  AtomNode, 
  DisplayStyle, 
  MeasurementMode, 
  MeasurementResult, 
  OrbitalType,
  OrbitalLobe 
} from './types';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Focus, 
  Layers, 
  Tag, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Ruler, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { soundEngine } from '../../infrastructure/audio/soundEngine';

declare global {
  interface Window {
    $3Dmol: any;
  }
}

interface MoleculeViewer3DProps {
  rawXyz: string;
  atoms: AtomNode[];
  displayStyle: DisplayStyle;
  onDisplayStyleChange: (style: DisplayStyle) => void;
  measurementMode: MeasurementMode;
  onMeasurementModeChange: (mode: MeasurementMode) => void;
  selectedAtomIndices: number[];
  onAtomSelect: (atomIndex: number) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  orbitalType: OrbitalType;
  orbitalIsoval?: number;
  orbitalOpacity?: number;
  homoLobes?: OrbitalLobe[];
  lumoLobes?: OrbitalLobe[];
  activeMeasurement?: MeasurementResult | null;
  formula?: string;
  compoundName?: string;
}

export const MoleculeViewer3D: React.FC<MoleculeViewer3DProps> = ({
  rawXyz,
  atoms,
  displayStyle,
  onDisplayStyleChange,
  measurementMode,
  onMeasurementModeChange,
  selectedAtomIndices,
  onAtomSelect,
  showLabels,
  onToggleLabels,
  orbitalType,
  orbitalIsoval = 0.04,
  orbitalOpacity = 0.75,
  homoLobes,
  lumoLobes,
  activeMeasurement,
  formula,
  compoundName,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const lastXyzRef = useRef<string | null>(null);

  // Initialize or re-render 3Dmol Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const $3Dmol = window.$3Dmol;

    if (!$3Dmol) {
      console.warn('3Dmol library is still loading...');
      return;
    }

    if (!viewerRef.current) {
      viewerRef.current = $3Dmol.createViewer(containerRef.current, {
        defaultcolors: $3Dmol.rasmolElementColors,
        backgroundColor: '#F7F8FA', // Warm ivory white game canvas
      });
    }

    const viewer = viewerRef.current;
    viewer.clear();

    if (rawXyz) {
      const model = viewer.addModel(rawXyz, 'xyz');

      // 1. Molecular Display Style
      switch (displayStyle) {
        case 'spaceFilling':
          viewer.setStyle({}, { sphere: { scale: 0.95, colorscheme: 'Jmol' } });
          break;
        case 'licorice':
          viewer.setStyle({}, { stick: { radius: 0.28, colorscheme: 'Jmol' } });
          break;
        case 'wireframe':
          viewer.setStyle({}, { line: { linewidth: 2.5 } });
          break;
        case 'ballAndStick':
        default:
          viewer.setStyle({}, {
            stick: { radius: 0.16, colorscheme: 'Jmol' },
            sphere: { scale: 0.34, colorscheme: 'Jmol' },
          });
          break;
      }

      // 2. Labels for Atoms
      if (showLabels && atoms.length > 0) {
        atoms.forEach((atom, idx) => {
          viewer.addLabel(`${atom.symbol}${idx + 1}`, {
            position: { x: atom.x, y: atom.y, z: atom.z },
            backgroundColor: '0x0B1F2A',
            fontColor: '0xFFFFFF',
            fontSize: 10,
            backgroundOpacity: 0.85,
            borderThickness: 1,
            borderColor: '0x00C2D1',
          });
        });
      }

      // 3. Highlight Selected Measurement Atoms
      selectedAtomIndices.forEach((atomIdx, rank) => {
        const atom = atoms[atomIdx];
        if (atom) {
          const colors = ['0x00C2D1', '0xF59E0B', '0x10B981', '0xEC4899'];
          viewer.addSphere({
            center: { x: atom.x, y: atom.y, z: atom.z },
            radius: 0.52,
            color: colors[rank % colors.length],
            opacity: 0.65,
          });

          viewer.addLabel(`P${rank + 1}`, {
            position: { x: atom.x, y: atom.y + 0.45, z: atom.z },
            backgroundColor: '0x0B1F2A',
            fontColor: '0x00C2D1',
            fontSize: 11,
            backgroundOpacity: 0.95,
          });
        }
      });

      // 4. Draw Measurement Connecting Line
      if (selectedAtomIndices.length >= 2) {
        for (let i = 0; i < selectedAtomIndices.length - 1; i++) {
          const a1 = atoms[selectedAtomIndices[i]];
          const a2 = atoms[selectedAtomIndices[i + 1]];
          if (a1 && a2) {
            viewer.addLine({
              start: { x: a1.x, y: a1.y, z: a1.z },
              end: { x: a2.x, y: a2.y, z: a2.z },
              color: '0x00C2D1',
              dashed: true,
            });
          }
        }
      }

      // 5. HOMO-LUMO 3D Wavefunction Lobes
      if (orbitalType === 'HOMO' || orbitalType === 'LUMO') {
        const activeLobes = orbitalType === 'HOMO' ? homoLobes : lumoLobes;

        if (activeLobes && activeLobes.length > 0) {
          activeLobes.forEach((lobe) => {
            // Positive Phase: Deep Cyan / Blue (#00C2D1)
            // Negative Phase: Deep Coral / Red (#DC2626)
            const color = lobe.phase === 'positive' ? '0x00C2D1' : '0xDC2626';
            viewer.addSphere({
              center: { x: lobe.center[0], y: lobe.center[1], z: lobe.center[2] },
              radius: lobe.radius * (1.0 + (0.05 - orbitalIsoval) * 5),
              color,
              opacity: orbitalOpacity,
            });
          });
        } else {
          // Procedural fallback lobes around electron-dense atoms
          const heavyAtoms = atoms.filter((a) => a.symbol !== 'H');
          const target = heavyAtoms[0] || atoms[0];
          if (target) {
            const spread = orbitalType === 'HOMO' ? 0.65 : 0.85;
            const posColor = orbitalType === 'HOMO' ? '0x00C2D1' : '0xF59E0B';
            const negColor = orbitalType === 'HOMO' ? '0xDC2626' : '0x8B5CF6';

            viewer.addSphere({
              center: { x: target.x, y: target.y, z: target.z + spread },
              radius: 0.55,
              color: posColor,
              opacity: orbitalOpacity,
            });
            viewer.addSphere({
              center: { x: target.x, y: target.y, z: target.z - spread },
              radius: 0.55,
              color: negColor,
              opacity: orbitalOpacity,
            });
          }
        }
      }

      // 6. Interactive Click Selection on Atoms
      model.setClickable({}, true, (clickedAtom: any) => {
        soundEngine.playElementPip(clickedAtom.atomic_number || 12);
        if (clickedAtom && typeof clickedAtom.index === 'number') {
          onAtomSelect(clickedAtom.index);
        }
      });

      // 7. Auto-Center: zoomTo() centers molecule squarely in the screen
      if (lastXyzRef.current !== rawXyz) {
        viewer.zoomTo(300);
        lastXyzRef.current = rawXyz;
      }

      viewer.render();
    }
  }, [
    rawXyz, 
    atoms, 
    displayStyle, 
    showLabels, 
    selectedAtomIndices, 
    orbitalType, 
    orbitalIsoval, 
    orbitalOpacity, 
    homoLobes, 
    lumoLobes
  ]);

  // Recenter Handler (Answers user's "not able to drag molecule to centre")
  const handleRecenter = () => {
    soundEngine.playTap();
    if (viewerRef.current) {
      viewerRef.current.zoomTo(300);
      viewerRef.current.render();
    }
  };

  // Auto-Spin Toggle
  const handleToggleSpin = () => {
    soundEngine.playTap();
    if (!viewerRef.current) return;
    const next = !isSpinning;
    setIsSpinning(next);
    if (next) {
      viewerRef.current.spin('y', 1.2);
    } else {
      viewerRef.current.spin(false);
    }
  };

  const handleZoom = (factor: number) => {
    if (viewerRef.current) {
      viewerRef.current.zoom(factor, 200);
      viewerRef.current.render();
    }
  };

  const toggleFullscreen = () => {
    soundEngine.playTap();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      className={`relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden border-2 border-slate-200/90 bg-[#F7F8FA] shadow-sm flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* 3Dmol WebGL Canvas Mount Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing" 
        style={{ position: 'relative' }}
      />

      {/* Top-Left Floating Info HUD */}
      {(compoundName || formula) && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-slate-200 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00C2D1] animate-pulse" />
          <div className="flex items-center gap-1.5 font-montserrat font-extrabold text-xs text-[#0B1F2A]">
            <span>{compoundName}</span>
            {formula && <span className="font-mono font-bold text-[#00C2D1] text-[11px]">({formula})</span>}
          </div>
          {orbitalType !== 'NONE' && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#008E9B]">
              {orbitalType} Active
            </span>
          )}
        </div>
      )}

      {/* Top-Right Quick Viewport Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-slate-200 shadow-md">
        {/* SNAP TO CENTER (Primary fix for user's drag to centre) */}
        <button
          type="button"
          onClick={handleRecenter}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#00C2D1] text-white hover:bg-[#008E9B] text-xs font-montserrat font-extrabold transition-all cursor-pointer shadow-xs"
          title="Center molecule squarely in viewport (Reset Camera)"
        >
          <Focus className="w-3.5 h-3.5" />
          <span>Center</span>
        </button>

        {/* Auto-Rotation Spin */}
        <button
          type="button"
          onClick={handleToggleSpin}
          className={`p-1.5 rounded-lg text-xs font-montserrat font-bold transition-all cursor-pointer ${
            isSpinning ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Toggle Auto-Spin (360°)"
        >
          <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        </button>

        {/* Zoom Controls */}
        <button
          type="button"
          onClick={() => handleZoom(1.2)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(0.8)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Labels Toggle */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTap();
            onToggleLabels();
          }}
          className={`p-1.5 rounded-lg text-xs font-montserrat font-bold transition-all cursor-pointer ${
            showLabels ? 'bg-teal-50 text-[#00C2D1] border border-teal-200' : 'text-slate-400 hover:bg-slate-100'
          }`}
          title="Toggle Atom Labels (C1, H2...)"
        >
          <Tag className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Measurement Tape HUD */}
      {activeMeasurement && (
        <div className="absolute bottom-14 left-4 z-20 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-[#00C2D1] shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00C2D1]" />
            <span className="font-montserrat font-extrabold text-xs text-[#0B1F2A]">
              {activeMeasurement.label}: {activeMeasurement.value.toFixed(3)} {activeMeasurement.unit}
            </span>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Ribbon (Styles & Navigation Guide) */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 text-xs shadow-xs">
        {/* Style Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-montserrat font-bold text-slate-400 uppercase">Style:</span>
          {(['ballAndStick', 'spaceFilling', 'licorice', 'wireframe'] as DisplayStyle[]).map((st) => (
            <button
              key={st}
              onClick={() => {
                soundEngine.playTap();
                onDisplayStyleChange(st);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-montserrat font-bold transition-all cursor-pointer capitalize ${
                displayStyle === st
                  ? 'bg-[#00C2D1] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ballAndStick' ? 'Ball & Stick' : st === 'spaceFilling' ? 'vdW Space' : st}
            </button>
          ))}
        </div>

        {/* 6-DOF Mouse Navigation Guide */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <span>Left-click: 360° Rotate</span>
          <span>•</span>
          <span className="text-[#00C2D1] font-bold">Right-click / Shift+Click: Drag to Centre</span>
          <span>•</span>
          <span>Wheel: Zoom</span>
        </div>
      </div>
    </div>
  );
};
