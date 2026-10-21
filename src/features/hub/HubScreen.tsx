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
  Play
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
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--cq-border)] bg-[var(--cq-surface)] p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--cq-accent-subtle)] border border-[var(--cq-accent)]/30 text-[var(--cq-accent)] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 03 — Core Game UI & Progression Loop Active
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--cq-text)]">
            Welcome, <span className="text-[var(--cq-accent)]">{profile.displayName}</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--cq-text-muted)] leading-relaxed">
            Begin your journey through structured chemistry worlds. Master laboratory apparatus safety, discover Mendeleev periodic patterns, and simulate engineering titrations backed by deterministic progression and local save state.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button 
              variant="primary" 
              size="md" 
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('worlds')}
            >
              Explore Adventure Worlds
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              leftIcon={<FlaskConical className="w-4 h-4" />}
              onClick={() => onNavigate('virtual-lab')}
            >
              Virtual Laboratory (10 Practicals)
            </Button>
            <Button 
              variant="outline" 
              size="md" 
              leftIcon={<Atom className="w-4 h-4" />}
              onClick={() => onNavigate('periodic-table')}
            >
              Periodic Table Explorer
            </Button>
          </div>
        </div>
      </section>

      {/* Active Quest / Mission Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="raised" className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="accent" dot>Recommended Next Mission</Badge>
              <span className="text-xs font-mono text-[var(--cq-text-muted)]">Course 4.5CH101C00H</span>
            </div>
            <CardTitle>{nextLevel ? `Mission 0${nextLevel.num}: ${nextLevel.title}` : 'Curriculum Cleared!'}</CardTitle>
            <CardDescription>
              {nextLevel?.summary || 'You have mastered the foundational curriculum levels. Explore more in Adventure Worlds.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar 
              value={nextLevelProgress?.status === 'completed' || nextLevelProgress?.status === 'mastered' ? 100 : 0} 
              label="Mission Status" 
              showPercentage 
              variant="accent" 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-2.5 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface)]">
                <span className="text-[var(--cq-text-muted)] block text-[11px]">Difficulty</span>
                <span className="font-semibold capitalize text-[var(--cq-text)]">{nextLevel?.difficulty || 'Foundation'}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface)]">
                <span className="text-[var(--cq-text-muted)] block text-[11px]">Completion Reward</span>
                <span className="font-semibold font-mono text-[var(--cq-accent)]">+{nextLevel?.xpReward || 100} XP</span>
              </div>
              <div className="p-2.5 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface)]">
                <span className="text-[var(--cq-text-muted)] block text-[11px]">Estimated Time</span>
                <span className="font-semibold text-[var(--cq-text)]">{nextLevel?.estimatedMinutes || 5} Minutes</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <span className="text-[var(--cq-text-muted)]">
              {nextLevelProgress?.status === 'completed' || nextLevelProgress?.status === 'mastered'
                ? `Completed (Best Score: ${nextLevelProgress.bestScore}%)`
                : 'Ready to launch'}
            </span>
            {nextLevel && (
              <Button size="sm" variant="primary" rightIcon={<Play className="w-3.5 h-3.5" />} onClick={() => setBriefingLevel(nextLevel)}>
                {nextLevelProgress ? 'Replay Mission' : 'Begin Mission'}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Player Mastery Status Card */}
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Scholar Ledger</CardTitle>
              <Badge variant="success" size="sm">Level {profile.level}</Badge>
            </div>
            <CardDescription>Deterministic progression & XP rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[var(--cq-border)]/50">
              <span className="text-[var(--cq-text-muted)]">Experience Points</span>
              <span className="font-mono font-bold text-[var(--cq-accent)]">{profile.xp} XP</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--cq-border)]/50">
              <span className="text-[var(--cq-text-muted)]">Completed Activities</span>
              <span className="font-semibold text-[var(--cq-text)]">{profile.completedActivities.length} Modules</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--cq-border)]/50">
              <span className="text-[var(--cq-text-muted)]">Earned Badges</span>
              <span className="font-semibold text-[var(--cq-text)]">{profile.earnedAchievements.length} Badges</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--cq-text-muted)]">Save Engine</span>
              <span className="text-[var(--cq-success)] font-medium">Local-First (Offline Safe)</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="ghost" className="w-full text-xs" onClick={() => onNavigate('worlds')}>
              View All 6 Adventure Worlds
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Six Scientific Worlds Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--cq-text)] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[var(--cq-accent)]" />
              Adventure Worlds
            </h2>
            <p className="text-xs text-[var(--cq-text-muted)]">
              Curriculum-mapped containers guiding progression from fundamentals to Capstone Engineering Practicals
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('worlds')}>
            Open Map
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURRICULUM_WORLDS.map((world) => {
            const completedCount = world.levels.filter(
              (lvl) => allProgress[lvl.id]?.status === 'completed' || allProgress[lvl.id]?.status === 'mastered'
            ).length;
            const isLocked = world.prerequisiteWorldId ? (allProgress['da-lvl-2']?.status !== 'completed' && allProgress['da-lvl-2']?.status !== 'mastered') : false;

            return (
              <Card key={world.id} variant="interactive" className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={isLocked ? 'neutral' : completedCount > 0 ? 'success' : 'accent'} size="sm">
                      {isLocked ? 'Locked' : `World 0${world.num}`}
                    </Badge>
                    <span className="text-xs font-mono text-[var(--cq-text-muted)]">
                      {world.levels.length} Missions
                    </span>
                  </div>
                  <CardTitle className="text-base pt-1">{world.title}</CardTitle>
                  <CardDescription className="text-xs font-medium text-[var(--cq-accent)]">
                    {world.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-[var(--cq-text-muted)] leading-relaxed line-clamp-2">
                    {world.summary}
                  </p>
                </CardContent>
                <CardFooter>
                  <span className="text-[11px] text-[var(--cq-text-muted)]">
                    {world.levels.length > 0 ? `${completedCount} / ${world.levels.length} Cleared` : 'Expansion Planned'}
                  </span>
                  <Button 
                    size="sm" 
                    variant={isLocked ? 'ghost' : 'outline'}
                    disabled={isLocked || world.levels.length === 0}
                    onClick={() => onNavigate('worlds')}
                  >
                    {isLocked ? 'Locked' : 'Open World'}
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
