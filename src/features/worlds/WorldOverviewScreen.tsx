import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Unlock,
  Play, 
  Clock, 
  Zap, 
  Award, 
  Sparkles, 
  ShieldCheck,
  ChevronRight,
  Atom,
  HelpCircle
} from 'lucide-react';
import { WorldSchema, LevelSchema } from '../../domain/types/curriculum';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button, ProgressBar, MarkdownRenderer } from '../../components/ui';
import { LevelRunnerModal } from '../progression/LevelRunnerModal';

export interface WorldOverviewScreenProps {
  world: WorldSchema;
  onBack: () => void;
}

export const WorldOverviewScreen: React.FC<WorldOverviewScreenProps> = ({ world, onBack }) => {
  const [activeLevel, setActiveLevel] = useState<LevelSchema | null>(null);
  const [inspectorMode, setInspectorMode] = useState(true);

  const allProgress = progressAdapter.getAllProgress();

  const completedCount = world.levels.filter(
    (lvl) => allProgress[lvl.id]?.status === 'completed' || allProgress[lvl.id]?.status === 'mastered'
  ).length;

  const handleLaunchLevel = (level: LevelSchema) => {
    soundEngine.playTap();
    setActiveLevel(level);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => {
              soundEngine.playTap();
              onBack();
            }}
            className="text-xs"
          >
            BACK TO ALL WORLDS
          </Button>

          <button
            type="button"
            onClick={() => setInspectorMode(!inspectorMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              inspectorMode
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            {inspectorMode ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
            <span>{inspectorMode ? 'All Levels Unlocked (Inspector Mode)' : 'Enforce Prerequisites'}</span>
          </button>
        </div>

        {/* World Hero Card */}
        <div className="rounded-3xl border-2 border-slate-200/90 bg-white overflow-hidden shadow-sm">
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
            <img
              src={world.thumbnail}
              alt={world.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F2A]/95 via-[#0B1F2A]/50 to-transparent flex items-end p-6">
              <div className="text-white space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="accent" size="sm" className="bg-[#00C2D1] text-white border-0 font-montserrat font-bold">
                    WORLD 0{world.num}
                  </Badge>
                  <span className="text-xs font-montserrat font-bold text-teal-200">
                    {completedCount} of {world.levels.length} Missions Cleared
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-montserrat font-extrabold text-white leading-tight">
                  {world.title}
                </h1>
                <p className="text-sm sm:text-base text-teal-100 font-medium">
                  {world.theme}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Rich Markdown World Story */}
            <MarkdownRenderer
              content={world.story}
              className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl font-normal"
            />

            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80">
              <span className="text-xs font-montserrat font-extrabold uppercase tracking-wider text-teal-800 block mb-1">
                Curriculum Learning Outcome
              </span>
              <p className="text-sm sm:text-base text-teal-950 font-medium leading-relaxed">
                {world.worldOutcome}
              </p>
            </div>

            {world.levels.length > 0 && (
              <ProgressBar
                value={Math.round((completedCount / world.levels.length) * 100)}
                label="World Curriculum Completion"
                showPercentage
                variant="accent"
                size="md"
              />
            )}
          </div>
        </div>
      </div>

      {/* Level / Mission Nodes Sequence */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-montserrat font-extrabold text-[#0B1F2A] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00C2D1]" />
            Mission Progression Sequence ({world.levels.length} Levels)
          </h2>
          <span className="text-xs font-montserrat font-bold text-slate-500">
            {world.levels.length} Total Curated Missions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {world.levels.map((level) => {
            const progress = allProgress[level.id];
            
            // Check if level is locked: bypassed in inspectorMode!
            let isLocked = false;
            let prereqNames: string[] = [];

            if (!inspectorMode && level.prerequisiteLevelIds && level.prerequisiteLevelIds.length > 0) {
              const allPrereqsDone = level.prerequisiteLevelIds.every((prereqId) => {
                const prereqProg = allProgress[prereqId];
                return prereqProg?.status === 'completed' || prereqProg?.status === 'mastered';
              });
              isLocked = !allPrereqsDone;

              prereqNames = level.prerequisiteLevelIds.map((id) => {
                const found = world.levels.find((l) => l.id === id);
                return found?.title.split('(')[0] || id;
              });
            }

            const isMastered = progress?.status === 'mastered';
            const isCompleted = progress?.status === 'completed' || isMastered;

            return (
              <Card
                key={level.id}
                variant={isLocked ? 'default' : isCompleted ? 'raised' : 'interactive'}
                className={`flex flex-col justify-between ${
                  isLocked ? 'opacity-70 bg-slate-50' : 'bg-white'
                }`}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-montserrat font-extrabold text-xs text-[#00C2D1]">
                        MISSION 0{level.order}
                      </span>
                      <Badge
                        variant={
                          isMastered
                            ? 'success'
                            : isCompleted
                            ? 'accent'
                            : isLocked
                            ? 'neutral'
                            : 'gold'
                        }
                        size="sm"
                        dot={!isLocked}
                      >
                        {isMastered
                          ? 'Mastered'
                          : isCompleted
                          ? 'Completed'
                          : isLocked
                          ? 'Locked'
                          : 'Available'}
                      </Badge>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#F5B942] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" /> +{level.rewards.xp} XP
                    </span>
                  </div>

                  <CardTitle className="text-base sm:text-lg font-montserrat font-extrabold text-[#0B1F2A] mt-2">
                    {level.title}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {level.shortDescription}
                  </p>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3">
                  {/* Key Concepts Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {level.keyConcepts.slice(0, 4).map((concept, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                      >
                        {concept}
                      </span>
                    ))}
                    {level.keyConcepts.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-medium self-center">
                        +{level.keyConcepts.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Prerequisites or Lock reason */}
                  {isLocked && (
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Requires: {prereqNames.join(', ')}</span>
                    </div>
                  )}

                  {/* Best Score Metric if attempted */}
                  {progress && progress.bestScore !== undefined && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">Scholar Best Score:</span>
                      <span className="font-montserrat font-bold text-[#00C2D1]">
                        {progress.bestScore}% ({progress.attempts} {progress.attempts === 1 ? 'Attempt' : 'Attempts'})
                      </span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{level.estimatedMinutes} Mins</span>
                  </div>

                  <Button
                    size="sm"
                    variant={isMastered ? 'secondary' : 'primary'}
                    rightIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                    onClick={() => handleLaunchLevel(level)}
                    className="font-montserrat font-bold cursor-pointer"
                  >
                    {isMastered ? 'REVISIT MISSION' : isCompleted ? 'PRACTICE' : 'START MISSION'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Active Level Runner Modal */}
      {activeLevel && (
        <LevelRunnerModal
          level={activeLevel}
          isOpen={!!activeLevel}
          onClose={() => setActiveLevel(null)}
          onLevelCompleted={() => {
            // Refreshes view state
          }}
        />
      )}
    </div>
  );
};
