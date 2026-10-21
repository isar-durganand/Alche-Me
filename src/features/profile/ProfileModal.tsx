import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Lock, 
  FlaskConical, 
  Atom, 
  RotateCcw,
  User
} from 'lucide-react';
import { progressAdapter, PlayerProfile } from '../../infrastructure/persistence/progressAdapter';
import { ACHIEVEMENTS, ACTIVE_QUESTS } from '../../data/questsData';
import { Modal, Button, Badge, ProgressBar } from '../../components/ui';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToQuest?: (targetId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigateToQuest,
}) => {
  const [profile, setProfile] = useState<PlayerProfile>(progressAdapter.getPlayerProfile());

  useEffect(() => {
    return progressAdapter.subscribe(() => {
      setProfile(progressAdapter.getPlayerProfile());
    });
  }, []);

  const xpInCurrentLevel = profile.xp % 100;
  const xpNeededForNext = 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Scholar Profile & Mastery Ledger"
      description="Local achievements, experience points, and learning progression"
      size="md"
    >
      <div className="space-y-6 text-xs">
        {/* Profile Header Card */}
        <div className="p-4 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--cq-accent-subtle)] border border-[var(--cq-accent)]/40 flex items-center justify-center text-[var(--cq-accent)] font-bold text-lg">
              {profile.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[var(--cq-text)]">{profile.displayName}</h3>
                <Badge variant="accent" size="sm">Level {profile.level}</Badge>
              </div>
              <span className="text-xs text-[var(--cq-text-muted)]">
                Total XP: <span className="font-mono font-bold text-[var(--cq-accent)]">{profile.xp}</span>
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[var(--cq-text-muted)] block uppercase font-mono">Streak</span>
            <span className="font-bold text-sm text-[var(--cq-warning)] flex items-center justify-end gap-1">
              <Flame className="w-4 h-4 fill-[var(--cq-warning)]" />
              {profile.streakDays} Day(s)
            </span>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="space-y-1.5 p-3.5 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-bg)]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--cq-text-muted)]">Level {profile.level} Progress</span>
            <span className="font-mono text-[var(--cq-accent)]">{xpInCurrentLevel} / {xpNeededForNext} XP</span>
          </div>
          <ProgressBar value={xpInCurrentLevel} max={xpNeededForNext} variant="accent" size="sm" />
          <span className="text-[10px] text-[var(--cq-text-muted)] block text-right">
            {xpNeededForNext - xpInCurrentLevel} XP required for Level {profile.level + 1}
          </span>
        </div>

        {/* Active Quests */}
        <div className="space-y-2.5">
          <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-text)]">
            Active Study Quests
          </span>
          <div className="space-y-2">
            {ACTIVE_QUESTS.map((quest) => {
              const isCompleted = profile.completedActivities.includes(quest.targetContentId);
              return (
                <div
                  key={quest.id}
                  className="p-3 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[var(--cq-text)]">{quest.title}</span>
                      <Badge variant={isCompleted ? 'success' : 'neutral'} size="sm">
                        +{quest.xpReward} XP
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[var(--cq-text-muted)] leading-relaxed">
                      {quest.description}
                    </p>
                  </div>
                  <div>
                    {isCompleted ? (
                      <span className="text-[var(--cq-success)] text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Done
                      </span>
                    ) : (
                      <Badge variant="accent" size="sm">In Progress</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Earned Achievements */}
        <div className="space-y-2.5">
          <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-text)]">
            Earned Badges & Honors
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ACHIEVEMENTS.map((ach) => {
              const isEarned = profile.earnedAchievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                    isEarned
                      ? 'border-[var(--cq-accent)]/50 bg-[var(--cq-accent-subtle)] text-[var(--cq-text)]'
                      : 'border-[var(--cq-border)]/50 bg-[var(--cq-surface)] text-[var(--cq-text-muted)] opacity-60'
                  }`}
                >
                  <div className="p-2 rounded-md bg-black/20 shrink-0">
                    {isEarned ? (
                      <Award className="w-4 h-4 text-[var(--cq-accent)]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[var(--cq-text-muted)]" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-xs block">{ach.title}</span>
                    <p className="text-[10px] leading-tight text-[var(--cq-text-muted)]">
                      {ach.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button size="sm" variant="secondary" onClick={onClose}>
            Close Profile
          </Button>
        </div>
      </div>
    </Modal>
  );
};
