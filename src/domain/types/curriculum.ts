/**
 * Alche-Me — Typed, Versioned Curriculum & World Schema
 * Version: 1.0.0
 * Conforms to Master Specification Section 6 and World & Level Design Document.
 */

export type ActivityType =
  | 'observation_classification'
  | 'molecule_assembly'
  | 'equation_balancing'
  | 'calculation'
  | 'graph_interpretation'
  | 'data_analysis'
  | 'simulation'
  | 'engineering_scenario'
  | 'boss_challenge';

export type ReviewStatus = 'reviewed' | 'in_review' | 'draft';
export type ImplementationStatus = 'fully_implemented' | 'planned' | 'draft';
export type DifficultyLevel = 'beginner' | 'foundations' | 'intermediate' | 'advanced' | 'capstone';

export interface ContentSource {
  id: string;
  title: string;
  publisherOrInstitution: string;
  editionOrStandard?: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  keyTakeaways: string[];
  keyEquation?: string;
  diagramAsset?: string;
  accessibleText?: string;
}

export interface ClassificationItem {
  id: string;
  text: string;
  category: string; // e.g. 'direct_observation' | 'inference'
  explanation: string;
  hint?: string;
}

export interface ClassificationActivityConfig {
  type: 'observation_classification';
  instruction: string;
  categories: { id: string; label: string; description: string; color: string }[];
  items: ClassificationItem[];
}

export type ActivityConfig = ClassificationActivityConfig | Record<string, unknown>;

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
  rationale: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: QuestionOption[];
  explanation: string;
  hint?: string;
}

export interface AssessmentDefinition {
  id: string;
  title: string;
  instructions: string;
  questions: AssessmentQuestion[];
}

export interface LevelRewards {
  xp: number;
  badgeId?: string;
  badgeTitle?: string;
  unlockedToolId?: string;
  unlockedToolTitle?: string;
}

export interface ScoringRules {
  activityWeight: number; // e.g. 0.5
  assessmentWeight: number; // e.g. 0.5
  masteryThreshold: number; // e.g. 80
  passingThreshold: number; // e.g. 60
}

export interface LevelSchema {
  id: string;
  worldId: string;
  order: number;
  title: string;
  shortDescription: string;
  difficulty: DifficultyLevel;
  prerequisiteLevelIds: string[];
  learningObjectives: string[];
  keyConcepts: string[];
  lessonSections: LessonSection[];
  activityType: ActivityType;
  activityInstructions: string;
  activityConfig?: ActivityConfig;
  assessment: AssessmentDefinition;
  scoringRules: ScoringRules;
  masteryThreshold: number;
  estimatedMinutes: number;
  rewards: LevelRewards;
  unlocks: string[];
  contentSources: ContentSource[];
  reviewStatus: ReviewStatus;
  implementationStatus: ImplementationStatus;
  accessibilityNotes: string;
  localizationKeys: Record<string, string>;
}

export interface WorldSchema {
  id: string;
  num: number;
  title: string;
  theme: string;
  story: string;
  worldOutcome: string;
  thumbnail: string;
  prerequisiteWorldId?: string;
  unlockLevelId?: string;
  levels: LevelSchema[];
}
