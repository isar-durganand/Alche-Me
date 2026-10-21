import React, { useState } from 'react';
import { 
  FlaskConical, 
  Layers, 
  Compass, 
  Atom, 
  CheckCircle2, 
  Clock, 
  FileCode2, 
  BookOpen, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  RefreshCw, 
  AlertTriangle,
  FolderArchive,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { FEATURE_INVENTORY } from './data/featureInventory';

export const App: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [testState, setTestState] = useState<'normal' | 'loading' | 'error' | 'empty'>('normal');

  const filteredFeatures = FEATURE_INVENTORY.filter(item => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'prototype') return item.status === 'implemented_in_prototype';
    if (filterCategory === 'planned') return item.status === 'planned';
    return item.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[var(--cq-bg)] text-[var(--cq-text)] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-[var(--cq-border)] bg-[var(--cq-surface)] sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/branding/alche-me-mark.svg" 
              alt="Alche-Me Emblem" 
              className="w-9 h-9 rounded-lg border border-[var(--cq-border)] p-0.5 bg-[var(--cq-surface-raised)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[var(--cq-text)]">Alche-Me</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--cq-surface-raised)] text-[var(--cq-accent)] border border-[var(--cq-border)] font-mono">
                  v0.1.0-alpha
                </span>
              </div>
              <p className="text-[11px] text-[var(--cq-text-muted)] hidden sm:block">
                Scientific Adventure & Virtual Laboratory Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--cq-surface-raised)] border border-[var(--cq-border)] text-[var(--cq-text-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--cq-success)] animate-pulse"></span>
              Local Foundation Active
            </span>
            <div className="flex items-center gap-1 bg-[var(--cq-surface-raised)] p-1 rounded-md border border-[var(--cq-border)]">
              <button 
                onClick={() => setTestState('normal')}
                className={`px-2 py-1 rounded transition-colors ${testState === 'normal' ? 'bg-[var(--cq-accent)] text-black font-medium' : 'text-[var(--cq-text-muted)] hover:text-white'}`}
                title="Normal view"
              >
                Normal
              </button>
              <button 
                onClick={() => setTestState('loading')}
                className={`px-2 py-1 rounded transition-colors ${testState === 'loading' ? 'bg-[var(--cq-accent)] text-black font-medium' : 'text-[var(--cq-text-muted)] hover:text-white'}`}
                title="Simulate loading state"
              >
                Loading
              </button>
              <button 
                onClick={() => setTestState('empty')}
                className={`px-2 py-1 rounded transition-colors ${testState === 'empty' ? 'bg-[var(--cq-accent)] text-black font-medium' : 'text-[var(--cq-text-muted)] hover:text-white'}`}
                title="Simulate empty state"
              >
                Empty
              </button>
              <button 
                onClick={() => setTestState('error')}
                className={`px-2 py-1 rounded transition-colors ${testState === 'error' ? 'bg-[var(--cq-danger)] text-white font-medium' : 'text-[var(--cq-text-muted)] hover:text-white'}`}
                title="Simulate error state"
              >
                Error
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Loading State Simulator */}
        {testState === 'loading' && (
          <div className="p-12 text-center rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface)] flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-3 border-[var(--cq-border)] border-t-[var(--cq-accent)] rounded-full animate-spin"></div>
            <p className="text-sm text-[var(--cq-text-muted)]">Loading Alche-Me laboratory environment and assets...</p>
          </div>
        )}

        {/* Error State Simulator */}
        {testState === 'error' && (
          <div className="p-8 rounded-xl border border-[var(--cq-danger)]/50 bg-[var(--cq-danger)]/10 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-[var(--cq-danger)] mx-auto" />
            <h3 className="font-semibold text-lg text-[var(--cq-text)]">Diagnostic Simulation: Simulated Error State</h3>
            <p className="text-sm text-[var(--cq-text-muted)] max-w-md mx-auto">
              This recoverable failure state verifies graceful handling and keyboard accessibility per Master Spec Section 5.
            </p>
            <button 
              onClick={() => setTestState('normal')}
              className="px-4 py-2 bg-[var(--cq-surface-raised)] border border-[var(--cq-border)] hover:border-[var(--cq-accent)] text-sm rounded-lg transition-colors"
            >
              Reset to Normal
            </button>
          </div>
        )}

        {/* Normal / Active View */}
        {testState === 'normal' && (
          <>
            {/* Hero / Overview Banner */}
            <section className="relative overflow-hidden rounded-2xl border border-[var(--cq-border)] bg-gradient-to-br from-[var(--cq-surface)] via-[var(--cq-surface-raised)] to-[var(--cq-surface)] p-6 sm:p-8">
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--cq-accent)]/10 border border-[var(--cq-accent)]/30 text-[var(--cq-accent)] text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  Phase 01 Complete — Repository Audit & Foundation Baseline
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--cq-text)]">
                  Welcome to <span className="text-[var(--cq-accent)]">Alche-Me</span>
                </h1>
                <p className="text-sm sm:text-base text-[var(--cq-text-muted)] leading-relaxed">
                  A scientifically responsible chemistry adventure. Built with React 19, TypeScript, Vite, and Tailwind CSS. Designed to connect curriculum-mapped engineering practicals, 3D molecular modeling, and explorable adventure worlds.
                </p>
              </div>
            </section>

            {/* Health & Status + Documentation Discovery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Project Health Card */}
              <div className="md:col-span-1 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface)] p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--cq-border)]">
                  <h2 className="font-semibold text-sm tracking-wide uppercase text-[var(--cq-text-muted)] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[var(--cq-success)]" />
                    Project Health
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--cq-success)]/15 text-[var(--cq-success)] font-medium">
                    Verified
                  </span>
                </div>
                
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-[var(--cq-border)]/50">
                    <span className="text-[var(--cq-text-muted)]">Product Identity</span>
                    <span className="font-semibold text-[var(--cq-text)]">Alche-Me (`alche-me`)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--cq-border)]/50">
                    <span className="text-[var(--cq-text-muted)]">Core Stack</span>
                    <span className="text-[var(--cq-text)]">React 19, TS 5, Vite 8, Tailwind 4</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--cq-border)]/50">
                    <span className="text-[var(--cq-text-muted)]">Course Syllabus</span>
                    <span className="text-[var(--cq-text)]">MRIIRS Chem (4.5CH101C00H)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--cq-border)]/50">
                    <span className="text-[var(--cq-text-muted)]">Baseline Build</span>
                    <span className="text-[var(--cq-success)] font-medium">Passed (tsc + vite)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--cq-text-muted)]">Folder Path</span>
                    <span className="text-[var(--cq-text-muted)] font-mono text-[11px] truncate max-w-[160px]" title="C:\Users\durganand\Desktop\Alche-Me">
                      Desktop/Alche-Me
                    </span>
                  </div>
                </div>
              </div>

              {/* Master Documentation Discovery Card */}
              <div className="md:col-span-2 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface)] p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--cq-border)]">
                  <h2 className="font-semibold text-sm tracking-wide uppercase text-[var(--cq-text-muted)] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--cq-accent)]" />
                    Master Documentation & Specifications
                  </h2>
                  <span className="text-xs text-[var(--cq-text-muted)]">Source of Truth</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] hover:border-[var(--cq-accent)] transition-colors">
                    <div className="font-semibold text-[var(--cq-text)] flex items-center gap-1.5 mb-1">
                      <FileText className="w-3.5 h-3.5 text-[var(--cq-accent)]" />
                      Alche-Me Master Spec
                    </div>
                    <p className="text-[11px] text-[var(--cq-text-muted)] mb-2">
                      Full 25-section architecture, pedagogy, 75 screen inventory, and domain rules.
                    </p>
                    <code className="text-[10px] text-[var(--cq-accent)] block font-mono">
                      docs/Alche-Me_Master_Specification.md
                    </code>
                  </div>

                  <div className="p-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] hover:border-[var(--cq-accent)] transition-colors">
                    <div className="font-semibold text-[var(--cq-text)] flex items-center gap-1.5 mb-1">
                      <Compass className="w-3.5 h-3.5 text-[var(--cq-accent)]" />
                      Implementation Roadmap
                    </div>
                    <p className="text-[11px] text-[var(--cq-text-muted)] mb-2">
                      11 sequential delivery phases with strict completion gates and exit criteria.
                    </p>
                    <code className="text-[10px] text-[var(--cq-accent)] block font-mono">
                      docs/Alche-Me_Implementation_Roadmap.md
                    </code>
                  </div>

                  <div className="p-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] hover:border-[var(--cq-accent)] transition-colors">
                    <div className="font-semibold text-[var(--cq-text)] flex items-center gap-1.5 mb-1">
                      <FolderArchive className="w-3.5 h-3.5 text-[var(--cq-accent)]" />
                      Asset Manifest & Rules
                    </div>
                    <p className="text-[11px] text-[var(--cq-text-muted)] mb-2">
                      Directory map, SVG branding, licensing metadata, and optimization standards.
                    </p>
                    <code className="text-[10px] text-[var(--cq-accent)] block font-mono">
                      docs/Alche-Me_Asset_Manifest.md
                    </code>
                  </div>

                  <div className="p-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] hover:border-[var(--cq-accent)] transition-colors">
                    <div className="font-semibold text-[var(--cq-text)] flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--cq-accent)]" />
                      Progress Tracker
                    </div>
                    <p className="text-[11px] text-[var(--cq-text-muted)] mb-2">
                      Per-phase audit evidence, command outcomes, test results, and debt log.
                    </p>
                    <code className="text-[10px] text-[var(--cq-accent)] block font-mono">
                      docs/Alche-Me_Progress_Tracker.md
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical-Slice Feature Inventory & Traceability */}
            <section className="rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface)] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--cq-border)]">
                <div>
                  <h2 className="text-lg font-bold text-[var(--cq-text)] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[var(--cq-accent)]" />
                    Vertical-Slice Feature Inventory
                  </h2>
                  <p className="text-xs text-[var(--cq-text-muted)]">
                    Audit of existing prototype assets (HomoLumo) and roadmap deliverables
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button 
                    onClick={() => setFilterCategory('all')}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${filterCategory === 'all' ? 'bg-[var(--cq-surface-raised)] border-[var(--cq-accent)] text-[var(--cq-accent)] font-medium' : 'border-[var(--cq-border)] text-[var(--cq-text-muted)]'}`}
                  >
                    All ({FEATURE_INVENTORY.length})
                  </button>
                  <button 
                    onClick={() => setFilterCategory('prototype')}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${filterCategory === 'prototype' ? 'bg-[var(--cq-surface-raised)] border-[var(--cq-accent)] text-[var(--cq-accent)] font-medium' : 'border-[var(--cq-border)] text-[var(--cq-text-muted)]'}`}
                  >
                    Prototype Ready ({FEATURE_INVENTORY.filter(f => f.status === 'implemented_in_prototype').length})
                  </button>
                  <button 
                    onClick={() => setFilterCategory('planned')}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${filterCategory === 'planned' ? 'bg-[var(--cq-surface-raised)] border-[var(--cq-accent)] text-[var(--cq-accent)] font-medium' : 'border-[var(--cq-border)] text-[var(--cq-text-muted)]'}`}
                  >
                    Planned ({FEATURE_INVENTORY.filter(f => f.status === 'planned').length})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFeatures.map(item => (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-[var(--cq-text)]">{item.title}</span>
                        {item.status === 'implemented_in_prototype' && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--cq-success)]/15 text-[var(--cq-success)] border border-[var(--cq-success)]/30 font-medium whitespace-nowrap">
                            Prototype Ready
                          </span>
                        )}
                        {item.status === 'foundational_in_place' && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--cq-accent)]/15 text-[var(--cq-accent)] border border-[var(--cq-accent)]/30 font-medium whitespace-nowrap">
                            Foundation Set
                          </span>
                        )}
                        {item.status === 'planned' && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--cq-border)] text-[var(--cq-text-muted)] border border-[var(--cq-border)] font-medium whitespace-nowrap">
                            Roadmap Phase
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--cq-text-muted)] leading-relaxed">
                        {item.notes}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--cq-border)]/60 flex items-center justify-between text-[11px] text-[var(--cq-text-muted)]">
                      <span className="bg-[var(--cq-bg)] px-2 py-0.5 rounded border border-[var(--cq-border)]">
                        {item.category} • {item.phase}
                      </span>
                      {item.sourceModule && (
                        <span className="font-mono text-[10px] text-[var(--cq-accent)] truncate max-w-[200px]" title={item.sourceModule}>
                          {item.sourceModule}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Asset Gallery Showcase */}
            <section className="rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface)] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--cq-border)]">
                <div>
                  <h2 className="text-lg font-bold text-[var(--cq-text)] flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[var(--cq-accent)]" />
                    Discovered Runtime Assets
                  </h2>
                  <p className="text-xs text-[var(--cq-text-muted)]">
                    Audited high-resolution concept art and branding in <code className="text-[var(--cq-accent)] font-mono">public/assets/</code>
                  </p>
                </div>
                <span className="text-xs text-[var(--cq-text-muted)] font-mono">
                  CSV Manifest Recorded
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] overflow-hidden group">
                  <div className="h-32 bg-[var(--cq-bg)] flex items-center justify-center p-4">
                    <img src="/assets/branding/Alche-Me Logo.png" alt="Alche-Me Logo" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="p-3 border-t border-[var(--cq-border)]">
                    <p className="text-xs font-semibold text-[var(--cq-text)]">Alche-Me Logo</p>
                    <p className="text-[10px] text-[var(--cq-text-muted)]">branding/Alche-Me Logo.png</p>
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] overflow-hidden group">
                  <div className="h-32 bg-[var(--cq-bg)] flex items-center justify-center overflow-hidden">
                    <img src="/assets/worlds/Alche-Me_ Six Scientific Worlds.png" alt="Six Scientific Worlds" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3 border-t border-[var(--cq-border)]">
                    <p className="text-xs font-semibold text-[var(--cq-text)]">Six Scientific Worlds</p>
                    <p className="text-[10px] text-[var(--cq-text-muted)]">worlds/Alche-Me_ Six Scientific Worlds.png</p>
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] overflow-hidden group">
                  <div className="h-32 bg-[var(--cq-bg)] flex items-center justify-center overflow-hidden">
                    <img src="/assets/backgrounds/Futuristic Chemistry Lab with Mountain Views.png" alt="Futuristic Lab" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3 border-t border-[var(--cq-border)]">
                    <p className="text-xs font-semibold text-[var(--cq-text)]">Virtual 3D Lab Backdrop</p>
                    <p className="text-[10px] text-[var(--cq-text-muted)]">backgrounds/Futuristic Lab...</p>
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] overflow-hidden group">
                  <div className="h-32 bg-[var(--cq-bg)] flex items-center justify-center overflow-hidden">
                    <img src="/assets/icons/Alche-Me Chemistry Game Styleboard.png" alt="Styleboard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3 border-t border-[var(--cq-border)]">
                    <p className="text-xs font-semibold text-[var(--cq-text)]">Game Styleboard</p>
                    <p className="text-[10px] text-[var(--cq-text-muted)]">icons/Alche-Me Chemistry Game Styleboard.png</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Empty State Simulator */}
        {testState === 'empty' && (
          <div className="p-12 text-center rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface)] space-y-4">
            <Compass className="w-12 h-12 text-[var(--cq-text-muted)] mx-auto opacity-50" />
            <h3 className="font-semibold text-lg text-[var(--cq-text)]">Diagnostic: Empty State View</h3>
            <p className="text-sm text-[var(--cq-text-muted)] max-w-sm mx-auto">
              Simulating an empty quest log or unpopulated world node. Verified compliant with empty-state requirements.
            </p>
            <button 
              onClick={() => setTestState('normal')}
              className="px-4 py-2 bg-[var(--cq-accent)] text-black text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Return to Active Hub
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--cq-border)] bg-[var(--cq-surface)] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--cq-text-muted)]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--cq-text)]">Alche-Me</span>
            <span>•</span>
            <span>Phase 01: Foundation Baseline Established</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Ready for Phase 02: Design System</span>
            <span>•</span>
            <span className="font-mono text-[11px]">Strict Scientific Rigor</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
