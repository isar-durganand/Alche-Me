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
  User,
  Zap
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
      description="Achievements, experience points, and learning progression"
      size="md"
    >
      <div className="space-y-6 text-xs">
        {/* Profile Header Card */}
        <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-[#00C2D1] font-montserrat font-extrabold text-xl shadow-sm">
              {profile.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-montserrat font-bold text-base text-[#0B1F2A]">{profile.displayName}</h3>
                <Badge variant="accent" size="sm">Level {profile.level}</Badge>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Total XP: <span className="font-montserrat font-extrabold text-[#F5B942]">{profile.xp} XP</span>
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-montserrat font-bold">Daily Streak</span>
            <span className="font-montserrat font-extrabold text-sm text-orange-600 flex items-center justify-end gap-1">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
              {profile.streakDays} Day(s)
            </span>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="space-y-2 p-4 rounded-2xl border-2 border-slate-100 bg-white shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="font-montserrat font-bold text-slate-700">Level {profile.level} Progress</span>
            <span className="font-montserrat font-extrabold text-[#00C2D1]">{xpInCurrentLevel} / {xpNeededForNext} XP</span>
          </div>
          <ProgressBar value={xpInCurrentLevel} max={xpNeededForNext} variant="gold" size="md" />
          <span className="text-[10px] font-montserrat font-medium text-slate-400 block text-right">
            {xpNeededForNext - xpInCurrentLevel} XP required for Level {profile.level + 1}
          </span>
        </div>

        {/* Active Quests */}
        <div className="space-y-2.5">
          <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#0B1F2A]">
            Active Study Quests
          </span>
          <div className="space-y-2">
            {ACTIVE_QUESTS.map((quest) => {
              const isCompleted = profile.completedActivities.includes(quest.targetContentId);
              return (
                <div
                  key={quest.id}
                  className="p-3.5 rounded-xl border-2 border-slate-100 bg-white shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-montserrat font-bold text-xs text-[#0B1F2A]">{quest.title}</span>
                      <Badge variant={isCompleted ? 'success' : 'gold'} size="sm">
                        +{quest.xpReward} XP
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {quest.description}
                    </p>
                  </div>
                  <div>
                    {isCompleted ? (
                      <span className="text-emerald-600 text-xs font-montserrat font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Cleared
                      </span>
                    ) : (
                      <Badge variant="accent" size="sm">Active</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Earned Achievements */}
        <div className="space-y-2.5">
          <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#0B1F2A]">
            Earned Badges & Honors
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ACHIEVEMENTS.map((ach) => {
              const isEarned = profile.earnedAchievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-xl border-2 flex items-start gap-2.5 ${
                    isEarned
                      ? 'border-amber-200 bg-amber-50/50 text-[#0B1F2A] shadow-sm'
                      : 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isEarned ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-400'}`}>
                    {isEarned ? (
                      <Award className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-montserrat font-bold text-xs block">{ach.title}</span>
                    <p className="text-[10px] leading-tight text-slate-500">
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
            CLOSE PROFILE
          </Button>
        </div>
      </div>
    </Modal>
  );
};
