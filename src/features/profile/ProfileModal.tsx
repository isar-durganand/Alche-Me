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
  Zap,
  Check,
  Edit3,
  Dices,
  Palette
} from 'lucide-react';
import { progressAdapter, PlayerProfile } from '../../infrastructure/persistence/progressAdapter';
import { ACHIEVEMENTS, ACTIVE_QUESTS } from '../../data/questsData';
import { Modal, Button, Badge, ProgressBar } from '../../components/ui';
import { soundEngine } from '../../infrastructure/audio/soundEngine';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToQuest?: (targetId: string) => void;
}

const AVATAR_OPTIONS = [
  { emoji: '🧪', name: 'Master Alchemist' },
  { emoji: '🔬', name: 'Deep Microscopist' },
  { emoji: '⚛️', name: 'Quantum Explorer' },
  { emoji: '🧙‍♂️', name: 'Chemical Wizard' },
  { emoji: '🤖', name: 'Lab Android' },
  { emoji: '💎', name: 'Crystal Sage' },
  { emoji: '🔥', name: 'Pyromancer' },
  { emoji: '⚡', name: 'Plasma Spark' },
  { emoji: '🌿', name: 'Bio Synthesizer' },
  { emoji: '🧊', name: 'Cryo Crafter' },
  { emoji: '🪐', name: 'Cosmic Chemist' },
  { emoji: '🌟', name: 'Star Scholar' },
  { emoji: '🦊', name: 'Lab Fox' },
  { emoji: '🦉', name: 'Science Owl' },
  { emoji: '🐱', name: 'Quantum Cat' },
  { emoji: '🚀', name: 'Rocket Chemist' },
];

