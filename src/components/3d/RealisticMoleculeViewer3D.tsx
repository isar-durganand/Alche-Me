import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, Maximize2, Sparkles, Layers, Eye, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button, Badge } from '../ui';

// CPK Color standard mapping
const CPK_COLORS: Record<string, number> = {
  H: 0xFFFFFF,   // Pure White
  C: 0x334155,   // Dark Charcoal Slate
  N: 0x2563EB,   // Deep Blue
  O: 0xDC2626,   // Vivid Red
  F: 0x22C55E,   // Green
  Cl: 0x16A34A,  // Forest Green
  Br: 0x991B1B,  // Deep Brown-Red
  I: 0x7E22CE,   // Violet
  P: 0xEA580C,   // Orange
  S: 0xEAB308,   // Golden Yellow
  Na: 0x9333EA,  // Purple
  Fe: 0xB45309,  // Rust Metallic
  Cu: 0xD97706,  // Copper Gold
  Zn: 0x64748B,  // Zinc Slate
};

// Covalent Radii in Angstroms
const COVALENT_RADII: Record<string, number> = {
  H: 0.32,
  C: 0.77,
  N: 0.75,
  O: 0.73,
  F: 0.72,
  Cl: 0.99,
  P: 1.06,
  S: 1.02,
  Fe: 1.25,
  Cu: 1.28,
  Zn: 1.31,
};

export interface MoleculePreset {
  id: string;
  name: string;
  formula: string;
  geometry: string;
  bondAngle: string;
  atoms: { symbol: string; x: number; y: number; z: number }[];
  bonds: [number, number, number][]; // [fromIdx, toIdx, bondOrder]
}

export const MOLECULE_PRESETS: MoleculePreset[] = [
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H₂O',
    geometry: 'Bent (V-Shaped)',
    bondAngle: '104.5° (sp³ with 2 lone pairs)',
    atoms: [
      { symbol: 'O', x: 0, y: 0.12, z: 0 },
      { symbol: 'H', x: -0.76, y: -0.48, z: 0 },
      { symbol: 'H', x: 0.76, y: -0.48, z: 0 },
    ],
    bonds: [[0, 1, 1], [0, 2, 1]],
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    geometry: 'Linear',
    bondAngle: '180.0° (sp hybridized)',
    atoms: [
      { symbol: 'C', x: 0, y: 0, z: 0 },
      { symbol: 'O', x: -1.16, y: 0, z: 0 },
      { symbol: 'O', x: 1.16, y: 0, z: 0 },
    ],
    bonds: [[0, 1, 2], [0, 2, 2]],
  },
  {
    id: 'ch4',
    name: 'Methane',
    formula: 'CH₄',
    geometry: 'Regular Tetrahedral',
    bondAngle: '109.5° (sp³ symmetric)',
    atoms: [
      { symbol: 'C', x: 0, y: 0, z: 0 },
      { symbol: 'H', x: 0.63, y: 0.63, z: 0.63 },
      { symbol: 'H', x: -0.63, y: -0.63, z: 0.63 },
      { symbol: 'H', x: -0.63, y: 0.63, z: -0.63 },
      { symbol: 'H', x: 0.63, y: -0.63, z: -0.63 },
    ],
    bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
  },
  {
    id: 'nh3',
    name: 'Ammonia',
    formula: 'NH₃',
    geometry: 'Trigonal Pyramidal',
    bondAngle: '107.3° (sp³ with 1 lone pair)',
    atoms: [
      { symbol: 'N', x: 0, y: 0.15, z: 0 },
      { symbol: 'H', x: 0, y: -0.35, z: 0.94 },
      { symbol: 'H', x: 0.81, y: -0.35, z: -0.47 },
      { symbol: 'H', x: -0.81, y: -0.35, z: -0.47 },
    ],
    bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]],
  },
  {
    id: 'c6h6',
    name: 'Benzene',
    formula: 'C₆H₆',
    geometry: 'Planar Aromatic Ring',
    bondAngle: '120.0° (sp² with delocalized π cloud)',
    atoms: [
      // 6-carbon hexagonal ring (radius ~1.40 A)
      { symbol: 'C', x: 1.40, y: 0, z: 0 },
      { symbol: 'C', x: 0.70, y: 1.21, z: 0 },
      { symbol: 'C', x: -0.70, y: 1.21, z: 0 },
      { symbol: 'C', x: -1.40, y: 0, z: 0 },
      { symbol: 'C', x: -0.70, y: -1.21, z: 0 },
      { symbol: 'C', x: 0.70, y: -1.21, z: 0 },
      // 6 hydrogens (radius ~2.48 A)
      { symbol: 'H', x: 2.48, y: 0, z: 0 },
      { symbol: 'H', x: 1.24, y: 2.15, z: 0 },
      { symbol: 'H', x: -1.24, y: 2.15, z: 0 },
      { symbol: 'H', x: -2.48, y: 0, z: 0 },
      { symbol: 'H', x: -1.24, y: -2.15, z: 0 },
      { symbol: 'H', x: 1.24, y: -2.15, z: 0 },
    ],
    bonds: [
      [0, 1, 1.5], [1, 2, 1.5], [2, 3, 1.5], [3, 4, 1.5], [4, 5, 1.5], [5, 0, 1.5],
      [0, 6, 1], [1, 7, 1], [2, 8, 1], [3, 9, 1], [4, 10, 1], [5, 11, 1]
    ],
  },
];

