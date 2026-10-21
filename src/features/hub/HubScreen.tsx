import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  FlaskConical, 
  Atom, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  ShieldAlert,
  Flame,
  Award
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, ProgressBar, Alert } from '../../components/ui';

export interface HubScreenProps {
  onNavigate: (route: 'periodic-table' | 'virtual-lab' | 'settings') => void;
}

export const HubScreen: React.FC<HubScreenProps> = ({ onNavigate }) => {
  const worlds = [
    {
      id: 'w1',
      title: 'Discovery Academy',
      subtitle: 'Matter, Measurement & Safety',
      levels: 8,
      status: 'Active',
      color: 'accent',
      desc: 'Foundational laboratory conventions, metric units, SI standards, and chemical hygiene protocols.',
    },
    {
      id: 'w2',
      title: 'Atomic Frontier',
      subtitle: 'Quantum Orbitals & Periodicity',
      levels: 12,
      status: 'In Progress',
      color: 'accent',
      desc: 'Schrödinger wave mechanics, Hund’s rule, Pauli exclusion, and Mendeleev periodic trends.',
    },
    {
      id: 'w3',
      title: 'Bonding Worlds',
      subtitle: 'VSEPR & Molecular Geometry',
      levels: 10,
      status: 'Available',
      color: 'warning',
      desc: 'Hybridization, Drago’s rule, lone-pair repulsions, and 3D coordination geometries.',
    },
    {
      id: 'w4',
      title: 'Reaction Forge',
      subtitle: 'Stoichiometry & Redox Dynamics',
      levels: 14,
      status: 'Locked',
      color: 'neutral',
      desc: 'Balancing multi-phase redox systems, Nernst potentiometry, and electrochemical electromotive forces.',
    },
    {
      id: 'w5',
      title: 'Analytical District',
      subtitle: 'Volumetric & Complexometric Titrations',
      levels: 10,
      status: 'Locked',
      color: 'neutral',
      desc: 'EDTA water hardness, acid-base alkalinity, conductometric titrations, and error analysis.',
    },
    {
      id: 'w6',
      title: 'Materials & Energy Frontier',
      subtitle: 'Lubricants, Polymers & Fuels',
      levels: 12,
      status: 'Locked',
      color: 'neutral',
      desc: 'Redwood viscometry, proximate coal grading, Pensky-Martens flash points, and polymer synthesis.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--cq-border)] bg-[var(--cq-surface)] p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--cq-accent-subtle)] border border-[var(--cq-accent)]/30 text-[var(--cq-accent)] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 02 — Design System & Responsive Shell Active
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--cq-text)]">
            Explore <span className="text-[var(--cq-accent)]">Alche-Me</span> Laboratory Hub
          </h1>
          <p className="text-sm sm:text-base text-[var(--cq-text-muted)] leading-relaxed">
            Welcome to the curriculum-aligned chemical science workstation. Discover authentic periodic trends, simulate engineering titrations with validated stoichiometry, and build 3D molecular conformations.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button 
              variant="primary" 
              size="md" 
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('virtual-lab')}
            >
              Enter Virtual Lab
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              leftIcon={<Atom className="w-4 h-4" />}
              onClick={() => onNavigate('periodic-table')}
            >
              Explore 118 Elements
            </Button>
          </div>
        </div>
      </section>

      {/* Active Quest / Mission Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="raised" className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="accent" dot>Current Mission</Badge>
              <span className="text-xs font-mono text-[var(--cq-text-muted)]">Course 4.5CH101C00H</span>
            </div>
            <CardTitle>Experiment 01: EDTA Complexometric Water Hardness</CardTitle>
            <CardDescription>
              Standardize 0.01 M disodium EDTA solution against standard hard water at buffered pH 10.0 using EBT indicator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={40} label="Protocol Milestone Completion" showPercentage variant="accent" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-2.5 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface)]">
                <span className="text-[var(--cq-text-muted)] block text-[11px]">Primary Indicator</span>
                <span className="font-semibold text-[var(--cq-text)]">Eriochrome Black T</span>
              </div>
              <div className="p-2.5 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface)]">
                <span className="text-[var(--cq-text-muted)] block text-[11px]">Equivalence Color</span>
                <span className="font-semibold text-[var(--cq-accent)]">Wine Red ➔ Steel Blue</span>
              </div>
              <div className="p-2.5 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface)]">
                <span className="text-[var(--cq-text-muted)] block text-[11px]">Buffer Condition</span>
                <span className="font-semibold text-[var(--cq-text)]">NH₄Cl + NH₄OH (pH 10)</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <span className="text-[var(--cq-text-muted)]">Target Molecule: EDTA-Calcium Chelate</span>
            <Button size="sm" variant="outline" onClick={() => onNavigate('virtual-lab')}>
              Open Protocol Worksheet
            </Button>
          </CardFooter>
        </Card>

        {/* Quick System Status Card */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Session Telemetry</CardTitle>
              <Badge variant="success" size="sm">Online</Badge>
            </div>
            <CardDescription>Local storage and verification engines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[var(--cq-border)]/50">
              <span className="text-[var(--cq-text-muted)]">Chemistry Engine</span>
              <span className="font-semibold text-[var(--cq-text)]">RDKit & WebGL Validated</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--cq-border)]/50">
              <span className="text-[var(--cq-text-muted)]">Syllabus Reference</span>
              <span className="text-[var(--cq-accent)] font-medium">MRIIRS 4.5CH101C00H</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--cq-border)]/50">
              <span className="text-[var(--cq-text-muted)]">Generative AI In-Game</span>
              <span className="text-[var(--cq-text-muted)]">Disabled (Curated Only)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--cq-text-muted)]">Design System</span>
              <span className="text-[var(--cq-success)] font-medium">Accessible (Dark Tokens)</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="ghost" className="w-full text-xs" onClick={() => onNavigate('settings')}>
              Manage Preferences & Diagnostics
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Six Scientific Worlds Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--cq-text)] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[var(--cq-accent)]" />
              Scientific Exploration Worlds
            </h2>
            <p className="text-xs text-[var(--cq-text-muted)]">
              Modular curriculum containers designed to guide progression from foundational atoms to capstone engineering
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {worlds.map((world) => (
            <Card key={world.id} variant="interactive" className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={world.status === 'Active' ? 'accent' : world.status === 'In Progress' ? 'warning' : 'neutral'}
                    size="sm"
                    dot={world.status !== 'Locked'}
                  >
                    {world.status}
                  </Badge>
                  <span className="text-xs font-mono text-[var(--cq-text-muted)]">
                    {world.levels} Missions
                  </span>
                </div>
                <CardTitle className="text-base pt-1">{world.title}</CardTitle>
                <CardDescription className="text-xs font-medium text-[var(--cq-accent)]">
                  {world.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[var(--cq-text-muted)] leading-relaxed">
                  {world.desc}
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-[11px] text-[var(--cq-text-muted)]">
                  {world.status === 'Locked' ? 'Prerequisite Required' : 'Curriculum Ready'}
                </span>
                <Button 
                  size="sm" 
                  variant={world.status === 'Locked' ? 'ghost' : 'outline'}
                  disabled={world.status === 'Locked'}
                  onClick={() => onNavigate(world.id === 'w2' ? 'periodic-table' : 'virtual-lab')}
                >
                  {world.status === 'Locked' ? 'Locked' : 'Open World'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