const COLOR_THEMES = [
  { id: 'teal', label: 'Teal', bg: 'bg-teal-50 border-teal-300 text-teal-700', activeRing: 'ring-teal-500' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-50 border-cyan-300 text-cyan-700', activeRing: 'ring-cyan-500' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-50 border-amber-300 text-amber-700', activeRing: 'ring-amber-500' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-50 border-emerald-300 text-emerald-700', activeRing: 'ring-emerald-500' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-50 border-purple-300 text-purple-700', activeRing: 'ring-purple-500' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-50 border-rose-300 text-rose-700', activeRing: 'ring-rose-500' },
];

const FUN_NAMES = [
  'Apprentice Chemist',
  'Professor Spark',
  'Quantum Voyager',
  'Element Hunter',
  'Reaction Wizard',
  'Curious Alchemist',
  'Dr. Beaker',
  'Atomic Explorer',
  'Molecule Architect',
  'Catalyst Champion'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigateToQuest,
}) => {
  const [profile, setProfile] = useState<PlayerProfile>(progressAdapter.getPlayerProfile());
  const [activeTab, setActiveTab] = useState<'identity' | 'achievements'>('identity');
  
  // Editable fields
  const [nameInput, setNameInput] = useState<string>(profile.displayName || 'Apprentice Chemist');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile.avatar || '🧪');
  const [selectedColor, setSelectedColor] = useState<string>(profile.avatarColor || 'teal');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    return progressAdapter.subscribe(() => {
      const p = progressAdapter.getPlayerProfile();
      setProfile(p);
      setNameInput(p.displayName || 'Apprentice Chemist');
      setSelectedAvatar(p.avatar || '🧪');
      setSelectedColor(p.avatarColor || 'teal');
    });
  }, []);

  const handleRandomizeName = () => {
    soundEngine.playTap();
    const random = FUN_NAMES[Math.floor(Math.random() * FUN_NAMES.length)];
    setNameInput(random);
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;

    soundEngine.playVictory();
    progressAdapter.updatePlayerProfile({
      displayName: trimmed,
      avatar: selectedAvatar,
      avatarColor: selectedColor,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const xpInCurrentLevel = profile.xp % 100;
  const xpNeededForNext = 100;

  const activeThemeObj = COLOR_THEMES.find((c) => c.id === selectedColor) || COLOR_THEMES[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Scholar Profile & Customization"
      description="Personalize your identity, choose your avatar, and track achievements"
      size="lg"
    >
      <div className="space-y-5 text-xs">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 pb-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setActiveTab('identity');
            }}
            className={`px-3 py-1.5 rounded-xl font-montserrat font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'identity'
                ? 'bg-[#00C2D1] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Identity & Avatar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setActiveTab('achievements');
            }}
            className={`px-3 py-1.5 rounded-xl font-montserrat font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-[#00C2D1] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Badges & Quests ({profile.earnedAchievements.length})</span>
          </button>
        </div>

        {/* TAB 1: IDENTITY & AVATAR EDITOR */}
        {activeTab === 'identity' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Live Profile Card Preview */}
            <div className="p-4 rounded-3xl border-2 border-slate-200 bg-gradient-to-r from-slate-50 via-teal-50/30 to-amber-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                {/* Selected Avatar with Selected Color */}
                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl shadow-sm shrink-0 transition-all ${activeThemeObj.bg}`}>
                  {selectedAvatar}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-[#0B1F2A]">
                      {nameInput || 'Anonymous Chemist'}
                    </h3>
                    <Badge variant="accent" size="sm">Level {profile.level}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-montserrat font-bold text-slate-500">
                      Total XP: <span className="text-[#F5B942] font-black">{profile.xp} XP</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-montserrat font-bold text-orange-600 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {profile.streakDays} Day Streak
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Status indicator */}
              <div className="flex items-center gap-2 sm:self-center">
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-montserrat font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Scholar
                </span>
              </div>
            </div>

            {/* Name Input & Customization Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4 p-4 rounded-2xl border-2 border-slate-100 bg-white shadow-xs">
              <div>
                <label className="block text-xs font-montserrat font-extrabold text-[#0B1F2A] uppercase tracking-wider mb-1.5">
                  Your Scholar Display Name
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={32}
                      placeholder="Enter your name..."
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#00C2D1] focus:outline-hidden font-montserrat font-bold text-sm text-[#0B1F2A] bg-slate-50/50 transition-colors"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-400">
                      {nameInput.length}/32
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleRandomizeName}
                    title="Generate fun random chemistry name"
                    className="p-2.5 rounded-xl border-2 border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-slate-700 transition-all cursor-pointer shrink-0"
                  >
                    <Dices className="w-4 h-4 text-teal-600" />
                  </button>
                </div>
              </div>

              {/* Avatar Selector Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-montserrat font-extrabold text-[#0B1F2A] uppercase tracking-wider">
                  Choose Your Character Avatar
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {AVATAR_OPTIONS.map((av) => {
                    const isSelected = selectedAvatar === av.emoji;
                    return (
                      <button
                        key={av.emoji}
                        type="button"
                        onClick={() => {
                          soundEngine.playTap();
                          setSelectedAvatar(av.emoji);
                        }}
                        title={av.name}
                        className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer border-2 ${
                          isSelected
                            ? 'border-[#00C2D1] bg-teal-50 shadow-md scale-105'
                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {av.emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Theme Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-montserrat font-extrabold text-[#0B1F2A] uppercase tracking-wider">
                  Avatar Aura Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_THEMES.map((theme) => {
                    const isSelected = selectedColor === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playTap();
                          setSelectedColor(theme.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl border-2 text-xs font-montserrat font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? `${theme.bg} shadow-xs font-extrabold ring-2 ${theme.activeRing}`
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${theme.bg.split(' ')[0]} border border-current`} />
                        <span>{theme.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex items-center justify-between">
                {savedSuccess ? (
                  <span className="text-emerald-600 font-montserrat font-bold text-xs flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Changes save directly to your scholar profile.
                  </span>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  className="font-montserrat font-bold cursor-pointer"
                >
                  SAVE IDENTITY
                </Button>
              </div>
            </form>

            {/* Level Progress Indicator */}
            <div className="space-y-2 p-4 rounded-2xl border-2 border-slate-100 bg-white shadow-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-montserrat font-bold text-slate-700">Level {profile.level} Progress</span>
                <span className="font-montserrat font-extrabold text-[#00C2D1]">{xpInCurrentLevel} / {xpNeededForNext} XP</span>
              </div>
              <ProgressBar value={xpInCurrentLevel} max={xpNeededForNext} variant="gold" size="md" />
              <span className="text-[10px] font-montserrat font-medium text-slate-400 block text-right">
                {xpNeededForNext - xpInCurrentLevel} XP required for Level {profile.level + 1}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: ACHIEVEMENTS & QUESTS */}
        {activeTab === 'achievements' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Active Quests */}
            <div className="space-y-2.5">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#0B1F2A]">
                Active Curriculum Quests
              </span>
              <div className="space-y-2">
                {ACTIVE_QUESTS.map((quest) => {
                  const isCompleted = profile.completedActivities.includes(quest.targetContentId);
                  return (
                    <div
                      key={quest.id}
                      className="p-3.5 rounded-2xl border-2 border-slate-100 bg-white shadow-xs flex items-center justify-between gap-3"
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
                      className={`p-3.5 rounded-2xl border-2 flex items-start gap-2.5 ${
                        isEarned
                          ? 'border-amber-200 bg-amber-50/50 text-[#0B1F2A] shadow-xs'
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
          </div>
        )}

        <div className="pt-2 flex justify-end border-t border-slate-100">
          <Button size="sm" variant="secondary" onClick={onClose} className="font-montserrat font-bold">
            CLOSE PROFILE
          </Button>
        </div>
      </div>
    </Modal>
  );
};
