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
  Sparkles
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
          variant="ghost"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
          className="text-xs"
        >
          Back to Worlds Map
        </Button>

        <div className="p-6 rounded-2xl border border-[var(--cq-border)] bg-[var(--cq-surface)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--cq-border)]/60">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="sm">World 0{world.num}</Badge>
                <span className="text-xs font-mono text-[var(--cq-text-muted)]">
                  {completedCount} of {world.levels.length} Cleared
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--cq-text)] mt-1">
                {world.title}
              </h1>
              <p className="text-sm font-semibold text-[var(--cq-accent)]">
                {world.subtitle}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--cq-text-muted)] leading-relaxed max-w-4xl">
            {world.summary}
          </p>

          {world.levels.length > 0 && (
            <ProgressBar
              value={Math.round((completedCount / world.levels.length) * 100)}
              label="Curriculum World Completion"
              showPercentage
              variant="accent"
              size="md"
            />
          )}
        </div>
      </div>

      {/* Level / Mission Nodes Sequence */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--cq-text)] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--cq-accent)]" />
          Mission Progression Sequence
        </h2>

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
                className={`flex flex-col justify-between ${isLocked ? 'opacity-65' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--cq-accent)]">
                        Mission 0{level.num}
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

                    <span className="text-xs font-mono text-[var(--cq-text-muted)] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {level.estimatedMinutes} min
                    </span>
                  </div>

                  <CardTitle className="text-base pt-1">{level.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {level.summary}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 px-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface)]">
                    <span className="text-[var(--cq-text-muted)]">Difficulty Level:</span>
                    <span className="font-semibold capitalize text-[var(--cq-text)]">{level.difficulty}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 px-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface)]">
                    <span className="text-[var(--cq-text-muted)]">Completion Reward:</span>
                    <span className="font-mono font-bold text-[var(--cq-accent)]">+{level.xpReward} XP</span>
                  </div>

                  {progress?.bestScore !== undefined && (
                    <div className="flex items-center justify-between py-1.5 px-3 rounded-lg border border-[var(--cq-success)]/40 bg-[var(--cq-success-subtle)] text-[var(--cq-success)]">
                      <span className="font-semibold">Best Assessment Score:</span>
                      <span className="font-mono font-bold text-sm">{progress.bestScore}%</span>
                    </div>
                  )}

                  {isLocked && (
                    <div className="text-[11px] text-[var(--cq-warning)] flex items-center gap-1.5 p-2 rounded-lg bg-[var(--cq-warning-subtle)] border border-[var(--cq-warning)]/30">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Prerequisite: Complete {prereqName} first</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <span className="text-[11px] text-[var(--cq-text-muted)]">
                    {isCompleted ? `${progress?.attempts || 1} Attempt(s)` : 'Not yet attempted'}
                  </span>

                  <Button
                    size="sm"
                    variant={isLocked ? 'ghost' : isCompleted ? 'outline' : 'primary'}
                    disabled={isLocked}
                    leftIcon={isCompleted ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    onClick={() => setBriefingLevel(level)}
                  >
                    {isCompleted ? 'Revisit Mission' : 'Briefing & Launch'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {world.levels.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-[var(--cq-border)] bg-[var(--cq-surface)] space-y-3">
            <Sparkles className="w-10 h-10 text-[var(--cq-text-muted)] mx-auto opacity-50" />
            <h3 className="font-semibold text-base text-[var(--cq-text)]">Curriculum Module in Development</h3>
            <p className="text-xs text-[var(--cq-text-muted)] max-w-sm mx-auto">
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
