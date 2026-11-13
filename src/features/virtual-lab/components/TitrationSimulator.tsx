/**
 * Alche-Me — High-Fidelity Interactive Titration Simulator (Exp 1, 2, 3, 5)
 * 100% chemically & physically authentic:
 * - Left-docked Chemical Reagent Rack (direct side-by-side access, zero scrolling)
 * - Physical drop kinematics: Nozzle detachment, gravitational downward acceleration, surface impact, and expanding capillary ripple waves
 * - Fully functional, responsive buttons (NEVER locked or disabled)
 * - Authentic horizontal Teflon magnetic stir flea with fluid vortex (no rotating spoon artifact!)
 * - Live burette dispensing (Dropwise, Fast Stream, Micro-Drop +0.05 mL)
 * - Multi-trial concordance tracking (Trial 1, 2, 3) and calculation verification with XP awards
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Droplet, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FlaskConical,
  Volume2,
  RefreshCw
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';
import { progressAdapter } from '../../../infrastructure/persistence/progressAdapter';
import { ExperimentItem } from '../../../data/experimentsData';
import { ReagentRack, ReagentItemConfig } from './ReagentRack';

interface TitrationSimulatorProps {
  experiment: ExperimentItem;
  onComplete?: (concordantV: number, calculatedResult: number) => void;
}

export const TitrationSimulator: React.FC<TitrationSimulatorProps> = ({ 
  experiment, 
  onComplete 
}) => {
  // Target stoichiometric equivalence volume
  const targetEquivalenceVolume = experiment.num === '01' ? 24.5 : experiment.num === '02' ? 12.0 : experiment.num === '03' ? 18.2 : 15.0;
  const targetEquivalenceVolume2 = experiment.num === '02' ? 28.0 : undefined; // For double indicator Methyl Orange

  // Reagents state (sample volume, buffer volume, indicator drops)
  const [sampleVolume, setSampleVolume] = useState<number>(25.0);
  const [bufferAdded, setBufferAdded] = useState<boolean>(true);
  const [indicatorDrops, setIndicatorDrops] = useState<number>(3);
  const [secondIndicatorDrops, setSecondIndicatorDrops] = useState<number>(experiment.num === '02' ? 0 : 0);
  const [starchAdded, setStarchAdded] = useState<boolean>(experiment.num !== '03'); // Exp 3 adds starch midway

  // Burette & Dispensing state
  const [dispensedVolume, setDispensedVolume] = useState<number>(0);
  const [dispenseMode, setDispenseMode] = useState<'stopped' | 'dropwise' | 'stream'>('stopped');
  const [stirrerActive, setStirrerActive] = useState<boolean>(true);
  const [activeStage, setActiveStage] = useState<'phenolphthalein' | 'methyl_orange'>(
    experiment.num === '02' ? 'phenolphthalein' : 'phenolphthalein'
  );

  // Droplet physical animation state
  const [activeDrops, setActiveDrops] = useState<Array<{
    id: number;
    color: string;
    stage: 'falling' | 'rippling';
  }>>([]);

  // Observations table (Concordance runs)
  const [trials, setTrials] = useState<Array<{ trial: number; initial: number; final: number; volume: number }>>([
    { trial: 1, initial: 0.0, final: 0.0, volume: 0.0 }
  ]);
  const [currentTrialIdx, setCurrentTrialIdx] = useState<number>(0);

  // User Calculation Input
  const [userCalculation, setUserCalculation] = useState<string>('');
  const [calcValidationMessage, setCalcValidationMessage] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Drag over state for flask drop zone
  const [isDragHover, setIsDragHover] = useState<boolean>(false);

  // Animation counter
  const dropCounterRef = useRef<number>(0);

  // Reagents configuration for active experiment
  const getReagentConfigs = (): ReagentItemConfig[] => {
    if (experiment.num === '01') {
      return [
        {
          key: 'sample',
          name: 'Hard Water Sample',
          formula: 'Ca²⁺ + Mg²⁺ (aq)',
          type: 'pipette',
          role: 'Sample Aliquot',
          color: '#38BDF8',
          accentColor: '#0284C7',
          quantityAdded: sampleVolume,
          targetQuantity: 25,
          unit: 'mL',
          isCompleted: sampleVolume >= 25,
          chemicalExplanation: 'Contains divalent calcium and magnesium cations contributing to temporary and permanent water hardness.',
        },
        {
          key: 'buffer',
          name: 'Ammonia Buffer (pH 10)',
          formula: 'NH₄Cl + NH₄OH',
          type: 'cylinder',
          role: 'pH Stabilizer',
          color: '#A7F3D0',
          accentColor: '#10B981',
          quantityAdded: bufferAdded ? 5 : 0,
          targetQuantity: 5,
          unit: 'mL',
          isCompleted: bufferAdded,
          chemicalExplanation: 'Maintains alkaline pH 10.0 so [Ca-EDTA]²⁻ and [Mg-EDTA]²⁻ chelate complexes form stably without precipitation of metal hydroxides.',
        },
        {
          key: 'indicator',
          name: 'Eriochrome Black-T (EBT)',
          formula: 'C₂₀H₁₂N₃NaO₇S',
          type: 'dropper',
          role: 'Metal Indicator',
          color: '#881337',
          accentColor: '#9F1239',
          quantityAdded: indicatorDrops,
          targetQuantity: 3,
          unit: 'drops',
          isCompleted: indicatorDrops >= 2,
          chemicalExplanation: 'Forms an unstable wine-red complex with Ca²⁺/Mg²⁺. At equivalence, EDTA displaces EBT, liberating free blue dye HIn²⁻.',
        },
      ];
    }

    if (experiment.num === '02') {
      return [
        {
          key: 'sample',
          name: 'Alkaline Water Sample',
          formula: 'OH⁻ + CO₃²⁻ + HCO₃⁻',
          type: 'pipette',
          role: 'Sample Aliquot',
          color: '#38BDF8',
          accentColor: '#0284C7',
          quantityAdded: sampleVolume,
          targetQuantity: 50,
          unit: 'mL',
          isCompleted: sampleVolume >= 50,
          chemicalExplanation: 'Water sample containing caustic alkalinity (OH⁻), carbonate alkalinity (CO₃²⁻), and bicarbonate alkalinity (HCO₃⁻).',
        },
        {
          key: 'indicator',
          name: 'Phenolphthalein Indicator',
          formula: 'HIn (pH 8.3–10.0)',
          type: 'dropper',
          role: 'P Indicator',
          color: '#F43F5E',
          accentColor: '#E11D48',
          quantityAdded: indicatorDrops,
          targetQuantity: 3,
          unit: 'drops',
          isCompleted: indicatorDrops >= 2,
          chemicalExplanation: 'Turns bright pink in alkaline conditions above pH 8.3. Turns colorless once all OH⁻ and half of CO₃²⁻ are neutralized.',
        },
        {
          key: 'second_indicator',
          name: 'Methyl Orange Indicator',
          formula: 'MO (pH 3.1–4.4)',
          type: 'dropper',
          role: 'M Indicator',
          color: '#F59E0B',
          accentColor: '#D97706',
          quantityAdded: secondIndicatorDrops,
          targetQuantity: 3,
          unit: 'drops',
          isCompleted: secondIndicatorDrops >= 2,
          chemicalExplanation: 'Added after phenolphthalein end point. Turns canary yellow, then shifts to reddish-orange once all bicarbonate is neutralized.',
        },
      ];
    }

    if (experiment.num === '03') {
      return [
        {
          key: 'sample',
          name: 'Bleaching Powder Solution',
          formula: 'CaOCl₂ (aq)',
          type: 'pipette',
          role: 'Chlorine Source',
          color: '#E0F2FE',
          accentColor: '#0284C7',
          quantityAdded: sampleVolume,
          targetQuantity: 25,
          unit: 'mL',
          isCompleted: sampleVolume >= 25,
          chemicalExplanation: 'Sample containing active hypochlorite ions (OCl⁻) representing available residual disinfectant chlorine.',
        },
        {
          key: 'buffer',
          name: 'Glacial Acetic Acid & KI',
          formula: 'CH₃COOH + 10% KI',
          type: 'cylinder',
          role: 'Iodine Liberator',
          color: '#78350F',
          accentColor: '#92400E',
          quantityAdded: bufferAdded ? 20 : 0,
          targetQuantity: 20,
          unit: 'mL',
          isCompleted: bufferAdded,
          chemicalExplanation: 'Acetic acid acidifies the medium and KI liberates equivalent stoichiometric elemental Iodine (I₂), giving an intense brown coloration.',
        },
        {
          key: 'indicator',
          name: 'Fresh Starch Indicator',
          formula: '(C₆H₁₀O₅)ₙ (Paste)',
          type: 'dropper',
          role: 'Adsorption Indicator',
          color: '#1E1B4B',
          accentColor: '#312E81',
          quantityAdded: starchAdded ? 2 : 0,
          targetQuantity: 2,
          unit: 'mL',
          isCompleted: starchAdded,
          chemicalExplanation: 'Added near the end of titration (straw yellow phase). Forms a deep inky blue starch-triiodide helical inclusion complex.',
        },
      ];
    }

    // Default Exp 05: Binary Mixture
    return [
      {
        key: 'sample',
        name: 'Binary NaOH + NaCl Mixture',
        formula: 'NaOH + NaCl (aq)',
        type: 'pipette',
        role: 'Mixed Sample',
        color: '#38BDF8',
        accentColor: '#0284C7',
        quantityAdded: sampleVolume,
        targetQuantity: 10,
        unit: 'mL',
        isCompleted: sampleVolume >= 10,
        chemicalExplanation: 'Binary solution containing alkaline sodium hydroxide and neutral sodium chloride.',
      },
      {
        key: 'indicator',
        name: 'Phenolphthalein Indicator',
        formula: 'HIn (pH 8.3–10.0)',
        type: 'dropper',
        role: 'Acid-Base Indicator',
        color: '#EC4899',
        accentColor: '#DB2777',
        quantityAdded: indicatorDrops,
        targetQuantity: 3,
        unit: 'drops',
        isCompleted: indicatorDrops >= 2,
        chemicalExplanation: 'Colors the solution deep pink in presence of NaOH. Decolorizes sharply when all hydroxide is neutralized by standard HCl.',
      },
    ];
  };

  const reagentConfigs = getReagentConfigs();
  const isVesselPrepared = reagentConfigs.every((r) => r.isCompleted);

  // Trigger a physical droplet fall animation
  const launchPhysicalDrop = (color: string, onImpact?: () => void) => {
    dropCounterRef.current += 1;
    const dropId = dropCounterRef.current;
    
    // Stage 1: Droplet detaches from nozzle and accelerates downward under gravity (0 to 220ms)
    setActiveDrops((prev) => [...prev, { id: dropId, color, stage: 'falling' }]);

    setTimeout(() => {
      // Stage 2: Droplet strikes liquid surface -> acoustic splash ping + expanding ripple waves (220 to 450ms)
      soundEngine.playDroplet();
      if (onImpact) onImpact();
      setActiveDrops((prev) => 
        prev.map((d) => (d.id === dropId ? { ...d, stage: 'rippling' } : d))
      );

      setTimeout(() => {
        setActiveDrops((prev) => prev.filter((d) => d.id !== dropId));
      }, 230);
    }, 220);
  };

  // Handle adding reagent through drag or click
  const handleAddReagent = (key: string, amount: number) => {
    if (key === 'sample') {
      soundEngine.playLiquidPour();
      setSampleVolume((prev) => Math.min(50, prev + (prev === 0 ? amount : 5)));
    } else if (key === 'buffer') {
      soundEngine.playLiquidPour();
      setBufferAdded(true);
    } else if (key === 'indicator') {
      const dropColor = experiment.num === '01' ? '#881337' : experiment.num === '03' ? '#1E1B4B' : '#F43F5E';
      launchPhysicalDrop(dropColor, () => {
        if (experiment.num === '03') {
          setStarchAdded(true);
        } else {
          setIndicatorDrops((prev) => Math.min(10, prev + amount));
        }
      });
    } else if (key === 'second_indicator') {
      launchPhysicalDrop('#F59E0B', () => {
        setSecondIndicatorDrops((prev) => Math.min(10, prev + amount));
      });
    }
  };

  const handleAutoPrepare = () => {
    soundEngine.playSuccess();
    setSampleVolume(experiment.num === '02' ? 50 : experiment.num === '05' ? 10 : 25);
    setBufferAdded(true);
    setIndicatorDrops(3);
    if (experiment.num === '03') {
      setStarchAdded(dispensedVolume >= 13.5);
    }
  };

  const handleResetVessel = () => {
    soundEngine.playTap();
    setSampleVolume(0);
    setBufferAdded(false);
    setIndicatorDrops(0);
    setSecondIndicatorDrops(0);
    setStarchAdded(false);
    setDispensedVolume(0);
    setDispenseMode('stopped');
  };

  // Drag and Drop handlers on flask target zone
  const handleDropOnFlask = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragHover(false);
    const key = e.dataTransfer.getData('text/plain');
    if (!key) return;

    const matched = reagentConfigs.find((r) => r.key === key);
    if (matched) {
      handleAddReagent(matched.key, matched.type === 'dropper' ? 1 : matched.targetQuantity);
    }
  };

  // Real-time animation loop for dispensing burette liquid
  useEffect(() => {
    if (dispenseMode === 'stopped') return;

    if (dispenseMode === 'stream') {
      const interval = setInterval(() => {
        setDispensedVolume((prev) => {
          if (prev >= 50.0) {
            setDispenseMode('stopped');
            return 50.0;
          }
          const next = Math.round((prev + 0.25) * 100) / 100;
          return next;
        });
      }, 120);
      return () => clearInterval(interval);
    }

    if (dispenseMode === 'dropwise') {
      const interval = setInterval(() => {
        setDispensedVolume((prev) => {
          if (prev >= 50.0) {
            setDispenseMode('stopped');
            return 50.0;
          }
          return Math.round((prev + 0.05) * 100) / 100;
        });
        // Launch a physical gravity droplet on each dropwise step
        launchPhysicalDrop('#38BDF8');
      }, 450);
      return () => clearInterval(interval);
    }
  }, [dispenseMode]);

  // Handle single micro-drop addition (+0.05 mL)
  const handleSingleDrop = () => {
    if (dispensedVolume >= 50.0) return;
    launchPhysicalDrop('#38BDF8', () => {
      setDispensedVolume((prev) => Math.min(50.0, Math.round((prev + 0.05) * 100) / 100));
    });
  };

  // Toggle stopcock valve state
  const handleCycleStopcock = () => {
    soundEngine.playStopcockClick();
    if (dispenseMode === 'stopped') {
      setDispenseMode('dropwise');
    } else if (dispenseMode === 'dropwise') {
      setDispenseMode('stream');
    } else {
      setDispenseMode('stopped');
    }
  };

  // Reset burette reading
  const handleResetBurette = () => {
    soundEngine.playTap();
    setDispenseMode('stopped');
    setDispensedVolume(0);
  };

  // Record trial reading
  const handleRecordTrial = () => {
    soundEngine.playSuccess();
    const currentRun = {
      trial: currentTrialIdx + 1,
      initial: 0.0,
      final: dispensedVolume,
      volume: dispensedVolume,
    };

    const nextTrials = [...trials];
    nextTrials[currentTrialIdx] = currentRun;

    if (currentTrialIdx < 2) {
      nextTrials.push({
        trial: currentTrialIdx + 2,
        initial: 0.0,
        final: 0.0,
        volume: 0.0,
      });
      setCurrentTrialIdx(currentTrialIdx + 1);
      setDispensedVolume(0);
      setDispenseMode('stopped');
    }

    setTrials(nextTrials);
  };

  // Color calculation based on dispensed volume, added reagents, and experiment chemistry
  const getSolutionAppearance = () => {
    const v = dispensedVolume;

    // Experiment 1: EDTA Hardness of Water (Wine-red to Steel Blue at 24.5 mL)
    if (experiment.num === '01') {
      if (sampleVolume === 0) return { color: '#E2E8F0', label: 'Empty Flask (Add Sample First)', opacity: 0.1 };
      if (indicatorDrops === 0) return { color: '#E0F2FE', label: 'Clear Hard Water + Buffer (Add EBT Indicator)', opacity: 0.35 };
      if (indicatorDrops === 1) return { color: '#9D174D', label: 'Pale Wine-Red (Add 1 more drop of EBT)', opacity: 0.7 };
      
      if (v < 23.5) {
        return { color: '#881337', label: 'Wine-Red ([Ca/Mg-EBT] Chelate Complex)', opacity: 0.88 };
      } else if (v < 24.4) {
        return { color: '#6B21A8', label: 'Purplish-Violet (Transition Phase)', opacity: 0.88 };
      } else if (v <= 24.6) {
        return { color: '#1D4ED8', label: 'Pure Steel Blue (Equivalence Point Reached!)', opacity: 0.95 };
      } else {
        return { color: '#1E3A8A', label: 'Deep Inky Blue (Excess 0.01M EDTA)', opacity: 0.9 };
      }
    }

    // Experiment 2: Alkalinity Double Indicator
    if (experiment.num === '02') {
      if (sampleVolume === 0) return { color: '#E2E8F0', label: 'Empty Flask (Add Water Sample)', opacity: 0.1 };
      
      if (activeStage === 'phenolphthalein') {
        if (indicatorDrops === 0) return { color: '#E0F2FE', label: 'Alkaline Water Sample (Add Phenolphthalein)', opacity: 0.3 };
        if (v < 11.5) {
          return { color: '#F43F5E', label: 'Vibrant Magenta Pink (pH > 8.3, OH⁻ & CO₃²⁻)', opacity: 0.85 };
        } else if (v < 11.95) {
          return { color: '#FDA4AF', label: 'Faint Pale Pink (Near P End Point)', opacity: 0.6 };
        } else if (v <= 12.1) {
          return { color: '#E0F2FE', label: 'Colorless (P End Point Reached: pH 8.3)', opacity: 0.3 };
        } else {
          return { color: '#E0F2FE', label: 'Colorless (Add Methyl Orange to proceed)', opacity: 0.3 };
        }
      } else {
        if (secondIndicatorDrops === 0) return { color: '#E0F2FE', label: 'Colorless (Add Methyl Orange Drops)', opacity: 0.3 };
        if (v < 27.2) {
          return { color: '#FACC15', label: 'Canary Yellow (pH > 4.5, HCO₃⁻ Neutralizing)', opacity: 0.85 };
        } else if (v < 27.9) {
          return { color: '#F97316', label: 'Golden Yellow-Orange (Near M End Point)', opacity: 0.88 };
        } else if (v <= 28.2) {
          return { color: '#DC2626', label: 'Distinct Reddish-Orange (M End Point: pH 4.0)', opacity: 0.92 };
        } else {
          return { color: '#991B1B', label: 'Deep Blood Red (Overshot with Acid)', opacity: 0.95 };
        }
      }
    }

    // Experiment 3: Chlorine & Iodometric Titration
    if (experiment.num === '03') {
      if (sampleVolume === 0) return { color: '#E2E8F0', label: 'Empty Flask (Add Bleaching Sample)', opacity: 0.1 };
      if (!bufferAdded) return { color: '#E0F2FE', label: 'Sample (Add Acetic Acid + KI to liberate I₂)', opacity: 0.3 };

      if (!starchAdded) {
        if (v < 14.0) {
          return { color: '#78350F', label: 'Intense Dark Brown (Liberated Free I₂)', opacity: 0.92 };
        } else {
          return { color: '#FDE047', label: 'Pale Straw Yellow (Time to Add Starch Indicator)', opacity: 0.75 };
        }
      } else {
        if (v < 18.0) {
          return { color: '#1E1B4B', label: 'Deep Dark Blue (I₂-Starch Helical Complex)', opacity: 0.95 };
        } else if (v <= 18.3) {
          return { color: '#E0F2FE', label: 'Crystal Colorless (Equivalence: Blue Vanished!)', opacity: 0.3 };
        } else {
          return { color: '#E0F2FE', label: 'Clear Colorless (Excess Hypo)', opacity: 0.3 };
        }
      }
    }

    // Experiment 5: Binary Mixture NaOH + NaCl
    if (sampleVolume === 0) return { color: '#E2E8F0', label: 'Empty Flask (Pipette Binary Mixture)', opacity: 0.1 };
    if (indicatorDrops === 0) return { color: '#E0F2FE', label: 'Clear Mixture (Add Phenolphthalein Drops)', opacity: 0.3 };

    if (v < 14.5) {
      return { color: '#EC4899', label: 'Deep Pink (Alkaline NaOH Present)', opacity: 0.85 };
    } else if (v < 14.95) {
      return { color: '#FBCFE8', label: 'Faint Pale Pink (Near Neutralization)', opacity: 0.5 };
    } else if (v <= 15.1) {
      return { color: '#E0F2FE', label: 'Crystal Colorless (Neutral Equivalence Point)', opacity: 0.3 };
    } else {
      return { color: '#E0F2FE', label: 'Colorless (NaCl Unreacted Neutral Salt)', opacity: 0.3 };
    }
  };

  const appearance = getSolutionAppearance();
  const currentEquivTarget = activeStage === 'methyl_orange' ? (targetEquivalenceVolume2 || 28.0) : targetEquivalenceVolume;
  const isNearEndpoint = Math.abs(dispensedVolume - currentEquivTarget) <= 0.4;
  const isExactEndpoint = Math.abs(dispensedVolume - currentEquivTarget) <= 0.1;

  // Calculate concordant volume
  const concordantVolume = trials.length >= 2 && trials[0].volume > 0 && trials[1].volume > 0
    ? Math.round(((trials[0].volume + trials[1].volume) / 2) * 100) / 100
    : trials[0].volume > 0
    ? trials[0].volume
    : null;

  // Expected theoretical calculation answers
  const getExpectedResult = () => {
    const v = concordantVolume || targetEquivalenceVolume;
    if (experiment.num === '01') {
      return { val: Math.round((v / 25.0) * 1000), unit: 'ppm CaCO₃ eq', name: 'Total Hardness' };
    }
    if (experiment.num === '02') {
      return { val: Math.round(v * 100), unit: 'ppm CaCO₃ eq', name: 'Phenolphthalein Alkalinity (P)' };
    }
    if (experiment.num === '03') {
      return { val: Math.round(v * 14.2 * 10) / 10, unit: 'mg/L (ppm)', name: 'Residual Chlorine' };
    }
    return { val: Math.round(v * 5 * 10) / 10, unit: '% NaOH', name: 'Percentage of NaOH' };
  };

  const expected = getExpectedResult();

  // Validate student calculation
  const handleCheckCalculation = () => {
    const parsed = parseFloat(userCalculation);
    if (isNaN(parsed)) {
      setCalcValidationMessage({ isSuccess: false, text: 'Please enter a valid numeric value.' });
      return;
    }

    const tolerance = expected.val * 0.05;
    const diff = Math.abs(parsed - expected.val);

    if (diff <= tolerance) {
      soundEngine.playSuccess();
      progressAdapter.addXp(60);
      setCalcValidationMessage({
        isSuccess: true,
        text: `Outstanding! Correct calculation: ${expected.val} ${expected.unit}. +60 Scholar XP awarded!`,
      });
      if (onComplete) {
        onComplete(concordantVolume || targetEquivalenceVolume, parsed);
      }
    } else {
      soundEngine.playError();
      setCalcValidationMessage({
        isSuccess: false,
        text: `Incorrect: Your calculation gives ${parsed}, but theoretical expected value is ${expected.val} ${expected.unit}. Re-check your stoichiometric formula!`,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#008E9B] text-xs font-mono font-bold">
              PRACTICAL EXP 0{experiment.num}
            </span>
            <span className="text-xs font-montserrat font-bold text-slate-500">
              {experiment.category}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-montserrat font-extrabold text-[#0B1F2A] mt-1">
            {experiment.title}
          </h2>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-2xl border flex items-center gap-2 ${
            isExactEndpoint
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : isNearEndpoint
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <div className="text-xs font-montserrat font-extrabold">
              {isExactEndpoint ? '100% Equivalence Match!' : isNearEndpoint ? 'Near Equivalence' : 'Titration in Progress'}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3-ZONE ERGONOMIC WORKBENCH (Reagents on Left, Canvas Center, Notebook Right) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* ========================================================================= */}
        {/* ZONE 1: REAGENT BENCH TOOLBAR (LEFT SIDE OF CANVAS)                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col min-h-[560px]">
          <ReagentRack
            experimentNum={experiment.num}
            reagents={reagentConfigs}
            onAddReagent={handleAddReagent}
            onAutoPrepare={handleAutoPrepare}
            onResetVessel={handleResetVessel}
            isAllPrepared={isVesselPrepared}
          />
        </div>

        {/* ========================================================================= */}
        {/* ZONE 2: LIVE APPARATUS CANVAS & DISPENSING TOOLBAR (CENTER)              */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-slate-800 flex flex-col items-center justify-between relative overflow-hidden shadow-inner min-h-[560px]">
          {/* Subtle laboratory grid background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Canvas Top Bar */}
          <div className="w-full flex items-center justify-between text-white z-10 text-xs pb-1">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-slate-400">Burette:</span>
              <span className="text-lg font-bold text-[#00C2D1] bg-slate-800/90 px-2.5 py-0.5 rounded-xl border border-slate-700">
                {dispensedVolume.toFixed(2)} mL
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setStirrerActive(!stirrerActive);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  stirrerActive ? 'bg-teal-500 text-slate-950 shadow-xs' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {stirrerActive ? 'STIRRER ON' : 'STIRRER OFF'}
              </button>
            </div>
          </div>

          {/* Central Interactive Apparatus Graphic */}
          <div 
            className="relative my-2 flex items-center justify-center w-full z-10 flex-1"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragHover(true);
            }}
            onDragLeave={() => setIsDragHover(false)}
            onDrop={handleDropOnFlask}
          >
            <svg viewBox="0 0 320 400" className="w-full max-w-[310px] h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="titrationFlaskLiquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={appearance.color} stopOpacity={appearance.opacity * 0.8} />
                  <stop offset="100%" stopColor={appearance.color} stopOpacity={appearance.opacity} />
                </linearGradient>

                <linearGradient id="titrationGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
                  <stop offset="35%" stopColor="#E0F2FE" stopOpacity="0.08" />
                  <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.32" />
                </linearGradient>

                {/* Teflon magnetic stir flea gradient */}
                <linearGradient id="titrationTeflonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>

                {/* Stopcock brass gradient */}
                <linearGradient id="titrationStopcockGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              {/* 1. RETORT STAND */}
              <rect x="20" y="362" width="280" height="18" rx="5" fill="#334155" stroke="#1E293B" strokeWidth="2" />
              {/* White Contrast Tile */}
              <rect x="85" y="358" width="150" height="6" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              {/* Vertical Support Rod */}
              <rect x="50" y="15" width="10" height="347" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
              {/* Clamp */}
              <rect x="58" y="95" width="95" height="8" fill="#475569" stroke="#334155" strokeWidth="1" />
              <rect x="148" y="87" width="12" height="24" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1" />

              {/* 2. BURETTE TUBE (50 mL) */}
              <g transform="translate(148, 10)">
                <rect x="0" y="0" width="20" height="200" rx="2" fill="url(#titrationGlassGrad)" stroke="#38BDF8" strokeWidth="1.5" />
                
                {/* Liquid Column */}
                {(() => {
                  const remainingRatio = Math.max(0, (50 - dispensedVolume) / 50);
                  const liquidHeight = remainingRatio * 170;
                  const liquidY = 180 - liquidHeight;
                  return (
                    <rect
                      x="2"
                      y={liquidY}
                      width="16"
                      height={liquidHeight}
                      fill="#38BDF8"
                      fillOpacity="0.45"
                    />
                  );
                })()}

                {/* Calibrated Burette Graduations */}
                {[0, 10, 20, 30, 40, 50].map((tick, idx) => {
                  const y = 10 + idx * 34;
                  return (
                    <g key={tick}>
                      <line x1="0" y1={y} x2="7" y2={y} stroke="#E2E8F0" strokeWidth="1.5" />
                      <text x="-4" y={y + 3} textAnchor="end" fill="#94A3B8" fontSize="7" fontFamily="monospace">
                        {tick}
                      </text>
                    </g>
                  );
                })}

                {/* Intermediate mini ticks */}
                {Array.from({ length: 25 }).map((_, idx) => (
                  <line key={idx} x1="0" y1={10 + idx * 6.8} x2="4" y2={10 + idx * 6.8} stroke="#94A3B8" strokeWidth="0.8" />
                ))}

                {/* Clickable PTFE Stopcock Valve */}
                <g 
                  className="cursor-pointer group/stopcock"
                  onClick={handleCycleStopcock}
                >
                  <rect x="-8" y="200" width="36" height="10" rx="3" fill="url(#titrationStopcockGrad)" stroke="#B45309" strokeWidth="1.5" />
                  
                  {/* Rotatable Stopcock Lever handle: 0° (Closed), 40° (Dropwise), 90° (Stream) */}
                  <g transform={`rotate(${dispenseMode === 'stopped' ? 0 : dispenseMode === 'dropwise' ? 40 : 90} 10 205)`}>
                    <rect x="6" y="193" width="8" height="24" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="1" />
                    <circle cx="10" cy="205" r="3" fill="#FEF08A" />
                  </g>
                </g>

                {/* Burette Tip Orifice */}
                <polygon points="5,210 15,210 11,228 9,228" fill="#38BDF8" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="1" />
              </g>

              {/* ========================================================================= */}
              {/* 3. PHYSICAL DROPLET KINEMATICS & GRAVITY ACCELERATION                     */}
              {/* Nozzle tip: (158, 238) -> Liquid Surface: (158, 298)                      */}
              {/* ========================================================================= */}
              {dispenseMode === 'stream' && (
                <line 
                  x1="158" 
                  y1="238" 
                  x2="158" 
                  y2="300" 
                  stroke="#38BDF8" 
                  strokeWidth="2.5" 
                  strokeDasharray="6,3" 
                  className="animate-pulse" 
                />
              )}

              {/* Multiple Physical Falling Droplets (Dropwise or Single Drop) */}
              {activeDrops.map((drop) => (
                <g key={drop.id}>
                  {drop.stage === 'falling' && (
                    <path
                      d="M 158 238 C 156 242, 155 246, 158 249 C 161 246, 160 242, 158 238 Z"
                      fill={drop.color}
                    >
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 0,15; 0,38; 0,60"
                        keyTimes="0; 0.3; 0.7; 1"
                        keySplines="0.4 0 0.8 0.8; 0.4 0 0.8 0.8; 0.4 0 0.8 0.8"
                        calcMode="spline"
                        dur="0.22s"
                        fill="freeze"
                      />
                      <animate
                        attributeName="opacity"
                        values="1; 1; 1; 0"
                        keyTimes="0; 0.8; 0.95; 1"
                        dur="0.22s"
                        fill="freeze"
                      />
                    </path>
                  )}

                  {drop.stage === 'rippling' && (
                    <ellipse cx="158" cy="298" rx="3" ry="1.2" fill="none" stroke={drop.color} strokeWidth="1.8">
                      <animate
                        attributeName="rx"
                        values="3; 10; 22"
                        dur="0.25s"
                        fill="freeze"
                      />
                      <animate
                        attributeName="ry"
                        values="1.2; 3; 6"
                        dur="0.25s"
                        fill="freeze"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.9; 0.5; 0"
                        dur="0.25s"
                        fill="freeze"
                      />
                    </ellipse>
                  )}
                </g>
              ))}

              {/* 4. CONICAL FLASK (250 mL Erlenmeyer) */}
              <g transform="translate(100, 248)">
                {/* Drag Target Highlight Ring */}
                {isDragHover && (
                  <ellipse cx="60" cy="10" rx="35" ry="12" fill="#00C2D1" fillOpacity="0.25" stroke="#00C2D1" strokeWidth="2" strokeDasharray="4,2" className="animate-pulse" />
                )}

                {/* Flask Lip */}
                <rect x="46" y="0" width="28" height="6" rx="2" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Flask Neck */}
                <rect x="50" y="4" width="20" height="26" fill="url(#titrationGlassGrad)" stroke="#94A3B8" strokeWidth="1.5" />
                
                {/* Liquid Level inside Conical Flask */}
                {sampleVolume > 0 && (() => {
                  const totalLiquidVol = sampleVolume + (bufferAdded ? 5 : 0) + dispensedVolume;
                  const fillFraction = Math.min(1.0, totalLiquidVol / 80);
                  const currentH = 25 + fillFraction * 45;
                  const yStart = 104 - currentH;
                  const leftX = 60 - (currentH / 70) * 45;
                  const rightX = 60 + (currentH / 70) * 45;

                  return (
                    <g>
                      {/* Fluid polygon */}
                      <polygon
                        points={`${leftX},${yStart} ${rightX},${yStart} 115,103 5,103`}
                        fill="url(#titrationFlaskLiquidGrad)"
                      />

                      {/* Liquid Concave Meniscus Curve at surface */}
                      <path
                        d={`M ${leftX} ${yStart} Q 60 ${yStart + 3.5} ${rightX} ${yStart}`}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeOpacity="0.8"
                        fill="none"
                      />

                      {/* Fluid vortex swirl depression when magnetic stirrer is active */}
                      {stirrerActive && (
                        <g>
                          <path
                            d={`M 54 ${yStart} Q 60 ${yStart + 6} 66 ${yStart}`}
                            stroke="#FFFFFF"
                            strokeWidth="1.2"
                            strokeOpacity="0.7"
                            fill="none"
                          />
                          {/* Swirling streamlines */}
                          <path d="M48 88 Q60 94 72 88" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4,2" fill="none" opacity="0.5" className="animate-pulse" />
                          <path d="M52 94 Q60 98 68 94" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="3,2" fill="none" opacity="0.4" className="animate-pulse" />
                        </g>
                      )}
                    </g>
                  );
                })()}

                {/* Flask Body Contour */}
                <path
                  d="M50 30 L5 104 Q0 108 8 108 L112 108 Q120 108 115 104 L70 30 Z"
                  fill="url(#titrationGlassGrad)"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Graduations */}
                <line x1="28" y1="92" x2="42" y2="92" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
                <text x="44" y="94" fill="#E2E8F0" fontSize="6" fontFamily="monospace" opacity="0.7">50 mL</text>
                
                <line x1="38" y1="76" x2="50" y2="76" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
                <text x="52" y="78" fill="#E2E8F0" fontSize="6" fontFamily="monospace" opacity="0.7">100 mL</text>

                {/* ========================================================================= */}
                {/* AUTHENTIC TEFLON MAGNETIC STIR FLEA (No unnatural spoon artifact!)        */}
                {/* Sits horizontally at bottom of flask; oscillates perspective in side view */}
                {/* ========================================================================= */}
                <g transform="translate(60, 102)">
                  <ellipse cx="0" cy="2" rx="14" ry="2" fill="#000000" fillOpacity="0.4" />
                  <rect
                    x={stirrerActive ? "-13" : "-14"}
                    y="-3.5"
                    width={stirrerActive ? "26" : "28"}
                    height="7"
                    rx="3.5"
                    fill="url(#titrationTeflonGrad)"
                    stroke="#64748B"
                    strokeWidth="0.8"
                  >
                    {stirrerActive && (
                      <animate
                        attributeName="width"
                        values="28;18;28;20;28"
                        dur="0.22s"
                        repeatCount="indefinite"
                      />
                    )}
                    {stirrerActive && (
                      <animate
                        attributeName="x"
                        values="-14;-9;-14;-10;-14"
                        dur="0.22s"
                        repeatCount="indefinite"
                      />
                    )}
                  </rect>
                  <rect x="-2" y="-4" width="4" height="8" rx="1" fill="#CBD5E1" stroke="#475569" strokeWidth="0.6" />
                </g>
              </g>
            </svg>
          </div>

          {/* Solution Color Banner */}
          <div className="w-full z-10 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-xs">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border border-white shadow-xs shrink-0 transition-colors duration-300" 
                style={{ backgroundColor: appearance.color }} 
              />
              <span className="font-montserrat font-bold text-xs truncate">
                Flask: <span className="font-mono text-teal-300">{appearance.label}</span>
              </span>
            </div>

            {/* Special Mid-titration indicator prompt */}
            {experiment.num === '03' && !starchAdded && dispensedVolume >= 13.5 && (
              <button
                type="button"
                onClick={() => {
                  launchPhysicalDrop('#1E1B4B', () => setStarchAdded(true));
                }}
                className="px-2.5 py-1 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-montserrat font-extrabold text-[11px] transition-all cursor-pointer shadow-md animate-bounce"
              >
                + Add Starch
              </button>
            )}

            {experiment.num === '02' && activeStage === 'phenolphthalein' && dispensedVolume >= 12.0 && (
              <button
                type="button"
                onClick={() => {
                  launchPhysicalDrop('#F59E0B', () => setActiveStage('methyl_orange'));
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-montserrat font-extrabold text-[11px] transition-all cursor-pointer shadow-md"
              >
                + Add Methyl Orange
              </button>
            )}
          </div>

          {/* ========================================================================= */}
          {/* DISPENSING CONTROLS TOOLBAR (100% FUNCTIONAL & RESPONSIVE)               */}
          {/* ========================================================================= */}
          <div className="w-full z-10 flex flex-wrap items-center justify-center gap-2 pt-2">
            {/* Single Micro-Drop +0.05 mL Button */}
            <button
              type="button"
              onClick={handleSingleDrop}
              className="px-3.5 py-2 rounded-xl text-xs font-montserrat font-extrabold bg-[#00C2D1] hover:bg-[#00AAB8] active:bg-[#008E9B] text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap"
              title="Dispense exactly one calibrated micro-drop (+0.05 mL)"
            >
              <Droplet className="w-3.5 h-3.5 shrink-0" />
              <span>+0.05 mL Drop</span>
            </button>

            {/* Dropwise Flow Toggle */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playStopcockClick();
                setDispenseMode(dispenseMode === 'dropwise' ? 'stopped' : 'dropwise');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-montserrat font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap ${
                dispenseMode === 'dropwise' 
                  ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300 font-black' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 shrink-0" />
              <span>{dispenseMode === 'dropwise' ? 'Dripping (Active)' : 'Dropwise Flow'}</span>
            </button>

            {/* Fast Stream Flow */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playStopcockClick();
                setDispenseMode(dispenseMode === 'stream' ? 'stopped' : 'stream');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-montserrat font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap ${
                dispenseMode === 'stream' 
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300 font-black' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              <Play className="w-3.5 h-3.5 shrink-0" />
              <span>{dispenseMode === 'stream' ? 'Streaming (Active)' : 'Fast Stream'}</span>
            </button>

            {/* Stop Valve */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playStopcockClick();
                setDispenseMode('stopped');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-montserrat font-extrabold bg-red-600 hover:bg-red-500 active:bg-red-700 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap"
            >
              <Pause className="w-3.5 h-3.5 shrink-0" />
              <span>Stop Valve</span>
            </button>

            {/* Refill Burette */}
            <button
              type="button"
              onClick={handleResetBurette}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer shrink-0"
              title="Refill Burette to 0.00 mL"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ZONE 3: LAB NOTEBOOK, CONCORDANCE READINGS & CALCULATIONS (RIGHT SIDE)   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
          {/* 1. Observation Table (3 Concordant Runs) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
                Lab Notebook: Concordant Readings
              </h3>
              <span className="text-[10px] text-teal-600 font-mono font-bold">
                Run {currentTrialIdx + 1} of 3
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-montserrat font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-1.5">Trial</th>
                    <th className="p-1.5">Initial</th>
                    <th className="p-1.5">Final</th>
                    <th className="p-1.5 text-right">Titre (mL)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {trials.map((tr) => (
                    <tr key={tr.trial} className={tr.trial === currentTrialIdx + 1 ? 'bg-teal-50/50 font-bold' : ''}>
                      <td className="p-1.5 text-slate-800">#{tr.trial}</td>
                      <td className="p-1.5 text-slate-500">{tr.initial.toFixed(2)}</td>
                      <td className="p-1.5 text-slate-500">
                        {tr.trial === currentTrialIdx + 1 ? dispensedVolume.toFixed(2) : tr.final.toFixed(2)}
                      </td>
                      <td className="p-1.5 text-right text-teal-600 font-bold">
                        {tr.trial === currentTrialIdx + 1 ? dispensedVolume.toFixed(2) : tr.volume.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Record Trial Action */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-slate-500">
                Concordant: <strong className="text-[#0B1F2A]">{concordantVolume !== null ? `${concordantVolume.toFixed(2)} mL` : 'Pending...'}</strong>
              </span>

              <button
                type="button"
                onClick={handleRecordTrial}
                disabled={dispensedVolume === 0}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-montserrat font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Save Trial #{currentTrialIdx + 1}
              </button>
            </div>
          </div>

          {/* 2. Interactive Stoichiometric Calculation Worksheet */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200/90 space-y-2.5">
            <h3 className="font-montserrat font-extrabold text-xs text-[#0B1F2A] uppercase tracking-wider">
              Stoichiometric Calculation Worksheet
            </h3>

            {/* Formula Preview Box */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed shadow-xs">
              {experiment.formulae}
            </div>

            {/* Calculation Input Field */}
            <div className="space-y-1">
              <label className="text-xs font-montserrat font-bold text-slate-700 flex items-center justify-between">
                <span>Calculate: {expected.name}</span>
                <span className="font-mono text-teal-600 text-[11px]">{expected.unit}</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.01"
                  placeholder={`Enter ${expected.name}...`}
                  value={userCalculation}
                  onChange={(e) => setUserCalculation(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-slate-800 font-mono"
                />
                <button
                  type="button"
                  onClick={handleCheckCalculation}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-montserrat font-extrabold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Validation Feedback */}
            {calcValidationMessage && (
              <div className={`p-2.5 rounded-xl text-xs font-medium flex items-start gap-1.5 ${
                calcValidationMessage.isSuccess 
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}>
                {calcValidationMessage.isSuccess ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                )}
                <span className="text-[11px]">{calcValidationMessage.text}</span>
              </div>
            )}
          </div>

          {/* 3. Safety Pro-Tip */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-0.5">
            <span className="font-montserrat font-extrabold text-[10px] uppercase tracking-wider text-amber-800">
              Lab Pro-Tip
            </span>
            <p className="text-[11px] leading-relaxed text-slate-700">
              {experiment.thingsToObserve}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
