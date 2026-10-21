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
  Zap
} from 'lucide-react';
import { CurriculumWorld, CurriculumLevel } from '../../data/curriculumData';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, ProgressBar } from '../../components/ui';
import { MissionBriefingModal } from '../progression/MissionBriefingModal';
import { ActivityPlayerModal } from '../progression/ActivityPlayerModal';

export interface WorldOverviewScreenProps {
  world: CurriculumWorld;
  onBack: () => void;
}

export const WorldOverviewScreen: React.FC<WorldOverviewScreenProps> = ({ world, onBack }) => {
  const [briefingLevel, setBriefingLevel] = useState<CurriculumLevel | null>(null);
  const [playingLevel, setPlayingLevel] = useState<CurriculumLevel | null>(null);

  const allProgress = progressAdapter.getAllProgress();

  const handleStartActivity = (level: CurriculumLevel) => {
    setBriefingLevel(null);
    setPlayingLevel(level);
  };

  const handleActivityComplete = () => {
    setPlayingLevel(null);
  };

  const completedCount = world.levels.filter(
    (lvl) => allProgress[lvl.id]?.status === 'completed' || allProgress[lvl.id]?.status === 'mastered'
  ).length;

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
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
            <img
              src={world.thumbnail}
              alt={world.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F2A]/90 via-[#0B1F2A]/40 to-transparent flex items-end p-6">
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
                  {world.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
              {world.summary}
            </p>

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
            Mission Progression Sequence
          </h2>
          <span className="text-xs font-montserrat font-bold text-slate-500">
            {world.levels.length} Total Interactive Missions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {world.levels.map((level, idx) => {
            const progress = allProgress[level.id];
            
            // Check if level is locked:
            let isLocked = false;
            let prereqName = '';
            if (level.prerequisiteId) {
              const prereqProgress = allProgress[level.prerequisiteId];
              const isPrereqDone = prereqProgress?.status === 'completed' || prereqProgress?.status === 'mastered';
              if (!isPrereqDone) {
                isLocked = true;
                const prereqLevel = world.levels.find((l) => l.id === level.prerequisiteId);
                prereqName = prereqLevel?.title || 'Prior Level';
              }
            }

            const isMastered = progress?.status === 'mastered';
            const isCompleted = progress?.status === 'completed' || isMastered;

            return (
              <Card
                key={level.id}
                variant={isLocked ? 'default' : isCompleted ? 'raised' : 'interactive'}
                className={`flex flex-col justify-between ${isLocked ? 'opacity-70 bg-slate-50' : 'bg-white'}`}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-montserrat font-extrabold text-xs text-[#00C2D1]">
                        MISSION 0{level.num}
                      </span>
                      <Badge
                        variant={
                          isMastered ? 'success' : isCompleted ? 'accent' : isLocked ? 'neutral' : 'warning'
                        }
                        size="sm"
                        dot={!isLocked}
                      >
                        {isMastered ? 'Mastered' : isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Available'}
                      </Badge>
                    </div>

                    <span className="text-xs font-montserrat font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {level.estimatedMinutes} min
                    </span>
                  </div>

                  <CardTitle className="text-lg pt-1">{level.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {level.summary}
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
                      <Zap className="w-3.5 h-3.5 fill-current" /> +{level.xpReward} XP
                    </span>
                  </div>

                  {progress?.bestScore !== undefined && (
                    <div className="flex items-center justify-between py-2 px-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-900">
                      <span className="font-montserrat font-bold">Best Assessment Score:</span>
                      <span className="font-montserrat font-extrabold text-sm">{progress.bestScore}%</span>
                    </div>
                  )}

                  {isLocked && (
                    <div className="text-[11px] font-montserrat font-bold text-amber-800 flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200">
                      <Lock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>Prerequisite: Complete {prereqName} first</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-slate-50/80 p-4 border-t-2 border-slate-100">
                  <span className="text-[11px] font-montserrat font-bold text-slate-500">
                    {isCompleted ? `${progress?.attempts || 1} Attempt(s)` : 'Ready to start'}
                  </span>

                  <Button
                    size="sm"
                    variant={isLocked ? 'secondary' : isCompleted ? 'secondary' : 'primary'}
                    disabled={isLocked}
                    leftIcon={isCompleted ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    onClick={() => setBriefingLevel(level)}
                  >
                    {isCompleted ? 'REVISIT' : 'START MISSION'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {world.levels.length === 0 && (
          <div className="p-12 text-center rounded-3xl border-2 border-slate-200/90 bg-white space-y-3 shadow-sm">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-montserrat font-extrabold text-base text-[#0B1F2A]">Curriculum Module in Development</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              This world container is part of the roadmap progression. Complete Discovery Academy and Atomic Frontier to prepare.
            </p>
          </div>
        )}
      </section>

      {/* Mission Briefing Modal */}
      {briefingLevel && (
        <MissionBriefingModal
          level={briefingLevel}
          isOpen={!!briefingLevel}
          onClose={() => setBriefingLevel(null)}
          onLaunch={handleStartActivity}
        />
      )}

      {/* Interactive Activity & Assessment Player Modal */}
      {playingLevel && (
        <ActivityPlayerModal
          level={playingLevel}
          isOpen={!!playingLevel}
          onClose={() => setPlayingLevel(null)}
          onComplete={handleActivityComplete}
        />
      )}
    </div>
  );
};
