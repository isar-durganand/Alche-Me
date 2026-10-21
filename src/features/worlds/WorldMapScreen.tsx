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
import { CURRICULUM_WORLDS } from '../../data/curriculumData';
import { WorldSchema } from '../../domain/types/curriculum';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button, ProgressBar } from '../../components/ui';

export interface WorldMapScreenProps {
  onSelectWorld: (world: WorldSchema) => void;
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
            <span>ALCHE-ME 8-WORLD CURRICULUM MAP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-montserrat font-extrabold text-[#0B1F2A]">
            Scientific Adventure Worlds
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Explore 8 explorable worlds and 56 progressive levels taking you from absolute beginner observations to advanced problem solving, laboratory analysis, and engineering chemistry.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="gold" size="lg">
            Scholar Lvl {profile.level} • {profile.xp} XP
          </Badge>
        </div>
      </div>

      {/* World Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CURRICULUM_WORLDS.map((world) => {
          // Check if world is unlocked
          let isLocked = false;
          let prereqWorldName = '';

          if (world.prerequisiteWorldId) {
            const prereqWorld = CURRICULUM_WORLDS.find((w) => w.id === world.prerequisiteWorldId);
            if (prereqWorld) {
              prereqWorldName = prereqWorld.title;
              // If world specifies an unlockLevelId, check that specific level
              if (world.unlockLevelId) {
                const unlockProg = allProgress[world.unlockLevelId];
                isLocked = !(unlockProg?.status === 'completed' || unlockProg?.status === 'mastered');
              } else if (prereqWorld.levels.length > 0) {
                // Otherwise check if first level or all implemented levels of prereq world are done
                const implementedLevels = prereqWorld.levels.filter(l => l.implementationStatus === 'fully_implemented');
                if (implementedLevels.length > 0) {
                  const allDone = implementedLevels.every(
                    (lvl) => allProgress[lvl.id]?.status === 'completed' || allProgress[lvl.id]?.status === 'mastered'
                  );
                  isLocked = !allDone;
                }
              }
            }
          }

          // Count completed levels
          const completedCount = world.levels.filter(
            (lvl) => allProgress[lvl.id]?.status === 'completed' || allProgress[lvl.id]?.status === 'mastered'
          ).length;

          const totalLevels = world.levels.length;
          const progressPercent = totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0;
          const isMastered = completedCount === totalLevels && totalLevels > 0;

          return (
            <Card
              key={world.id}
              variant={isLocked ? 'default' : 'interactive'}
              className={`flex flex-col justify-between relative overflow-hidden group ${
                isLocked ? 'opacity-80 bg-slate-50' : 'bg-white'
              }`}
              onClick={() => {
                if (!isLocked) {
                  onSelectWorld(world);
                }
              }}
            >
              {/* World Illustration Banner */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100 border-b-2 border-slate-100">
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
                    variant={isLocked ? 'neutral' : isMastered ? 'success' : 'accent'}
                    size="sm"
                    dot={!isLocked}
                  >
                    {isLocked ? 'Locked' : isMastered ? 'Mastered' : `World 0${world.num}`}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-montserrat font-extrabold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                    {totalLevels} Missions
                  </span>
                </div>

                {isLocked && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-montserrat font-bold shadow-md">
                      <Lock className="w-4 h-4 text-amber-500" />
                      <span>PREREQUISITE LOCKED</span>
                    </div>
                  </div>
                )}
              </div>

              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base leading-tight">{world.title}</CardTitle>
                <CardDescription className="text-xs font-montserrat font-bold text-[#00C2D1] line-clamp-1">
                  {world.theme}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {world.worldOutcome}
                </p>

                {totalLevels > 0 && !isLocked && (
                  <ProgressBar
                    value={progressPercent}
                    label="World Mastery"
                    showPercentage
                    size="sm"
                    variant={isMastered ? 'success' : 'accent'}
                  />
                )}
              </CardContent>

              <CardFooter className="bg-slate-50/80 p-3.5 border-t-2 border-slate-100">
                <div className="text-[10px] font-montserrat font-bold text-slate-500 truncate max-w-[120px]">
                  {isLocked ? (
                    <span className="text-amber-800 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Clear {prereqWorldName.split(' ')[0]}
                    </span>
                  ) : (
                    <span>{completedCount} / {totalLevels} Cleared</span>
                  )}
                </div>

                <Button
                  size="sm"
                  variant={isLocked ? 'secondary' : 'primary'}
                  disabled={isLocked}
                  rightIcon={!isLocked ? <ArrowRight className="w-3.5 h-3.5" /> : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLocked) {
                      onSelectWorld(world);
                    }
                  }}
                >
                  {isLocked ? 'LOCKED' : 'ENTER'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
