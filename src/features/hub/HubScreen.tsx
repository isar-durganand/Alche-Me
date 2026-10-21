import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  FlaskConical, 
  Atom, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  ShieldAlert,
  Flame,
  Award,
  Play,
  Zap,
  Star,
  ChevronRight
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, ProgressBar } from '../../components/ui';
import { CURRICULUM_WORLDS, CurriculumLevel } from '../../data/curriculumData';
import { progressAdapter, PlayerProfile } from '../../infrastructure/persistence/progressAdapter';
import { MissionBriefingModal } from '../progression/MissionBriefingModal';
import { ActivityPlayerModal } from '../progression/ActivityPlayerModal';

export interface HubScreenProps {
  onNavigate: (route: 'worlds' | 'periodic-table' | 'virtual-lab' | 'settings') => void;
}

export const HubScreen: React.FC<HubScreenProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<PlayerProfile>(progressAdapter.getPlayerProfile());
  const [allProgress, setAllProgress] = useState(progressAdapter.getAllProgress());
  const [briefingLevel, setBriefingLevel] = useState<CurriculumLevel | null>(null);
  const [playingLevel, setPlayingLevel] = useState<CurriculumLevel | null>(null);

  useEffect(() => {
    return progressAdapter.subscribe(() => {
      setProfile(progressAdapter.getPlayerProfile());
      setAllProgress(progressAdapter.getAllProgress());
    });
  }, []);

  // Find next playable level in Discovery Academy
  const discoveryWorld = CURRICULUM_WORLDS.find((w) => w.id === 'discovery-academy');
  const nextLevel = discoveryWorld?.levels.find((lvl) => {
    const status = allProgress[lvl.id]?.status;
    return status !== 'completed' && status !== 'mastered';
  }) || discoveryWorld?.levels[0];

  const nextLevelProgress = nextLevel ? allProgress[nextLevel.id] : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Game Banner */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(11,31,42,0.06)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#00C2D1] text-xs font-montserrat font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL CHEMISTRY ADVENTURE</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-extrabold tracking-tight text-[#0B1F2A] leading-tight">
              Welcome back, <span className="text-[#00C2D1]">{profile.displayName}!</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Embark on an authentic scientific odyssey. Master real laboratory apparatus safety, unlock the secrets of the 118 elements, and conquer engineering chemistry practicals with tactile interactive challenges.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button 
                variant="primary" 
                size="lg" 
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => onNavigate('worlds')}
              >
                ENTER WORLDS
              </Button>
              <Button 
                variant="gold" 
                size="lg" 
                leftIcon={<FlaskConical className="w-4 h-4" />}
                onClick={() => onNavigate('virtual-lab')}
              >
                VIRTUAL LAB (10)
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                leftIcon={<Atom className="w-4 h-4" />}
                onClick={() => onNavigate('periodic-table')}
              >
                PERIODIC TABLE
              </Button>
            </div>
          </div>

          {/* Hero Illustrated Artwork Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden border-2 border-slate-200/90 shadow-md">
              <img
                src="/assets/worlds/world-1.png"
                alt="Discovery Academy"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F2A]/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white">
                  <Badge variant="accent" size="sm" className="mb-1 bg-[#00C2D1] text-white border-0">
                    WORLD 01
                  </Badge>
                  <h3 className="font-montserrat font-extrabold text-base leading-tight">
                    Discovery Academy
                  </h3>
                  <p className="text-[11px] text-teal-100 font-medium">
                    Matter, Glassware & Laboratory Hygiene
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Quest / Mission Status & Scholar Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Active Mission Card */}
        <Card variant="raised" className="lg:col-span-2 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="accent" dot>Recommended Mission</Badge>
              <span className="text-xs font-montserrat font-bold text-slate-400">
                Course 4.5CH101C00H
              </span>
            </div>
            <CardTitle className="text-xl">
              {nextLevel ? `Mission 0${nextLevel.num}: ${nextLevel.title}` : 'All Missions Cleared!'}
            </CardTitle>
            <CardDescription className="text-sm">
              {nextLevel?.summary || 'You have mastered the foundational curriculum levels. Explore more in Adventure Worlds.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5">
            <ProgressBar 
              value={nextLevelProgress?.status === 'completed' || nextLevelProgress?.status === 'mastered' ? 100 : 0} 
              label="Mission Completion" 
              showPercentage 
              variant="accent" 
              size="md"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl border-2 border-slate-100 bg-slate-50/70">
                <span className="text-slate-500 block text-[11px] font-medium">Difficulty Level</span>
                <span className="font-montserrat font-extrabold text-sm capitalize text-[#0B1F2A]">
                  {nextLevel?.difficulty || 'Foundation'}
                </span>
              </div>
              <div className="p-3 rounded-xl border-2 border-slate-100 bg-amber-50/50">
                <span className="text-amber-700 block text-[11px] font-medium">Clearance Reward</span>
                <span className="font-montserrat font-extrabold text-sm text-amber-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" /> +{nextLevel?.xpReward || 100} XP
                </span>
              </div>
              <div className="p-3 rounded-xl border-2 border-slate-100 bg-slate-50/70">
                <span className="text-slate-500 block text-[11px] font-medium">Estimated Time</span>
                <span className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">
                  {nextLevel?.estimatedMinutes || 5} Mins
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50/60 p-5">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-montserrat font-bold text-xs text-slate-500">
                {nextLevelProgress?.status === 'completed' || nextLevelProgress?.status === 'mastered'
                  ? `Completed (Best Score: ${nextLevelProgress.bestScore}%)`
                  : 'Ready to launch'}
              </span>
            </div>
            {nextLevel && (
              <Button 
                size="md" 
                variant="primary" 
                rightIcon={<Play className="w-4 h-4 fill-current" />} 
                onClick={() => setBriefingLevel(nextLevel)}
              >
                {nextLevelProgress ? 'REPLAY MISSION' : 'PLAY MISSION'}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Player Mastery Bento Card */}
        <Card variant="raised" className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Scholar Record</CardTitle>
              <Badge variant="gold" size="sm">Level {profile.level}</Badge>
            </div>
            <CardDescription>Progress stats & active accomplishments</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-montserrat font-bold">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Total XP Earned</span>
              </div>
              <span className="font-montserrat font-extrabold text-sm text-amber-900">{profile.xp} XP</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/60 border border-orange-200/80">
              <div className="flex items-center gap-2 text-orange-900 font-montserrat font-bold">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span>Daily Streak</span>
              </div>
              <span className="font-montserrat font-extrabold text-sm text-orange-900">{profile.streakDays} Days</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/60 border border-teal-200/80">
              <div className="flex items-center gap-2 text-teal-900 font-montserrat font-bold">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Completed Missions</span>
              </div>
              <span className="font-montserrat font-extrabold text-sm text-teal-900">{profile.completedActivities.length} Modules</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
              <div className="flex items-center gap-2 text-emerald-900 font-montserrat font-bold">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Earned Badges</span>
              </div>
              <span className="font-montserrat font-extrabold text-sm text-emerald-900">{profile.earnedAchievements.length} Badges</span>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50/60 p-4">
            <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => onNavigate('worlds')}>
              VIEW ALL 6 WORLDS
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Six Scientific Worlds Grid with Real Sliced Artwork */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-montserrat font-extrabold text-[#0B1F2A] flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-[#00C2D1]" />
              Adventure Worlds
            </h2>
            <p className="text-xs text-slate-500">
              Explore 6 curriculum realms spanning foundational atomic structure to engineering practicals
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onNavigate('worlds')}>
            VIEW FULL MAP
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURRICULUM_WORLDS.map((world) => {
            const completedCount = world.levels.filter(
              (lvl) => allProgress[lvl.id]?.status === 'completed' || allProgress[lvl.id]?.status === 'mastered'
            ).length;
            const isLocked = world.prerequisiteWorldId ? (allProgress['da-lvl-2']?.status !== 'completed' && allProgress['da-lvl-2']?.status !== 'mastered') : false;

            return (
              <Card 
                key={world.id} 
                variant="interactive" 
                className={`flex flex-col justify-between overflow-hidden ${isLocked ? 'opacity-75' : ''}`}
                onClick={() => !isLocked && onNavigate('worlds')}
              >
                {/* World Image Header */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100 border-b-2 border-slate-100">
                  <img
                    src={world.thumbnail}
                    alt={world.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={isLocked ? 'neutral' : completedCount > 0 ? 'success' : 'accent'} size="sm">
                      {isLocked ? 'Locked' : `World 0${world.num}`}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-montserrat font-extrabold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                      {world.levels.length} {world.levels.length === 1 ? 'Mission' : 'Missions'}
                    </span>
                  </div>
                </div>

                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{world.title}</CardTitle>
                  <CardDescription className="text-xs font-montserrat font-bold text-[#00C2D1]">
                    {world.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {world.summary}
                  </p>
                </CardContent>

                <CardFooter className="bg-slate-50/80 p-4">
                  <span className="font-montserrat font-bold text-[11px] text-slate-500">
                    {world.levels.length > 0 ? `${completedCount} / ${world.levels.length} Cleared` : 'Expansion Realm'}
                  </span>
                  <Button 
                    size="sm" 
                    variant={isLocked ? 'ghost' : 'primary'}
                    disabled={isLocked || world.levels.length === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLocked) onNavigate('worlds');
                    }}
                  >
                    {isLocked ? 'LOCKED' : 'ENTER'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Briefing Modal */}
      {briefingLevel && (
        <MissionBriefingModal
          level={briefingLevel}
          isOpen={!!briefingLevel}
          onClose={() => setBriefingLevel(null)}
          onLaunch={(lvl) => {
            setBriefingLevel(null);
            setPlayingLevel(lvl);
          }}
        />
      )}

      {/* Activity Player Modal */}
      {playingLevel && (
        <ActivityPlayerModal
          level={playingLevel}
          isOpen={!!playingLevel}
          onClose={() => setPlayingLevel(null)}
          onComplete={() => setPlayingLevel(null)}
        />
      )}
    </div>
  );
};
