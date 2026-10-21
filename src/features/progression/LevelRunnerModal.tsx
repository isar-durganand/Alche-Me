import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Award, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Zap, 
  Star,
  Play, 
  Clock, 
  ShieldCheck, 
  Compass, 
  Lock, 
  ChevronRight, 
  Flame,
  Atom,
  Layers,
  Beaker
} from 'lucide-react';
import { LevelSchema } from '../../domain/types/curriculum';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
import { Modal, Button, Badge, ProgressBar, MarkdownRenderer } from '../../components/ui';
import { ConfettiCanvas } from '../../components/ui/ConfettiCanvas';
import { ClassificationActivity } from './activities/ClassificationActivity';
import { RealisticMoleculeViewer3D } from '../../components/3d/RealisticMoleculeViewer3D';

export interface LevelRunnerModalProps {
  level: LevelSchema;
  isOpen: boolean;
  onClose: () => void;
  onLevelCompleted?: (levelId: string, score: number) => void;
}

export type RunnerStep = 'briefing' | 'lesson' | 'activity' | 'assessment' | 'mastery';

export const LevelRunnerModal: React.FC<LevelRunnerModalProps> = ({
  level,
  isOpen,
  onClose,
  onLevelCompleted,
}) => {
  const [step, setStep] = useState<RunnerStep>('briefing');
  const [activityScore, setActivityScore] = useState<number>(100);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const { rewards, scoringRules, masteryThreshold } = level;

  // 1. Effective Lessons (custom or curated based on curriculum specifications)
  const effectiveLessonSections = level.lessonSections && level.lessonSections.length > 0
    ? level.lessonSections
    : [
        {
          id: `sec-${level.id}-1`,
          title: `1. Core Scientific Principles: ${level.title}`,
          content: `Welcome to **${level.title}**!\n\nIn this mission, we investigate the fundamental chemical principles of **${level.keyConcepts.join(', ')}**.\n\n### Scientific Foundation\n${level.shortDescription}\n\n> "In chemistry, mastery begins with structured observation, quantitative precision, and clear reasoning."`,
          keyTakeaways: level.learningObjectives,
        },
        {
          id: `sec-${level.id}-2`,
          title: `2. Experimental Protocol & Key Concepts`,
          content: `### Key Concepts under Investigation\n${level.keyConcepts.map(c => `- **${c}**: Fundamental chemical parameter analyzed through rigorous empirical measurements.`).join('\n')}\n\n### Scientific Methodology\n1. Establish clear baseline measurements before chemical mixing.\n2. Observe physical and chemical transformations without speculative bias.\n3. Verify experimental findings against standard reference data.`,
          keyTakeaways: [
            `Focus on observable, repeatable experimental measurements.`,
            `Relate atomic-scale bonding mechanisms to macroscopic physical observations.`
          ]
        }
      ];

  // 2. Effective Assessment Questions (custom or curated based on curriculum specifications)
  const effectiveAssessment = level.assessment && level.assessment.questions && level.assessment.questions.length > 0
    ? level.assessment
    : {
        id: `assess-${level.id}`,
        title: `Mastery Assessment: ${level.title}`,
        instructions: 'Answer the following scientific scenario questions based on this curriculum module.',
        questions: [
          {
            id: `q-${level.id}-1`,
            question: `Which statement represents the central scientific concept of ${level.keyConcepts[0] || level.title}?`,
            options: [
              {
                text: `${level.learningObjectives[0] || 'It provides the physical basis for chemical behavior.'}`,
                isCorrect: true,
                rationale: 'This directly reflects the primary verified learning objective of this module.'
              },
              {
                text: 'It is an arbitrary historical classification with no practical physical relevance.',
                isCorrect: false,
                rationale: 'Chemical principles are grounded in quantum mechanics and thermodynamics.'
              },
              {
                text: 'It only applies to theoretical simulations and never to physical matter.',
                isCorrect: false,
                rationale: 'All core chemical principles govern real laboratory and industrial matter.'
              }
            ],
            explanation: `The foundational objective of ${level.title} establishes the link between submicroscopic structures and macroscopic properties.`
          },
          {
            id: `q-${level.id}-2`,
            question: `In an empirical laboratory setup investigating ${level.keyConcepts[1] || 'these phenomena'}, which practice ensures scientific integrity?`,
            options: [
              {
                text: 'Assuming product identity solely from visual liquid color without confirmatory testing.',
                isCorrect: false,
                rationale: 'Sensory properties alone cannot establish unambiguous chemical identity.'
              },
              {
                text: 'Recording direct objective instrument measurements and separating them from explanatory inferences.',
                isCorrect: true,
                rationale: 'Separating empirical readings from theoretical hypotheses prevents confirmation bias.'
              },
              {
                text: 'Discarding discordant measurement replicates to artificially lower experimental error.',
                isCorrect: false,
                rationale: 'Cherry-picking data violates scientific reporting ethics.'
              }
            ],
            explanation: 'Rigorous laboratory analysis requires calibrated instrumentation and strict separation of observations from deductions.'
          }
        ]
      };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (assessmentSubmitted) return;
    soundEngine.playTap();
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const isAllAssessmentAnswered =
    effectiveAssessment.questions.length > 0 &&
    effectiveAssessment.questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleActivityDone = (score: number) => {
    setActivityScore(score);
    soundEngine.playTap();
    if (effectiveAssessment.questions.length > 0) {
      setStep('assessment');
    } else {
      finalizeMission(score, 100);
    }
  };

  const handleAssessmentSubmit = () => {
    let correctCount = 0;
    effectiveAssessment.questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        correctCount++;
      }
    });

    const assessScore = Math.round((correctCount / effectiveAssessment.questions.length) * 100);
    setAssessmentSubmitted(true);
    finalizeMission(activityScore, assessScore);
  };

  const finalizeMission = (actScore: number, assessScore: number) => {
    const actWeight = scoringRules?.activityWeight ?? 0.5;
    const assessWeight = scoringRules?.assessmentWeight ?? 0.5;
    const weightedScore = Math.round(actScore * actWeight + assessScore * assessWeight);
    setFinalScore(weightedScore);

    // Persist progression deterministically
    progressAdapter.completeActivity(level.id, weightedScore, rewards.xp);

    // If badge reward exists, award achievement
    if (rewards.badgeId) {
      const profile = progressAdapter.getPlayerProfile();
      if (!profile.earnedAchievements.includes(rewards.badgeId)) {
        profile.earnedAchievements.push(rewards.badgeId);
        progressAdapter.savePlayerProfile(profile);
      }
    }

    if (onLevelCompleted) {
      onLevelCompleted(level.id, weightedScore);
    }

    soundEngine.playVictory();
    setStep('mastery');
  };

  const handleResetAssessment = () => {
    soundEngine.playTap();
    setSelectedAnswers({});
    setAssessmentSubmitted(false);
  };

  const isMastered = finalScore >= masteryThreshold;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === 'briefing'
          ? `Mission Briefing: ${level.title}`
          : step === 'lesson'
          ? `Scientific Principles: ${level.title}`
          : step === 'activity'
          ? `Interactive Investigation: ${level.title}`
          : step === 'assessment'
          ? `Mastery Assessment: ${level.title}`
          : `Mission Clearance: ${level.title}`
      }
      description={`Mission 0${level.order} • Estimated Duration: ${level.estimatedMinutes} Mins • +${rewards.xp} XP`}
      size="xl"
    >
      <div className="space-y-6 text-sm sm:text-base">
        {/* Step Indicator Progress Bar */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'briefing', label: '1. Briefing' },
              { id: 'lesson', label: '2. Discovery' },
              { id: 'activity', label: '3. Investigation' },
              { id: 'assessment', label: '4. Mastery' },
            ].map((st, sIdx) => {
              const isActive = step === st.id || (st.id === 'assessment' && step === 'mastery');
              return (
                <React.Fragment key={st.id}>
                  {sIdx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-montserrat font-bold transition-all ${
                      isActive ? 'bg-[#00C2D1] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {st.label}
                  </span>
                </React.Fragment>
              );
            })}
          </div>

          <Badge variant="gold" size="sm">
            +{rewards.xp} XP Reward
          </Badge>
        </div>

        {/* STEP 1: BRIEFING */}
        {step === 'briefing' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl border-2 border-slate-100 bg-teal-50/40 space-y-3">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#00C2D1] block">
                Mission Scenario & Curriculum Objective
              </span>
              <MarkdownRenderer
                content={level.shortDescription}
                className="text-base sm:text-lg text-[#0B1F2A] font-medium leading-relaxed"
              />
            </div>

            {/* Key Learning Competencies */}
            <div className="space-y-3">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#0B1F2A] block">
                Target Learning Competencies
              </span>
              <ul className="space-y-2.5">
                {level.learningObjectives.map((obj, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-2xl border-2 border-slate-100 bg-white shadow-xs text-[#0B1F2A] leading-relaxed"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#00C2D1] shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base font-medium">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Concepts Tags */}
            <div className="space-y-2">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#0B1F2A] block">
                Investigated Concepts
              </span>
              <div className="flex flex-wrap gap-2">
                {level.keyConcepts.map((concept, cIdx) => (
                  <span
                    key={cIdx}
                    className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <Button size="sm" variant="secondary" onClick={onClose} className="font-montserrat font-bold">
                CANCEL
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<Play className="w-4 h-4 fill-current" />}
                onClick={() => {
                  soundEngine.playTap();
                  setStep('lesson');
                }}
                className="font-montserrat font-bold cursor-pointer"
              >
                BEGIN LESSON
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: LESSON & DISCOVERY */}
        {step === 'lesson' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {effectiveLessonSections.map((sec) => (
              <div
                key={sec.id}
                className="p-6 rounded-3xl border-2 border-slate-100 bg-white shadow-sm space-y-4"
              >
                <h3 className="font-montserrat font-extrabold text-lg sm:text-xl text-[#0B1F2A] border-b border-slate-100 pb-2">
                  {sec.title}
                </h3>
                <MarkdownRenderer
                  content={sec.content}
                  className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal"
                />

                {sec.keyTakeaways && sec.keyTakeaways.length > 0 && (
                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-2">
                    <span className="text-xs font-montserrat font-extrabold uppercase tracking-wider text-teal-800 block">
                      Key Takeaways & Formulas
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-teal-950 font-medium">
                      {sec.keyTakeaways.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <span className="text-[#00C2D1] font-bold text-base leading-none">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  soundEngine.playTap();
                  setStep('briefing');
                }}
                className="font-montserrat font-bold"
              >
                BACK TO BRIEFING
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  soundEngine.playTap();
                  setStep('activity');
                }}
                className="font-montserrat font-bold cursor-pointer"
              >
                ENTER INVESTIGATION WORKBENCH
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE ACTIVITY WORKBENCH */}
        {step === 'activity' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {level.activityConfig && level.activityConfig.type === 'observation_classification' ? (
              <ClassificationActivity
                config={level.activityConfig as any}
                onComplete={handleActivityDone}
              />
            ) : (
              /* High-Fidelity Interactive 3D Molecular & Experimental Workbench */
              <div className="space-y-5">
                <RealisticMoleculeViewer3D />

                <div className="p-6 rounded-3xl border-2 border-slate-100 bg-white shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-montserrat font-extrabold text-base text-[#0B1F2A] flex items-center gap-2">
                      <Beaker className="w-5 h-5 text-[#00C2D1]" />
                      Laboratory Investigation Protocol: {level.title}
                    </h4>
                    <Badge variant="accent" size="sm">Active Experiment</Badge>
                  </div>

                  <MarkdownRenderer
                    content={level.activityInstructions || `Observe molecular configurations, bond geometries, and quantitative empirical properties related to **${level.keyConcepts.join(', ')}**.`}
                    className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal"
                  />

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                    🔬 <strong>Experimental Task:</strong> Inspect the 3D molecular bonds and geometries above, record your observations into your Field Journal, and proceed to the Mastery Assessment.
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="primary"
                      size="md"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      onClick={() => handleActivityDone(100)}
                      className="font-montserrat font-bold cursor-pointer"
                    >
                      RECORD OBSERVATIONS & PROCEED TO ASSESSMENT
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: MASTERY ASSESSMENT */}
        {step === 'assessment' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-montserrat font-extrabold text-sm sm:text-base text-[#0B1F2A]">
                {effectiveAssessment.title} ({effectiveAssessment.questions.length} Questions)
              </span>
              <span className="text-xs sm:text-sm font-montserrat font-extrabold text-[#00C2D1]">
                {Object.keys(selectedAnswers).length} / {effectiveAssessment.questions.length} Answered
              </span>
            </div>

            <div className="space-y-6">
              {effectiveAssessment.questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl border-2 border-slate-100 bg-white shadow-sm space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200 text-[#00C2D1] text-xs font-montserrat font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <MarkdownRenderer
                      content={q.question}
                      className="font-montserrat font-bold text-base sm:text-lg text-[#0B1F2A] leading-snug"
                    />
                  </div>

                  <div className="space-y-2.5 pl-10">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between text-sm sm:text-base font-medium ${
                            isSelected
                              ? 'border-[#00C2D1] bg-teal-50/70 text-[#0B1F2A] font-bold shadow-xs'
                              : 'border-slate-100 hover:border-slate-200 bg-slate-50/60 text-slate-700'
                          }`}
                        >
                          <span dangerouslySetInnerHTML={{ __html: opt.text.replace(/H2O/g, 'H₂O').replace(/CO2/g, 'CO₂') }} />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 ${
                              isSelected ? 'border-[#00C2D1] bg-[#00C2D1]' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  soundEngine.playTap();
                  setStep('activity');
                }}
                className="font-montserrat font-bold"
              >
                BACK TO WORKBENCH
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!isAllAssessmentAnswered}
                onClick={handleAssessmentSubmit}
                className="font-montserrat font-bold cursor-pointer"
              >
                SUBMIT ASSESSMENT
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: MASTERY & REWARDS CELEBRATION */}
        {step === 'mastery' && (
          <div className="space-y-6 animate-in fade-in duration-200 relative">
            {isMastered && <ConfettiCanvas />}

            {/* Score & Honors Summary Card */}
            <div className="p-8 rounded-3xl border-2 border-slate-200/90 bg-white text-center space-y-5 shadow-sm">
              <div className="inline-flex p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-[#F5B942] shadow-sm">
                <Award className="w-14 h-14" />
              </div>
              
              <div className="space-y-1">
                <Badge variant={isMastered ? 'success' : 'gold'} size="md">
                  {isMastered ? 'CURRICULUM LEVEL MASTERED' : 'CURRICULUM LEVEL COMPLETED'}
                </Badge>
                <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-[#0B1F2A]">
                  {level.title}
                </h3>
              </div>

              <div className="flex items-center justify-center gap-10 text-xs sm:text-sm pt-2">
                <div>
                  <span className="text-slate-400 block text-xs font-montserrat font-bold uppercase">Weighted Score</span>
                  <span className="text-4xl font-montserrat font-extrabold text-[#00C2D1]">{finalScore}%</span>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-xs font-montserrat font-bold uppercase">Experience Reward</span>
                  <span className="text-4xl font-montserrat font-extrabold text-[#F5B942] flex items-center justify-center gap-1">
                    <Zap className="w-6 h-6 fill-current" /> +{rewards.xp} XP
                  </span>
                </div>
              </div>

              {/* Unlocked Badge / Tool */}
              {rewards.badgeTitle && isMastered && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/80 max-w-lg mx-auto flex items-center gap-3.5 text-left">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-montserrat font-extrabold text-sm text-amber-950 block">
                      Honor Unlocked: {rewards.badgeTitle}
                    </span>
                    <span className="text-xs sm:text-sm text-amber-800">
                      Added to your Scholar Profile and Field Journal.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Assessment Solution Rationale Breakdown */}
            <div className="space-y-4">
              <span className="font-montserrat font-extrabold text-sm uppercase tracking-wider text-[#0B1F2A] block">
                Reviewed Assessment Solutions & Rationales
              </span>
              {effectiveAssessment.questions.map((q, qIdx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns !== undefined && q.options[userAns]?.isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-3xl border-2 ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/60' : 'border-rose-200 bg-rose-50/60'
                    } space-y-3`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-montserrat font-bold text-base text-[#0B1F2A] block">
                          Q{qIdx + 1}: {q.question}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm space-y-1.5 pl-8">
                      <div className="text-slate-700">
                        <strong>Your Selected Answer:</strong> {userAns !== undefined ? q.options[userAns]?.text : 'None'}
                      </div>
                      <div className="text-emerald-800 font-medium">
                        <strong>Scientific Solution:</strong> {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={handleResetAssessment}
                className="font-montserrat font-bold"
              >
                RETRY ASSESSMENT
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<Check className="w-4 h-4" />}
                onClick={onClose}
                className="font-montserrat font-bold cursor-pointer"
              >
                RETURN TO WORLD MAP
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
