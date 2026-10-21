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
  Layers,
  Zap
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border-2 border-slate-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-[#00C2D1] mb-1">
            <Compass className="w-4 h-4" />
            <span>ALCHE-ME REALMS OVERVIEW</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-montserrat font-extrabold text-[#0B1F2A]">
            Scientific Adventure Worlds
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Journey through 6 thematic realms mapped directly to the MRIIRS Engineering Chemistry curriculum. Master atomic principles, laboratory safety, titrimetric analytics, and materials science.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="gold" size="lg">
            Scholar Lvl {profile.level} • {profile.xp} XP
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
              className={`flex flex-col justify-between relative overflow-hidden group ${
                isLocked ? 'opacity-80 bg-slate-50' : 'bg-white'
              }`}
              onClick={() => {
                if (!isLocked && totalLevels > 0) {
                  onSelectWorld(world);
                }
              }}
            >
              {/* World Illustration Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 border-b-2 border-slate-100">
                <img
                  src={world.thumbnail}
                  alt={world.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isLocked ? 'filter grayscale contrast-125' : 'group-hover:scale-105'
                  }`}
                />
                
                {/* Overlay Badge Header */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant={isLocked ? 'neutral' : completedCount === totalLevels && totalLevels > 0 ? 'success' : 'accent'}
                    size="sm"
                    dot={!isLocked}
                  >
                    {isLocked ? 'Locked' : completedCount === totalLevels && totalLevels > 0 ? 'Mastered' : `World 0${world.num}`}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-montserrat font-extrabold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                    {totalLevels} {totalLevels === 1 ? 'Mission' : 'Missions'}
                  </span>
                </div>

                {isLocked && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-slate-800 text-xs font-montserrat font-bold shadow-md">
                      <Lock className="w-4 h-4 text-amber-500" />
                      <span>PREREQUISITE LOCKED</span>
                    </div>
                  </div>
                )}
              </div>

              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-lg leading-tight">{world.title}</CardTitle>
                <CardDescription className="text-xs font-montserrat font-bold text-[#00C2D1]">
                  {world.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-1 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
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

              <CardFooter className="bg-slate-50/80 p-4 border-t-2 border-slate-100">
                <div className="text-[11px] font-montserrat font-bold text-slate-500">
                  {isLocked ? (
                    <span className="flex items-center gap-1 text-amber-700">
                      <Lock className="w-3.5 h-3.5" /> Complete prior world
                    </span>
                  ) : totalLevels > 0 ? (
                    <span>{completedCount} / {totalLevels} Missions Cleared</span>
                  ) : (
                    <span>Upcoming Expansion</span>
                  )}
                </div>

                <Button
                  size="sm"
                  variant={isLocked ? 'secondary' : 'primary'}
                  disabled={isLocked || totalLevels === 0}
                  rightIcon={!isLocked && totalLevels > 0 ? <ArrowRight className="w-4 h-4" /> : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLocked && totalLevels > 0) {
                      onSelectWorld(world);
                    }
                  }}
                >
                  {isLocked ? 'LOCKED' : totalLevels === 0 ? 'PREPARING' : 'ENTER WORLD'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
