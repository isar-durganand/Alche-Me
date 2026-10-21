import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  Star, 
  Clock, 
  Award, 
  BookOpen, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Zap,
  Info
} from 'lucide-react';
import { WorldSchema, LevelSchema } from '../../domain/types/curriculum';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, ProgressBar, Modal } from '../../components/ui';
import { LevelRunnerModal } from '../progression/LevelRunnerModal';

export interface WorldOverviewScreenProps {
  world: WorldSchema;
  onBack: () => void;
}

export const WorldOverviewScreen: React.FC<WorldOverviewScreenProps> = ({ world, onBack }) => {
  const [activeLevel, setActiveLevel] = useState<LevelSchema | null>(null);
  const [plannedLevelNotice, setPlannedLevelNotice] = useState<LevelSchema | null>(null);

  const allProgress = progressAdapter.getAllProgress();

  const completedCount = world.levels.filter(
    (lvl) => allProgress[lvl.id]?.status === 'completed' || allProgress[lvl.id]?.status === 'mastered'
  ).length;

  const handleLaunchLevel = (level: LevelSchema) => {
    if (level.implementationStatus === 'fully_implemented') {
      setActiveLevel(level);
    } else {
      setPlannedLevelNotice(level);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
          className="text-xs"
        >
          BACK TO ALL WORLDS
        </Button>

        {/* World Hero Card */}
        <div className="rounded-3xl border-2 border-slate-200/90 bg-white overflow-hidden shadow-sm">
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
            <img
              src={world.thumbnail}
              alt={world.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F2A]/95 via-[#0B1F2A]/50 to-transparent flex items-end p-6">
              <div className="text-white space-y-1">
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
                <p className="text-xs sm:text-sm text-teal-100 font-medium">
                  {world.theme}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
              {world.story}
            </p>

            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80">
              <span className="text-[10px] font-montserrat font-extrabold uppercase tracking-wider text-teal-800 block mb-1">
                Curriculum Learning Outcome
              </span>
              <p className="text-xs text-teal-950 font-medium leading-relaxed">
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
            Mission Progression Sequence (7 Levels)
          </h2>
          <span className="text-xs font-montserrat font-bold text-slate-500">
            {world.levels.length} Total Curated Missions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {world.levels.map((level) => {
            const progress = allProgress[level.id];
            
            // Check if level is locked:
            let isLocked = false;
            let prereqNames: string[] = [];

            if (level.prerequisiteLevelIds && level.prerequisiteLevelIds.length > 0) {
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
            const isFullyImplemented = level.implementationStatus === 'fully_implemented';

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
                            : isFullyImplemented
                            ? 'gold'
                            : 'neutral'
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
                          : isFullyImplemented
                          ? 'Playable Vertical Slice'
                          : 'Syllabus Ready'}
                      </Badge>
                    </div>

                    <span className="text-xs font-montserrat font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {level.estimatedMinutes} min
                    </span>
                  </div>

                  <CardTitle className="text-lg pt-1 leading-snug">{level.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {level.shortDescription}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl border-2 border-slate-100 bg-slate-50/70">
                    <span className="text-slate-500 font-medium">Difficulty Level:</span>
                    <span className="font-montserrat font-bold capitalize text-[#0B1F2A]">{level.difficulty}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-3 rounded-xl border-2 border-slate-100 bg-amber-50/50">
                    <span className="text-amber-800 font-medium">Clearance Reward:</span>
                    <span className="font-montserrat font-extrabold text-amber-700 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" /> +{level.rewards.xp} XP
                    </span>
                  </div>

                  {progress?.bestScore !== undefined && (
                    <div className="flex items-center justify-between py-2 px-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-900">
                      <span className="font-montserrat font-bold">Best Assessment Score:</span>
                      <span className="font-montserrat font-extrabold text-sm">{progress.bestScore}%</span>
                    </div>
                  )}

                  {isLocked && prereqNames.length > 0 && (
                    <div className="text-[11px] font-montserrat font-bold text-amber-800 flex items-center gap-1.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                      <Lock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>Prerequisite: Complete {prereqNames.join(', ')}</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-slate-50/80 p-4 border-t-2 border-slate-100">
                  <span className="text-[11px] font-montserrat font-bold text-slate-500">
                    {isCompleted ? `${progress?.attempts || 1} Attempt(s)` : isFullyImplemented ? 'Ready for exploration' : 'Planned Level'}
                  </span>

                  <Button
                    size="sm"
                    variant={isLocked ? 'secondary' : isCompleted ? 'secondary' : 'primary'}
                    disabled={isLocked}
                    leftIcon={isCompleted ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    onClick={() => handleLaunchLevel(level)}
                  >
                    {isCompleted ? 'REVISIT' : 'START MISSION'}
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
            // refresh
          }}
        />
      )}

      {/* Planned Level Notice Modal */}
      {plannedLevelNotice && (
        <Modal
          isOpen={!!plannedLevelNotice}
          onClose={() => setPlannedLevelNotice(null)}
          title={`Curriculum Notice: ${plannedLevelNotice.title}`}
          description={`Mission 0${plannedLevelNotice.order} • ${plannedLevelNotice.difficulty.toUpperCase()} LEVEL`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#00C2D1] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-montserrat font-extrabold text-sm text-[#0B1F2A] block">
                  Curriculum Specification Defined
                </span>
                <p className="text-slate-600 leading-relaxed">
                  The learning objectives, competencies, and assessment questions for this level have been mapped to the official curriculum. The interactive activity engine is planned for progressive roll-out.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/70 space-y-2">
              <span className="font-montserrat font-bold text-xs text-[#0B1F2A] block">
                Target Learning Objectives:
              </span>
              <ul className="space-y-1 text-slate-600">
                {plannedLevelNotice.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#00C2D1] font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setPlannedLevelNotice(null)}>
                UNDERSTOOD
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
