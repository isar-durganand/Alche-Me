import React from 'react';
import { 
  Compass, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Atom, 
  FlaskConical, 
  Flame, 
  Layers 
} from 'lucide-react';
import { CURRICULUM_WORLDS, CurriculumWorld } from '../../data/curriculumData';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button, ProgressBar } from '../../components/ui';

export interface WorldMapScreenProps {
  onSelectWorld: (world: CurriculumWorld) => void;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({ onSelectWorld }) => {
  const profile = progressAdapter.getPlayerProfile();
  const allProgress = progressAdapter.getAllProgress();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--cq-text)] flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-[var(--cq-accent)]" />
            Adventure World Selection
          </h1>
          <p className="text-xs text-[var(--cq-text-muted)]">
            Explore 6 thematic realms spanning foundational atomic structure to engineering tribology and synthesis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="md">
            Scholar Level {profile.level} • {profile.xp} XP
          </Badge>
        </div>
      </div>

      {/* World Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CURRICULUM_WORLDS.map((world) => {
          // Check if world is unlocked
          let isLocked = false;
          if (world.prerequisiteWorldId) {
            const prereqWorld = CURRICULUM_WORLDS.find((w) => w.id === world.prerequisiteWorldId);
            if (prereqWorld && prereqWorld.levels.length > 0) {
              const allPrereqCompleted = prereqWorld.levels.every(
                (lvl) => allProgress[lvl.id]?.status === 'completed' || allProgress[lvl.id]?.status === 'mastered'
              );
              isLocked = !allPrereqCompleted;
            }
          }

          // Count completed levels
          const completedCount = world.levels.filter(
            (lvl) => allProgress[lvl.id]?.status === 'completed' || allProgress[lvl.id]?.status === 'mastered'
          ).length;

          const totalLevels = world.levels.length;
          const progressPercent = totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0;

          return (
            <Card
              key={world.id}
              variant={isLocked ? 'default' : 'interactive'}
              className={`flex flex-col justify-between relative overflow-hidden ${
                isLocked ? 'opacity-70 grayscale-[20%]' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={isLocked ? 'neutral' : completedCount === totalLevels && totalLevels > 0 ? 'success' : 'accent'}
                    size="sm"
                    dot={!isLocked}
                  >
                    {isLocked ? 'Locked' : completedCount === totalLevels && totalLevels > 0 ? 'Mastered' : `World 0${world.num}`}
                  </Badge>
                  <span className="text-xs font-mono text-[var(--cq-text-muted)]">
                    {totalLevels} {totalLevels === 1 ? 'Mission' : 'Missions'}
                  </span>
                </div>
                <CardTitle className="text-lg pt-1">{world.title}</CardTitle>
                <CardDescription className="text-xs font-medium text-[var(--cq-accent)]">
                  {world.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-[var(--cq-text-muted)] leading-relaxed line-clamp-3">
                  {world.summary}
                </p>

                {totalLevels > 0 && !isLocked && (
                  <ProgressBar
                    value={progressPercent}
                    label="World Mastery"
                    showPercentage
                    size="sm"
                    variant={completedCount === totalLevels ? 'success' : 'accent'}
                  />
                )}
              </CardContent>

              <CardFooter>
                <div className="text-[11px] text-[var(--cq-text-muted)]">
                  {isLocked ? (
                    <span className="flex items-center gap-1 text-[var(--cq-warning)]">
                      <Lock className="w-3.5 h-3.5" /> Prerequisite Required
                    </span>
                  ) : totalLevels > 0 ? (
                    <span>{completedCount} / {totalLevels} Cleared</span>
                  ) : (
                    <span>Upcoming Expansion</span>
                  )}
                </div>

                <Button
                  size="sm"
                  variant={isLocked ? 'ghost' : 'primary'}
                  disabled={isLocked || totalLevels === 0}
                  rightIcon={!isLocked && totalLevels > 0 ? <ArrowRight className="w-4 h-4" /> : undefined}
                  onClick={() => onSelectWorld(world)}
                >
                  {isLocked ? 'Locked' : totalLevels === 0 ? 'In Preparation' : 'Enter World'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
