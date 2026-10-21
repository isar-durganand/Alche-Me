/**
 * Alche-Me — Quests and Achievements Definitions
 */

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Milestone' | 'Mastery' | 'Exploration';
  xpReward: number;
}

export interface QuestItem {
  id: string;
  title: string;
  description: string;
  targetContentId: string;
  xpReward: number;
  category: 'Daily' | 'Curriculum' | 'Laboratory';
}

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'initiate',
    title: 'Laboratory Initiate',
    description: 'Enrolled in the Alche-Me Chemistry Quest environment.',
    icon: 'Sparkles',
    category: 'Milestone',
    xpReward: 25,
  },
  {
    id: 'first-experiment',
    title: 'First Discovery',
    description: 'Complete your first learning activity and assessment quiz.',
    icon: 'FlaskConical',
    category: 'Milestone',
    xpReward: 50,
  },
  {
    id: 'scholar-level-2',
    title: 'Junior Chemist',
    description: 'Earn 100+ XP and advance to Player Level 2.',
    icon: 'Award',
    category: 'Milestone',
    xpReward: 75,
  },
  {
    id: 'quantum-master',
    title: 'Master of Spin',
    description: 'Master the Quantum Subshells assessment in Atomic Frontier.',
    icon: 'Atom',
    category: 'Mastery',
    xpReward: 100,
  },
  {
    id: 'water-analyst',
    title: 'Water Technology Analyst',
    description: 'Complete the EDTA Hardness of Water activity in Analytical District.',
    icon: 'Droplets',
    category: 'Mastery',
    xpReward: 100,
  },
];

export const ACTIVE_QUESTS: QuestItem[] = [
  {
    id: 'q-safety',
    title: 'Safety First Protocol',
    description: 'Complete Level 1 in Discovery Academy to master chemical hazard pictograms and glassware hygiene.',
    targetContentId: 'da-lvl-1',
    xpReward: 100,
    category: 'Curriculum',
  },
  {
    id: 'q-orbitals',
    title: 'Quantum Orbital Explorer',
    description: 'Complete Level 1 in Atomic Frontier to unlock Hund’s Rule and Pauli Exclusion spin diagrams.',
    targetContentId: 'af-lvl-1',
    xpReward: 150,
    category: 'Curriculum',
  },
  {
    id: 'q-edta',
    title: 'Hardness of Water Investigation',
    description: 'Inspect the EDTA Complexometric Titration practical in the Virtual Laboratory.',
    targetContentId: 'exp-1',
    xpReward: 75,
    category: 'Laboratory',
  },
];
