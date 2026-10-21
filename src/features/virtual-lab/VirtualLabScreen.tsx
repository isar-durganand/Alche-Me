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
  Atom,
  ArrowRight,
  Beaker,
  TestTube
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
      {/* Laboratory Hero Header with Realistic Backdrop */}
      <section className="relative rounded-3xl overflow-hidden border-2 border-slate-200/90 bg-white shadow-sm">
        <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-900">
          <img
            src="/assets/backgrounds/Futuristic Chemistry Lab with Mountain Views.png"
            alt="Futuristic Chemistry Laboratory"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F2A]/90 via-[#0B1F2A]/40 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-white space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/30 border border-teal-400/50 backdrop-blur-sm text-teal-200 text-xs font-montserrat font-bold">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>MRIIRS SYLLABUS 4.5CH101C00H</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-montserrat font-extrabold text-white leading-tight">
                Virtual Chemistry Laboratory
              </h1>
              <p className="text-xs sm:text-sm text-teal-100 font-medium">
                10 University-prescribed engineering practicals: volumetric titrimetry, potentiometric redox curves, conductometric neutralization, Redwood viscometry, and computational modeling.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <Input
                placeholder="Search practicals by title, reagent, or compound..."
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
      </section>

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExperiments.map((exp) => (
          <Card key={exp.id} variant="raised" className="flex flex-col justify-between group">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="accent" size="sm">
                  EXP 0{exp.num} • {exp.manualPage}
                </Badge>
                <span className="text-[10px] text-[#00C2D1] font-montserrat font-extrabold uppercase tracking-wider">
                  {exp.category.split('&')[0]}
                </span>
              </div>
              <CardTitle className="text-lg pt-1 leading-snug">{exp.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-xs">
                {exp.aim}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-5 pt-0 space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-montserrat font-bold text-slate-500">Target Molecule / Reagent:</span>
                <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-100 flex items-center justify-between">
                  <span className="font-montserrat font-bold text-[#0B1F2A]">{exp.compoundName}</span>
                  <span className="font-mono text-[10px] text-[#00C2D1] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {exp.targetSmiles}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="p-2 rounded-lg bg-slate-50/70 border border-slate-100">
                  <span className="font-montserrat font-bold text-[#0B1F2A]">Reagents: </span>
                  {exp.reagents.length} solutions
                </div>
                <div className="p-2 rounded-lg bg-slate-50/70 border border-slate-100">
                  <span className="font-montserrat font-bold text-[#0B1F2A]">Apparatus: </span>
                  {exp.apparatus.length} items
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/80 p-4 border-t-2 border-slate-100">
              <span className="font-montserrat font-bold text-[11px] text-slate-500">
                Lab Manual {exp.manualPage}
              </span>
              <Button size="sm" variant="primary" onClick={() => setActiveExperiment(exp)}>
                INSPECT PROTOCOL
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
            <div className="space-y-1.5">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#00C2D1]">Aim of Experiment</span>
              <p className="p-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/70 text-[#0B1F2A] leading-relaxed text-sm font-medium">
                {activeExperiment.aim}
              </p>
            </div>

            {/* Principle */}
            <div className="space-y-1.5">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#00C2D1]">Chemical Principle & Theory</span>
              <p className="p-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/70 text-[#0B1F2A] leading-relaxed text-sm">
                {activeExperiment.principle}
              </p>
            </div>

            {/* Stoichiometric Reactions */}
            {activeExperiment.reactions && activeExperiment.reactions.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#00C2D1]">Stoichiometric Equations</span>
                <div className="space-y-1 p-3.5 rounded-2xl border-2 border-slate-100 bg-white font-mono text-[11px] text-[#00C2D1] shadow-sm">
                  {activeExperiment.reactions.map((rxn, idx) => (
                    <div key={idx} className="py-0.5">• {rxn}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Procedure Steps */}
            <div className="space-y-1.5">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#00C2D1]">Standard Laboratory Procedure</span>
              <div className="space-y-2">
                {activeExperiment.procedure.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl border-2 border-slate-100 bg-slate-50/70 leading-relaxed text-[#0B1F2A] text-xs">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Formulae & Calculations */}
            <div className="space-y-1.5">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#00C2D1]">Formulae & Calculations</span>
              <pre className="p-3.5 rounded-2xl border-2 border-slate-100 bg-white font-mono text-[11px] text-[#0B1F2A] whitespace-pre-wrap leading-relaxed shadow-sm">
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
                CLOSE WORKSHEET
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