interface RealisticMoleculeViewer3DProps {
  initialPresetId?: string;
}

export const RealisticMoleculeViewer3D: React.FC<RealisticMoleculeViewer3DProps> = ({
  initialPresetId = 'h2o',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId);
  const [renderStyle, setRenderStyle] = useState<'ball_and_stick' | 'space_filling'>('ball_and_stick');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const activePreset = MOLECULE_PRESETS.find((m) => m.id === selectedPresetId) || MOLECULE_PRESETS[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check if Three.js is available on window
    const THREE = (window as unknown as { THREE: any }).THREE;
    if (!THREE) {
      console.warn('Three.js library is loading...');
      return;
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF7F8FA); // Ivory white game palette

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. OrbitControls
    const OrbitControls = (window as unknown as { OrbitControls: any }).OrbitControls;
    let controls: any = null;
    if (OrbitControls) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 2.0;
    }

    // 4. Studio PBR 3-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00C2D1, 0.5);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    // Soft reflective ground shadow plane
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const ground = new THREE.Mesh(shadowGeo, shadowMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.6;
    ground.receiveShadow = true;
    scene.add(ground);

    // 5. Build Molecular Geometry
    const molGroup = new THREE.Group();

    // Atoms
    activePreset.atoms.forEach((atom) => {
      const radius = renderStyle === 'space_filling'
        ? (COVALENT_RADII[atom.symbol] || 0.7) * 0.95
        : (COVALENT_RADII[atom.symbol] || 0.7) * 0.42;

      const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: CPK_COLORS[atom.symbol] || 0x64748B,
        roughness: 0.25,
        metalness: 0.1,
      });

      const atomMesh = new THREE.Mesh(sphereGeo, sphereMat);
      atomMesh.position.set(atom.x, atom.y, atom.z);
      atomMesh.castShadow = true;
      atomMesh.receiveShadow = true;
      molGroup.add(atomMesh);
    });

    // Covalent Bonds (Only for ball_and_stick)
    if (renderStyle === 'ball_and_stick') {
      activePreset.bonds.forEach(([fromIdx, toIdx, order]) => {
        const a1 = activePreset.atoms[fromIdx];
        const a2 = activePreset.atoms[toIdx];
        if (!a1 || !a2) return;

        const p1 = new THREE.Vector3(a1.x, a1.y, a1.z);
        const p2 = new THREE.Vector3(a2.x, a2.y, a2.z);
        const dist = p1.distanceTo(p2);
        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        const bondRadius = order === 2 ? 0.06 : 0.08;
        const bondGeo = new THREE.CylinderGeometry(bondRadius, bondRadius, dist, 16);
        const bondMat = new THREE.MeshStandardMaterial({
          color: 0xCBD5E1,
          roughness: 0.4,
          metalness: 0.1,
        });

        const bondMesh = new THREE.Mesh(bondGeo, bondMat);
        bondMesh.position.copy(mid);
        bondMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        bondMesh.castShadow = true;
        molGroup.add(bondMesh);
      });
    }

    scene.add(molGroup);

    // 6. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controls) {
        controls.autoRotate = autoRotate;
        controls.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [selectedPresetId, renderStyle, autoRotate]);

  return (
    <div className="bg-white p-4 rounded-3xl border-2 border-slate-200/90 shadow-sm flex flex-col space-y-3 select-none">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-montserrat font-extrabold text-base text-[#0B1F2A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00C2D1]" />
              3D Molecular Geometry & PBR Studio
            </h3>
            <Badge variant="accent" size="sm">Three.js WebGL</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geometrically accurate VSEPR bond angles, CPK colors, and covalent radii
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          {MOLECULE_PRESETS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedPresetId(m.id)}
              className={`px-2.5 py-1 text-xs font-montserrat font-bold rounded-xl border transition-all cursor-pointer ${
                selectedPresetId === m.id
                  ? 'bg-[#00C2D1] text-white border-[#008E9B] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {m.formula} ({m.name})
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative w-full h-72 sm:h-80 rounded-2xl border-2 border-slate-100 overflow-hidden bg-[#F7F8FA] flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* On-Canvas Telemetry HUD */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-slate-200 shadow-sm space-y-1 text-xs">
          <div className="flex items-baseline gap-2">
            <span className="font-montserrat font-extrabold text-lg text-[#0B1F2A] leading-none">
              {activePreset.formula}
            </span>
            <span className="text-xs text-slate-600 font-semibold">{activePreset.name}</span>
          </div>
          <div className="text-[11px] text-teal-800 font-medium">
            <strong>Geometry:</strong> {activePreset.geometry}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            <strong>Bond Angle:</strong> {activePreset.bondAngle}
          </div>
        </div>

        {/* View Controls Toolbar */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setRenderStyle(renderStyle === 'ball_and_stick' ? 'space_filling' : 'ball_and_stick')}
            className="px-2.5 py-1 text-xs font-montserrat font-bold rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 cursor-pointer"
            title="Toggle Ball-and-Stick vs Space-Filling (VDW)"
          >
            {renderStyle === 'ball_and_stick' ? 'Space-Filling' : 'Ball & Stick'}
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              autoRotate ? 'bg-teal-50 border-teal-300 text-[#00C2D1]' : 'bg-slate-100 text-slate-400'
            }`}
            title="Toggle Orbit Auto-Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
