import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Search, 
  BookOpen, 
  FileText, 
  ShieldAlert, 
  Sparkles, 
  ExternalLink,
  CheckCircle2,
  Atom
} from 'lucide-react';
import { EXPERIMENTS_DATA, ExperimentItem } from '../../data/experimentsData';
import { 
  Input, 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  Badge, 
  Modal, 
  Tabs,
  Alert 
} from '../../components/ui';

export const VirtualLabScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeExperiment, setActiveExperiment] = useState<ExperimentItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Experiments' },
    { id: 'Complexometric Titration', label: 'Complexometric' },
    { id: 'Acid-Base Neutralization Titration', label: 'Acid-Base' },
    { id: 'Iodometric Redox Titration & Electrometric TDS', label: 'Redox & TDS' },
    { id: 'Potentiometric Redox Titration', label: 'Potentiometry' },
    { id: 'Conductometric Acid-Base Titration', label: 'Conductometry' },
    { id: 'Viscometry & Tribology', label: 'Viscosity' },
    { id: 'Computational Chemistry & Molecular Geometry', label: 'Computational' },
  ];

  const filteredExperiments = useMemo(() => {
    return EXPERIMENTS_DATA.filter((exp) => {
      const matchesSearch =
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.num.includes(searchQuery.trim()) ||
        exp.aim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.compoundName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || exp.category === selectedCategory;

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
              <FlaskConical className="w-6 h-6 text-[var(--cq-accent)]" />
              Engineering Chemistry Virtual Laboratory
            </h1>
            <p className="text-xs text-[var(--cq-text-muted)]">
              Official MRIIRS Laboratory Manual (Course Code: 4.5CH101C00H) — 10 University Practicals
            </p>
          </div>
          <Badge variant="accent" size="md">
            {filteredExperiments.length} Practicals Available
          </Badge>
        </div>

        {/* Search & Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <Input
              placeholder="Search experiments by title, reagent, or compound..."
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

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredExperiments.map((exp) => (
          <Card key={exp.id} variant="raised" className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="neutral" size="sm">
                  Lab {exp.num} • {exp.manualPage}
                </Badge>
                <span className="text-[10px] text-[var(--cq-accent)] font-semibold uppercase tracking-wider">
                  {exp.category}
                </span>
              </div>
              <CardTitle className="text-base pt-1">{exp.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {exp.aim}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[var(--cq-text-muted)]">Target Molecule / Reagent:</span>
                <div className="p-2 rounded-lg bg-[var(--cq-surface)] border border-[var(--cq-border)]/60 flex items-center justify-between">
                  <span className="font-semibold text-[var(--cq-text)]">{exp.compoundName}</span>
                  <span className="font-mono text-[10px] text-[var(--cq-accent)]">{exp.targetSmiles}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--cq-text-muted)]">
                <div>
                  <span className="font-medium text-[var(--cq-text)]">Reagents: </span>
                  {exp.reagents.length} solutions
                </div>
                <div>
                  <span className="font-medium text-[var(--cq-text)]">Apparatus: </span>
                  {exp.apparatus.length} instruments
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-[11px] text-[var(--cq-text-muted)]">
                Syllabus Page {exp.manualPage.split(' ')[1] || exp.manualPage}
              </span>
              <Button size="sm" variant="outline" onClick={() => setActiveExperiment(exp)}>
                Inspect Protocol
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Experiment Protocol Detail Modal */}
      {activeExperiment && (
        <Modal
          isOpen={!!activeExperiment}
          onClose={() => setActiveExperiment(null)}
          title={`Experiment ${activeExperiment.num}: ${activeExperiment.title}`}
          description={`MRIIRS Lab Manual — ${activeExperiment.manualPage} • Category: ${activeExperiment.category}`}
          size="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Aim */}
            <div className="space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-accent)]">Aim of Experiment</span>
              <p className="p-3 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] text-[var(--cq-text)] leading-relaxed">
                {activeExperiment.aim}
              </p>
            </div>

            {/* Principle */}
            <div className="space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-accent)]">Chemical Principle & Theory</span>
              <p className="p-3 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] text-[var(--cq-text)] leading-relaxed">
                {activeExperiment.principle}
              </p>
            </div>

            {/* Stoichiometric Reactions */}
            {activeExperiment.reactions && activeExperiment.reactions.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-accent)]">Stoichiometric Equations</span>
                <div className="space-y-1 p-3 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-bg)] font-mono text-[11px] text-[var(--cq-accent)]">
                  {activeExperiment.reactions.map((rxn, idx) => (
                    <div key={idx} className="py-0.5">• {rxn}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Procedure Steps */}
            <div className="space-y-1.5">
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-accent)]">Standard Laboratory Procedure</span>
              <div className="space-y-2">
                {activeExperiment.procedure.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] leading-relaxed text-[var(--cq-text)]">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Formulae & Calculations */}
            <div className="space-y-1">
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-accent)]">Formulae & Calculations</span>
              <pre className="p-3 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-bg)] font-mono text-[11px] text-[var(--cq-text)] whitespace-pre-wrap leading-relaxed">
                {activeExperiment.formulae}
              </pre>
            </div>

            {/* Precautions Alert */}
            {activeExperiment.precautions && activeExperiment.precautions.length > 0 && (
              <Alert variant="warning" title="Critical Safety & Hygiene Precautions">
                <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px]">
                  {activeExperiment.precautions.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => setActiveExperiment(null)}>
                Close Worksheet
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
