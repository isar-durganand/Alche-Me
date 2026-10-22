/**
 * Alche-Me — Local-First Progression & Save State Adapter
 * Implements isolated persistence behind a clean interface per Master Spec Section 12 & 14.
 * Features safe in-memory fallback for Node.js / SSR / testing environments.
 */

import { ActivityStatus, ProgressRecord } from '../../domain/types';

export interface PlayerProfile {
  id: string;
  displayName: string;
  level: number;
  xp: number;
  streakDays: number;
  completedActivities: string[];
  earnedAchievements: string[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEYS = {
  PROFILE: 'alche_me_player_profile_v1',
  PROGRESS: 'alche_me_progress_records_v1',
  ACHIEVEMENTS: 'alche_me_achievements_v1',
};

const DEFAULT_PROFILE: PlayerProfile = {
  id: 'guest-scholar',
  displayName: 'Apprentice Chemist',
  level: 1,
  xp: 0,
  streakDays: 1,
  completedActivities: [],
  earnedAchievements: ['initiate'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// In-memory fallback store for Node/test environments
const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {
    // fallback
  }
  return memoryStore[key] || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch {
    // fallback
  }
  memoryStore[key] = value;
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch {
    // fallback
  }
  delete memoryStore[key];
}

type ProgressChangeListener = () => void;
const listeners: Set<ProgressChangeListener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error notifying progress listener', e);
    }
  });
}

export const progressAdapter = {
  subscribe(listener: ProgressChangeListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getPlayerProfile(): PlayerProfile {
    try {
      const stored = safeGetItem(STORAGE_KEYS.PROFILE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback if corrupted
    }
    return { ...DEFAULT_PROFILE };
  },

  savePlayerProfile(profile: PlayerProfile): void {
    try {
      safeSetItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      notifyListeners();
    } catch (e) {
      console.error('Failed to save player profile', e);
    }
  },

  getAllProgress(): Record<string, ProgressRecord> {
    try {
      const stored = safeGetItem(STORAGE_KEYS.PROGRESS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {};
  },

  getProgress(contentId: string): ProgressRecord | null {
    const all = this.getAllProgress();
    return all[contentId] || null;
  },

  /**
   * Complete an activity, update score, award XP, compute player level, and notify subscribers.
   */
  completeActivity(contentId: string, score: number, xpReward: number): ProgressRecord {
    const all = this.getAllProgress();
    const existing = all[contentId];
    const now = new Date().toISOString();

    const isMastered = score >= 90;
    const newStatus: ActivityStatus = isMastered ? 'mastered' : 'completed';
    const isFirstCompletion =
      !existing ||
      existing.status === 'locked' ||
      existing.status === 'available' ||
      existing.status === 'in_progress';

    const updatedRecord: ProgressRecord = {
      contentId,
      status: newStatus,
      bestScore: existing?.bestScore !== undefined ? Math.max(existing.bestScore, score) : score,
      masteryEvidence: [
        ...(existing?.masteryEvidence || []),
        `Score: ${score}% on ${now.split('T')[0]}`,
      ],
      attempts: (existing?.attempts || 0) + 1,
      lastAttemptAt: now,
      contentVersion: '1.0.0',
      updatedAt: now,
    };

    all[contentId] = updatedRecord;

    try {
      safeSetItem(STORAGE_KEYS.PROGRESS, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to save progress records', e);
    }

    // Update Player Profile & XP
    if (isFirstCompletion) {
      const profile = this.getPlayerProfile();
      profile.xp += xpReward;
      // 100 XP per level
      profile.level = Math.floor(profile.xp / 100) + 1;
      profile.updatedAt = now;
      if (!profile.completedActivities.includes(contentId)) {
        profile.completedActivities.push(contentId);
      }

      // Check achievement unlocks
      if (profile.completedActivities.length >= 1 && !profile.earnedAchievements.includes('first-experiment')) {
        profile.earnedAchievements.push('first-experiment');
      }
      if (profile.level >= 2 && !profile.earnedAchievements.includes('scholar-level-2')) {
        profile.earnedAchievements.push('scholar-level-2');
      }

      this.savePlayerProfile(profile);
    } else {
      notifyListeners();
    }

    return updatedRecord;
  },

  addXp(amount: number): PlayerProfile {
    const profile = this.getPlayerProfile();
    profile.xp += amount;
    profile.level = Math.floor(profile.xp / 100) + 1;
    profile.updatedAt = new Date().toISOString();
    this.savePlayerProfile(profile);
    return profile;
  },

  resetAllProgress(): void {
    try {
      safeRemoveItem(STORAGE_KEYS.PROFILE);
      safeRemoveItem(STORAGE_KEYS.PROGRESS);
      safeRemoveItem(STORAGE_KEYS.ACHIEVEMENTS);
      notifyListeners();
    } catch (e) {
      console.error('Failed to reset progress', e);
    }
  },
};
