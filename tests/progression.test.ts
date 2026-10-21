import { describe, it, expect, beforeEach } from 'vitest';
import { progressAdapter } from '../src/infrastructure/persistence/progressAdapter';
import { CURRICULUM_WORLDS } from '../src/data/curriculumData';
import { ACHIEVEMENTS, ACTIVE_QUESTS } from '../src/data/questsData';

describe('Alche-Me 8-World Curriculum & Progression Test Suite', () => {
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
    // Complete Level 1.1 with 100% score (100 XP)
    const record = progressAdapter.completeActivity('lvl-1-1', 100, 100);
    expect(record.status).toBe('mastered');
    expect(record.bestScore).toBe(100);
    expect(record.attempts).toBe(1);

    const profile = progressAdapter.getPlayerProfile();
    expect(profile.xp).toBe(100);
    expect(profile.level).toBe(2); // 100 XP / 100 + 1 = 2
    expect(profile.completedActivities).toContain('lvl-1-1');
    expect(profile.earnedAchievements).toContain('first-experiment');
    expect(profile.earnedAchievements).toContain('scholar-level-2');
  });

  it('should distinguish completed vs mastered based on the 90% threshold in progressAdapter', () => {
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
    progressAdapter.completeActivity('lvl-1-1', 60, 100);
    const firstAttempt = progressAdapter.getProgress('lvl-1-1');
    expect(firstAttempt?.attempts).toBe(1);
    expect(firstAttempt?.bestScore).toBe(60);

    // Second attempt with higher score
    progressAdapter.completeActivity('lvl-1-1', 100, 100);
    const secondAttempt = progressAdapter.getProgress('lvl-1-1');
    expect(secondAttempt?.attempts).toBe(2);
    expect(secondAttempt?.bestScore).toBe(100);
    expect(secondAttempt?.status).toBe('mastered');

    // Third attempt with lower score (should not decrease bestScore)
    progressAdapter.completeActivity('lvl-1-1', 50, 100);
    const thirdAttempt = progressAdapter.getProgress('lvl-1-1');
    expect(thirdAttempt?.attempts).toBe(3);
    expect(thirdAttempt?.bestScore).toBe(100);
  });

  it('should have exactly 8 structured curriculum worlds matching the specification', () => {
    expect(CURRICULUM_WORLDS.length).toBe(8);

    const worldIds = CURRICULUM_WORLDS.map((w) => w.id);
    expect(worldIds).toEqual([
      'world-1-discovery',
      'world-2-atomic',
      'world-3-bonding',
      'world-4-quantitative',
      'world-5-reactions',
      'world-6-analytical',
      'world-7-engineering',
      'world-8-future',
    ]);
  });

  it('should define exactly 56 curriculum levels (7 levels in each of the 8 worlds)', () => {
    let totalLevels = 0;
    for (const world of CURRICULUM_WORLDS) {
      expect(world.levels.length).toBe(7);
      totalLevels += world.levels.length;
      
      // Ensure level order is 1 to 7
      world.levels.forEach((lvl, idx) => {
        expect(lvl.order).toBe(idx + 1);
        expect(lvl.worldId).toBe(world.id);
        expect(lvl.title).toBeTruthy();
        expect(lvl.shortDescription).toBeTruthy();
      });
    }
    expect(totalLevels).toBe(56);
  });

  it('should have a fully implemented Level 1.1 vertical slice with complete curriculum schema', () => {
    const world1 = CURRICULUM_WORLDS.find((w) => w.id === 'world-1-discovery');
    expect(world1).toBeDefined();

    const lvl11 = world1?.levels[0];
    expect(lvl11).toBeDefined();
    expect(lvl11?.id).toBe('lvl-1-1');
    expect(lvl11?.implementationStatus).toBe('fully_implemented');
    expect(lvl11?.reviewStatus).toBe('reviewed');
    expect(lvl11?.learningObjectives.length).toBeGreaterThanOrEqual(3);
    expect(lvl11?.keyConcepts.length).toBeGreaterThanOrEqual(4);
    expect(lvl11?.lessonSections.length).toBeGreaterThanOrEqual(3);
    expect(lvl11?.contentSources.length).toBeGreaterThanOrEqual(2);

    // Verify activity config
    expect(lvl11?.activityType).toBe('observation_classification');
    const actConfig = lvl11?.activityConfig as any;
    expect(actConfig.categories.length).toBe(2);
    expect(actConfig.items.length).toBe(8);

    // Verify each classification item has text and explanation
    actConfig.items.forEach((item: any) => {
      expect(['direct_observation', 'inference']).toContain(item.category);
      expect(item.explanation).toBeTruthy();
      expect(item.text).toBeTruthy();
    });

    // Verify assessment questions
    expect(lvl11?.assessment.questions.length).toBe(4);
    lvl11?.assessment.questions.forEach((q) => {
      expect(q.options.length).toBe(4);
      const correctOpts = q.options.filter((o) => o.isCorrect);
      expect(correctOpts.length).toBe(1);
      expect(q.explanation).toBeTruthy();
    });

    // Verify rewards and unlocks
    expect(lvl11?.rewards.xp).toBe(100);
    expect(lvl11?.rewards.badgeId).toBe('badge-curious-observer');
    expect(lvl11?.unlocks).toContain('lvl-1-2');
  });

  it('should enforce prerequisite unlock chains between levels and worlds', () => {
    const world1 = CURRICULUM_WORLDS.find((w) => w.id === 'world-1-discovery');
    const lvl11 = world1?.levels[0];
    const lvl12 = world1?.levels[1];
    const lvl17 = world1?.levels[6];

    expect(lvl11?.prerequisiteLevelIds).toEqual([]);
    expect(lvl12?.prerequisiteLevelIds).toContain('lvl-1-1');

    const world2 = CURRICULUM_WORLDS.find((w) => w.id === 'world-2-atomic');
    expect(world2?.prerequisiteWorldId).toBe('world-1-discovery');
    expect(world2?.unlockLevelId).toBe('lvl-1-7');

    const world3 = CURRICULUM_WORLDS.find((w) => w.id === 'world-3-bonding');
    expect(world3?.prerequisiteWorldId).toBe('world-2-atomic');
  });
});
