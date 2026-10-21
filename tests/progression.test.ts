import { describe, it, expect, beforeEach } from 'vitest';
import { progressAdapter } from '../src/infrastructure/persistence/progressAdapter';
import { CURRICULUM_WORLDS } from '../src/data/curriculumData';
import { ACHIEVEMENTS, ACTIVE_QUESTS } from '../src/data/questsData';

describe('Alche-Me Progression & Curriculum Test Suite', () => {
  beforeEach(() => {
    progressAdapter.resetAllProgress();
  });

  it('should initialize player profile with baseline values', () => {
    const profile = progressAdapter.getPlayerProfile();
    expect(profile.id).toBe('guest-scholar');
    expect(profile.level).toBe(1);
    expect(profile.xp).toBe(0);
    expect(profile.earnedAchievements).toContain('initiate');
    expect(profile.completedActivities).toEqual([]);
  });

  it('should award deterministic XP and calculate player level on activity completion', () => {
    // Complete Level 1 with 100% score (100 XP)
    const record = progressAdapter.completeActivity('da-lvl-1', 100, 100);
    expect(record.status).toBe('mastered');
    expect(record.bestScore).toBe(100);
    expect(record.attempts).toBe(1);

    const profile = progressAdapter.getPlayerProfile();
    expect(profile.xp).toBe(100);
    expect(profile.level).toBe(2); // 100 XP / 100 + 1 = 2
    expect(profile.completedActivities).toContain('da-lvl-1');
    expect(profile.earnedAchievements).toContain('first-experiment');
    expect(profile.earnedAchievements).toContain('scholar-level-2');
  });

  it('should distinguish completed vs mastered based on the 90% threshold', () => {
    // Complete with 75% score (<90% threshold)
    const record1 = progressAdapter.completeActivity('test-lvl-1', 75, 50);
    expect(record1.status).toBe('completed');
    expect(record1.bestScore).toBe(75);

    // Complete with 95% score (>=90% threshold)
    const record2 = progressAdapter.completeActivity('test-lvl-2', 95, 50);
    expect(record2.status).toBe('mastered');
    expect(record2.bestScore).toBe(95);
  });

  it('should retain best score and increment attempts on repeated attempts', () => {
    progressAdapter.completeActivity('da-lvl-1', 60, 100);
    const firstAttempt = progressAdapter.getProgress('da-lvl-1');
    expect(firstAttempt?.attempts).toBe(1);
    expect(firstAttempt?.bestScore).toBe(60);

    // Second attempt with higher score
    progressAdapter.completeActivity('da-lvl-1', 100, 100);
    const secondAttempt = progressAdapter.getProgress('da-lvl-1');
    expect(secondAttempt?.attempts).toBe(2);
    expect(secondAttempt?.bestScore).toBe(100);
    expect(secondAttempt?.status).toBe('mastered');

    // Third attempt with lower score (should not decrease bestScore)
    progressAdapter.completeActivity('da-lvl-1', 50, 100);
    const thirdAttempt = progressAdapter.getProgress('da-lvl-1');
    expect(thirdAttempt?.attempts).toBe(3);
    expect(thirdAttempt?.bestScore).toBe(100);
  });

  it('should have 6 structured curriculum worlds matching the Master Specification', () => {
    expect(CURRICULUM_WORLDS.length).toBe(6);

    const worldIds = CURRICULUM_WORLDS.map((w) => w.id);
    expect(worldIds).toContain('discovery-academy');
    expect(worldIds).toContain('atomic-frontier');
    expect(worldIds).toContain('bonding-worlds');
    expect(worldIds).toContain('reaction-forge');
    expect(worldIds).toContain('analytical-district');
    expect(worldIds).toContain('materials-frontier');
  });

  it('should have valid levels and curated question sets in Discovery Academy and Atomic Frontier', () => {
    const discovery = CURRICULUM_WORLDS.find((w) => w.id === 'discovery-academy');
    expect(discovery).toBeDefined();
    expect(discovery?.levels.length).toBeGreaterThanOrEqual(2);

    const level1 = discovery?.levels[0];
    expect(level1?.title).toContain('Safety');
    expect(level1?.activity.quiz.length).toBeGreaterThanOrEqual(3);

    for (const q of level1!.activity.quiz) {
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();
    }

    // Verify prerequisite chain
    const level2 = discovery?.levels[1];
    expect(level2?.prerequisiteId).toBe('da-lvl-1');
  });

  it('should define active study quests and unlockable achievements', () => {
    expect(ACTIVE_QUESTS.length).toBeGreaterThanOrEqual(3);
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(4);

    for (const quest of ACTIVE_QUESTS) {
      expect(quest.id).toBeTruthy();
      expect(quest.title).toBeTruthy();
      expect(quest.xpReward).toBeGreaterThan(0);
    }
  });
});
