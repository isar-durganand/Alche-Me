/**
 * Alche-Me — Virtual Laboratory Types & Data Contracts
 * Covers all 10 university engineering chemistry practicals & apparatus matrix
 */

export type ApparatusCategory = 'glassware' | 'metal' | 'electronics' | 'key';

export interface ApparatusItem {
  id: string;
  name: string;
  subtitle: string;
  category: ApparatusCategory;
  experiments: string;
  expNumbers: number[];
  description: string;
  specifications: string[];
  careAndSafety: string[];
  capacity?: string;
  material: string;
}

export type LabWorkbenchMode = 'titration' | 'potentiometry' | 'conductometry' | 'viscometry' | 'computational';

export interface TitrationRunState {
  currentVolumeDispensed: number; // in mL
  maxBuretteVolume: number; // 50 mL
  isFlowing: boolean;
  flowRate: number; // mL per second (e.g. 0.05 for dropwise, 1.5 for stream)
  stirrerActive: boolean;
  stirrerSpeed: number; // 0 to 100 rpm
  selectedIndicator: string;
  indicatorAdded: boolean;
  sampleVolume: number; // e.g. 25 mL
  currentColorHex: string;
  colorName: string;
  isEquivalenceReached: boolean;
  isOvershot: boolean;
  trials: { trialNumber: number; initialReading: number; finalReading: number; volumeUsed: number }[];
  concordantVolume: number | null;
}

export interface PotentiometryRunState {
  addedTitrantVolume: number; // mL
  currentEmfMv: number;
  dataPoints: { volume: number; emf: number; deltaEOverDeltaV?: number }[];
  stirrerActive: boolean;
  isEquivalenceReached: boolean;
}

export interface ConductometryRunState {
  addedTitrantVolume: number; // mL
  currentConductivityMs: number;
  dataPoints: { volume: number; conductance: number }[];
  stirrerActive: boolean;
  isEquivalenceReached: boolean;
}

export interface ViscometryRunState {
  viscometerType: 'redwood1' | 'redwood2';
  oilSample: 'machine_oil' | 'engine_oil';
  temperatureC: number;
  isLevel: boolean;
  ballValveOpen: boolean;
  oilFilled: boolean;
  elapsedSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  flaskVolumeMl: number; // 0 to 50 mL
  kinematicViscosityStokes: number | null;
  absoluteViscosityPoise: number | null;
}

export interface LabCalculationInput {
  fieldId: string;
  label: string;
  unit: string;
  expectedValue: number;
  tolerance: number;
  userValue: string;
  isCorrect?: boolean;
  formula: string;
}

export interface LabReportResult {
  experimentId: string;
  experimentNum: string;
  experimentTitle: string;
  studentName: string;
  date: string;
  concordantValue: number;
  calculatedResult: string;
  accuracyPercentage: number;
  grade: 'A+' | 'A' | 'B' | 'Needs Practice';
  xpAwarded: number;
}
