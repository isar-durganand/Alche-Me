/**
 * Alche-Me — Core Domain Type Definitions
 * Source of truth: docs/Alche-Me_Master_Specification.md (Sections 6, 7, 9, 14)
 */

export type ContentId = string;
export type UserId = string;

export type ActivityStatus =
  | 'locked'
  | 'available'
  | 'in_progress'
  | 'completed'
  | 'mastered';

export interface SourceReference {
  id: string;
  title: string;
  location?: string;
  publisher?: string;
  accessedAt?: string;
  license?: string;
}

export interface UnlockRule {
  prerequisiteId: string;
  requiredStatus: ActivityStatus;
  minimumScore?: number;
}

export interface LevelDefinition {
  id: string;
  worldId: string;
  title: string;
  summary: string;
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  prerequisites: string[];
  curriculumTags: string[];
  learningObjectives: string[];
  activityIds: string[];
  assessmentId?: string;
  unlockRules: UnlockRule[];
  estimatedMinutes?: number;
  contentVersion: string;
}

export interface SafetyNote {
  level: 'info' | 'warning' | 'danger';
  title: string;
  instruction: string;
  ppeRequired?: string[];
}

export interface ApparatusDefinition {
  id: string;
  name: string;
  modelAssetPath?: string;
  capacity?: string;
  tolerance?: string;
}

export interface ReagentDefinition {
  id: string;
  name: string;
  formula: string;
  concentration?: string;
  hazardClass?: string;
}

export interface ProcedureStep {
  stepNumber: number;
  instruction: string;
  expectedApparatusId?: string;
  expectedReagentId?: string;
  observationPrompt?: string;
}

export interface CalculationDefinition {
  id: string;
  title: string;
  formulaLatex: string;
  variables: Record<string, string>;
  expectedUnits: string;
}

export interface ExperimentDefinition {
  id: string;
  title: string;
  curriculumTags: string[];
  sourceReferences: SourceReference[];
  objectives: string[];
  theory: string[];
  apparatus: ApparatusDefinition[];
  reagents: ReagentDefinition[];
  safety: SafetyNote[];
  procedure: ProcedureStep[];
  simulationModelId: string;
  calculations: CalculationDefinition[];
  vivaQuestionIds: string[];
  reportTemplateId: string;
  contentVersion: string;
  reviewStatus: 'draft' | 'scientific_review' | 'approved';
}

export interface PropertyValue {
  value?: number | string;
  unit?: string;
  status: 'measured' | 'standard' | 'estimated' | 'calculated' | 'not_applicable' | 'unknown';
  sourceId?: string;
  note?: string;
}

export interface ElementRecord {
  atomicNumber: number;
  symbol: string;
  name: string;
  category?: string;
  group?: number;
  period: number;
  block?: 's' | 'p' | 'd' | 'f';
  atomicWeight?: {
    value: number | string;
    status: 'standard' | 'interval' | 'mass_number' | 'unknown';
  };
  electronConfiguration?: string;
  oxidationStates?: number[];
  properties: Record<string, PropertyValue>;
  sourceReferences: SourceReference[];
  dataVersion: string;
}

export interface ProgressRecord {
  userId?: UserId;
  contentId: ContentId;
  status: ActivityStatus;
  bestScore?: number;
  masteryEvidence: string[];
  attempts: number;
  lastAttemptAt?: string;
  contentVersion: string;
  updatedAt: string;
}

export interface FeatureInventoryItem {
  id: string;
  title: string;
  category: 'Core System' | 'Curriculum & Worlds' | 'Virtual Lab' | 'Molecule Studio' | 'Periodic Table' | 'Persistence';
  phase: string;
  status: 'implemented_in_prototype' | 'foundational_in_place' | 'in_progress' | 'planned';
  notes: string;
  sourceModule?: string;
}
